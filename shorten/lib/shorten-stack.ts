import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as db from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import {BillingMode} from "@aws-cdk/aws-dynamodb";

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
    const mutationShortenLambda = new lambda.Function(
      this,
      "mutationShortenLambda",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("./functions"),
        memorySize: 1024,
      }
    );
    // Add a database table and grant read/write access to the Lambda.
    const shortenDb = new db.Table(this, "shortenDb", {
      partitionKey: {
        name: "_id",
        type: db.AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    shortenDb.grantReadWriteData(mutationShortenLambda);
    mutationShortenLambda.addEnvironment("DYNAMO_TABLE", shortenDb.tableName);

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
