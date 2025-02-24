import { APIGatewayRequestAuthorizerEvent, Handler } from "aws-lambda";
import { Resource } from "sst";
export const handler: Handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const apiKey = Resource.ApiKey.value;
  const providedKey = event.headers?.["x-api-key"];

  if (!apiKey) {
    return { isAuthorized: false, context: { message: "No api key defined. Please define one and redeploy."}}
  }

  if (apiKey === providedKey) {
    return {
      isAuthorized: true,
      context: { message: "Success"}
    };
  }
  return {
    isAuthorized: false,
    context: {
      message: "Invalid API key"
    }
  };
};
