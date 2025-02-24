import { Handler } from "aws-lambda";
import { getMedications } from "@medication-management/core/medication-management";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (_event) => {
  try {
    const medications = await getMedications(docClient);

    return {
      statusCode: 200,
      body: JSON.stringify(medications),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify({message: e.message}),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};