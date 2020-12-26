import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as db from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as codedeploy from "@aws-cdk/aws-codedeploy";

export class ShortenStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // There's a ./schema.graphql file I added alongside to define the schema for the service.
    // Had to import the required node packages too.
    // The examples here, needed some modification: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-appsync-readme.html
    const api = new appsync.GraphqlApi(this, "api", {
      name: "api",
      schema: appsync.Schema.fromAsset("./graphql/schema.graphql"),
      xrayEnabled: true,
    });

    // print out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // print out the AppSync API Key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // print out the stack region
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    // Create a Lambda and DynamoDB table.
    //TODO: Get a global version number from the git commit hash, or git history etc.
    //TODO: e.g. git rev-list --count HEAD
    const versionNumber = new Date().toISOString();

    const mutationShortenLambda = new lambda.Function(
      this,
      "mutationShortenLambda",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("./functions"),
        memorySize: 1024,
        description: `Build time: ${versionNumber}`,
      }
    );
    mutationShortenLambda.addEnvironment("VERSION", versionNumber);
    // Add a database table and grant read/write access to the Lambda.
    const shortenDb = new db.Table(this, "shortenDb", {
      partitionKey: {
        name: "_id",
        type: db.AttributeType.STRING,
      },
      billingMode: db.BillingMode.PAY_PER_REQUEST,
    });
    shortenDb.grantReadWriteData(mutationShortenLambda);
    mutationShortenLambda.addEnvironment("DYNAMO_TABLE", shortenDb.tableName);

    // Deploy the Lambda using a canary release.
    const application = new codedeploy.LambdaApplication(
      this,
      "apiDeployment",
      { applicationName: "apiDeployment" }
    );
    const version = mutationShortenLambda.addVersion(versionNumber);
    const version1Alias = new lambda.Alias(
      this,
      "mutationShortenVersionAlias",
      {
        aliasName: "prod",
        version,
      }
    );
    new codedeploy.LambdaDeploymentGroup(this, "canaryDeployment", {
      application,
      alias: version1Alias,
      deploymentConfig:
        codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
    });

    // Set up the Lambda to handle the mutation part of the GraphQL.
    const mutationShortenLambdaDS = api.addLambdaDataSource(
      "mutationShortenLambda",
      mutationShortenLambda
    );
    mutationShortenLambdaDS.createResolver({
      typeName: "Mutation",
      fieldName: "shorten",
    });
  }
}
