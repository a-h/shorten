import { AppSyncResolverEvent } from "aws-lambda";

// {\"arguments\":{\"input\":{\"url\":\"https://google.com\"}},\"identity\":null,\"source\":null,\"request\":{\"headers\":{\"x-forwarded-for\":\"82.27.185.175, 70.132.46.164\",\"cloudfront-viewer-country\":\"GB\",\"cloudfront-is-tablet-viewer\":\"false\",\"via\":\"2.0 141b2946c85d0758bf433bc8ee4a9298.cloudfront.net (CloudFront)\",\"cloudfront-forwarded-proto\":\"https\",\"x-api-key\":\"da2-7ax3ef75nbdsdhz2dedi2733ry\",\"content-type\":\"application/json\",\"x-amzn-trace-id\":\"Root=1-5fe755ac-1ad1a38b6f72e6114bec8f70\",\"x-amz-cf-id\":\"KG6VMDjaccRhjcBCa6anomO7jz8WoBXgSkli62XtBSq0kg5ylsCwFQ==\",\"content-length\":\"117\",\"x-forwarded-proto\":\"https\",\"host\":\"37sgiungq5g27bhmbcne4hjgb4.appsync-api.eu-west-2.amazonaws.com\",\"user-agent\":\"curl/7.64.1\",\"cloudfront-is-desktop-viewer\":\"true\",\"cloudfront-is-mobile-viewer\":\"false\",\"accept\":\"*/*\",\"x-forwarded-port\":\"443\",\"cloudfront-is-smarttv-viewer\":\"false\"}},\"prev\":null,\"info\":{\"selectionSetList\":[\"id\"],\"selectionSetGraphQL\":\"{\\n  id\\n}\",\"parentTypeName\":\"Mutation\",\"fieldName\":\"shorten\",\"variables\":{}},\"stash\":{}}

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

export interface ShortenInput {
  url: String;
}

export interface ShortenArguments {
  input: ShortenInput;
}

export interface URL {
  id: String;
  short: String;
  long: String;
  count: Number;
}

export const handler = async (
  event: AppSyncResolverEvent<ShortenArguments>
): Promise<URL> => {
  return {
    id: "123",
    short: "shortURL",
    long: event.arguments.input.url,
    count: 0,
  };
};
