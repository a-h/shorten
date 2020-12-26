# Shorten

A URL shortener that demonstrates the use of AWS CDK to build an AppSync API for managing URL, and a Web front-end.

## How the project was built

Create a project without installing CDK globally.

```
npx cdk init app --language=typescript
```

I put the GraphQL schema into a graphql directory and referenced it from the CDK stack.

To deploy it, I ran `npx cdk deploy`. Firstly, it complained that I hadn't added the CDK bootstrap stack to the environment and gave an error message about an unknown account and region. I've got no idea what that is, but I installed it into my test account with `cdk bootstrap`.

After that, I got a failed stack, but it turned out to be that the GraphQL was invalid. I expected a warning from the code but I had to trudge through the cloudformation events. There's no CDK command to get the events, so I had to look up the cloudformation CLI parameters.

To run a GraphQL query, I dug out Postman, and ran this against it. One peculiarity of AppSync is that it always requires an API key as a host-header, so it makes it harder to use most tools. I'll find out a way to host the GraphiQL playground alongside.

```
mutation Mutation {
  shorten(input: { url: "https://google.com" }) {
      id
  }
}
```

Of course, it's possible to run the same thing in `curl`:

```
curl --location --request POST 'https://xxxxxx.appsync-api.eu-west-2.amazonaws.com/graphql' \
--header 'X-API-Key: da2-7ax3ef75nbdsdhz2dedi2733ry' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation Mutation {\n  shorten(input: { url: \"https://google.com\" }) {\n      id\n  }\n}","variables":{}}'
```

I found it difficult to find the type for the Lambda AppSync trigger, but it's here - AppSyncResolverEvent.

```
npm install @types/aws-lambda --save-dev
```

```
import { AppSyncResolverEvent } from "aws-lambda";
```

AppSyncResolverEvent is a generic that contains the "arguments" type.
