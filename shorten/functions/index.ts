import { AppSyncResolverEvent } from "aws-lambda";
import { Url, MutationShortenArgs } from "../graphql/types";
import { DynamoDB } from "aws-sdk";
import {PutItemInput} from "aws-sdk/clients/dynamodb";

// The event passed looks like this.
/*
const event = {
  arguments: { input: { url: "https://google.com" } },
  identity: null,
  source: null,
  request: {
    headers: {
      "x-forwarded-for": "82.27.185.175, 70.132.46.164",
      "cloudfront-viewer-country": "GB",
      "cloudfront-is-tablet-viewer": "false",
      via: "2.0 141b2946c85d0758bf433bc8ee4a9298.cloudfront.net (CloudFront)",
      "cloudfront-forwarded-proto": "https",
      "x-api-key": "da2-xxxxxxxxxxxxxxxxxxxxxx",
      "content-type": "application/json",
      "x-amzn-trace-id": "Root=1-5fe755ac-1ad1a38b6f72e6114bec8f70",
      "x-amz-cf-id": "KG6VMDjaccRhjcBCa6anomO7jz8WoBXgSkli62XtBSq0kg5ylsCwFQ==",
      "content-length": "117",
      "x-forwarded-proto": "https",
      host: "xxxxxxxxxxxxxxxxxx.appsync-api.eu-west-2.amazonaws.com",
      "user-agent": "curl/7.64.1",
      "cloudfront-is-desktop-viewer": "true",
      "cloudfront-is-mobile-viewer": "false",
      "x-forwarded-port": "443",
      "cloudfront-is-smarttv-viewer": "false",
    },
  },
  prev: null,
  info: {
    selectionSetList: ["id"],
    selectionSetGraphQL: "{\\n  id\\n}",
    parentTypeName: "Mutation",
    fieldName: "shorten",
    variables: {},
  },
  stash: {},
};
*/

export const handler = async (
  event: AppSyncResolverEvent<MutationShortenArgs>
): Promise<Url> => {
  const db = new DynamoDB.DocumentClient();
  await db
    .put({
      TableName: process.env.DYNAMO_TABLE,
      Item: {
        _id: event.arguments.input.url,
      },
    } as PutItemInput)
    .promise();
  return {
    id: "123",
    short: "shortURL",
    long: event.arguments.input.url,
    count: 0,
  };
};
