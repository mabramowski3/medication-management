import { Handler } from "aws-lambda";
import { updateActiveStatus } from "@medication-management/core/medication-management";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event) => {
  try {
    if (event.body === undefined) {
      return {
        statusCode: 403,
        body: JSON.stringify({message:"invalid body format"}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    }
    const body = JSON.parse(event.body);
    const result = await updateActiveStatus(docClient, body.medicationName, body.active);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json",
      },
    };

  } catch (e: any) {
    return {
      statusCode: 500,
      body: {message: JSON.stringify(e.message)},
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};