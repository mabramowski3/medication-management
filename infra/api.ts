import { table } from "./storage";

const api = new sst.aws.ApiGatewayV2("MyApiGateway");

const apiKeySecret = new sst.Secret("ApiKey");

const authorizer = api.addAuthorizer({
  name: "apiTokenAuthorizer",
  lambda: {
    function: {
      handler: "packages/functions/src/auth.handler",
      link: [apiKeySecret]
    },
    identitySources: ["$request.header.x-api-key"]
  }
});

api.route("GET /medications", {
  handler: "packages/functions/src/get-medications.handler",
  nodejs: {
    install: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"]
  },
  link: [table],
  }, {
  auth: {
    lambda: authorizer.id
    }
  }
);

api.route("POST /medications", {
  handler: "packages/functions/src/add-medication.handler",
  nodejs: {
    install: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"]
  },
  link: [table],
  }, { 
  auth: {
    lambda: authorizer.id
  }
  }
);

api.route("PATCH /medications/update-taken-dose", {
  handler: "packages/functions/src/update-taken-dose.handler",
  nodejs: {
    install: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"]
  },
  link: [table],
  }, { 
  auth: {
    lambda: authorizer.id
  }
  }
);

api.route("PATCH /medications/update-active-status", {
  handler: "packages/functions/src/update-active-status.handler",
  nodejs: {
    install: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"]
  },
  link: [table],
  }, { 
  auth: {
    lambda: authorizer.id
  }
  }
);


new sst.aws.StaticSite("MedicationManagerWeb", {
  path: "packages/web",
  build: {
    command: "npm run build",
    output: "dist",
  },
  environment: {
    VITE_API_URL: api.url,
    VITE_API_KEY: apiKeySecret.value,
  },
});