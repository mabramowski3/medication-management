import { DynamoDB } from "aws-sdk";
import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { Example } from "@medication-management/core/example";
import { hello } from "@medication-management/core/medication-management";
const dynamoDb = new DynamoDB.DocumentClient();
export const handler: Handler = async (_event) => {

  return {
    statusCode: 200,
    body: `${Example.hello()} Linked to ${Resource.MyBucket.name}.`,
  };
};
