import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { addMedication } from "@medication-management/core/medication-management";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//Add a medication
export const handler: Handler = async (event: APIGatewayProxyEventV2) => {
  try {
    if (event.body === undefined) {
      return {
        statusCode: 403,
        body: JSON.stringify({message: "invalid body format"}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    }
    const medication = JSON.parse(event.body);
    await addMedication(docClient, medication);
    return {
      statusCode: 200,
      body: 'success',
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({message: e.message}),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

};