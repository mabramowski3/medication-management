export const table = new sst.aws.Dynamo("Medications", {
    fields: {
      name: "string",
      // Other fields are stored in DynamoDB but don't need to be defined here
    },
    primaryIndex: { 
      hashKey: "name"
    },
  });
