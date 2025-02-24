import { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

export async function getMedications(db: DynamoDBDocumentClient) {
  const result = await db.send( new ScanCommand({TableName: Resource.Medications.name }));
  return result.Items;
}

export async function addMedication(db: DynamoDBDocumentClient, medication: any) {
  const result = await db.send(new PutCommand({
    TableName: Resource.Medications.name,
    Item: medication
  }));
  return result;
}

//adds the current day to the medications taken_doses list. If the day is already in the list, remove the day instead.
export async function updateTakenDose(db: DynamoDBDocumentClient, medicationName: string, day: string) {
  const getResults = await db.send( new GetCommand({
    TableName: Resource.Medications.name,
    Key: {
      name: medicationName
    },
    AttributesToGet: ['takenDoses']
  }));
  let takenDoses: string[] = getResults.Item?.takenDoses;
  if (!takenDoses) {
    takenDoses = [day];
  } else if (takenDoses.includes(day)) {
    takenDoses = takenDoses.filter(d => d !== day);
  } else {
    takenDoses.push(day);
  }
  //TODO is appending to a list in dynamoDB faster than setting the entire new list? Is there a way to bring this down to one dynamodb call?
  const result = await db.send(new UpdateCommand({
    TableName: Resource.Medications.name,
    Key: {
      name: medicationName,
    },
    UpdateExpression: "set takenDoses = :takenDoses",
    ExpressionAttributeValues: {
      ":takenDoses": takenDoses
    },
    ReturnValues: "ALL_NEW"
  }));
  return result?.Attributes?.takenDoses;
}

export async function updateActiveStatus(db: DynamoDBDocumentClient, medicationName: string, active: boolean) {
  const result = await db.send(new UpdateCommand({
    TableName: Resource.Medications.name,
    Key: {
      name: medicationName,
    },
    UpdateExpression: "set active = :active",
    ExpressionAttributeValues: {
      ":active": active
    },
    ReturnValues: "ALL_NEW"
  }));
  return result?.Attributes?.active;
}