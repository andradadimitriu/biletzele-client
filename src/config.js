//TODO change to each env on one file
// configure prod
// Default to local if not set

const config = {
  websocketHostname: "wss://a2d765ch40.execute-api.eu-west-2.amazonaws.com/dev",
  apiGateway: {
    API_NAME: "notes",
    REGION: "eu-west-2",
    URL: "https://gghofhd4lk.execute-api.eu-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_8kanfICZV",
    APP_CLIENT_ID: "7h5je0q4b87c2b8dptt20e73in", //TODO change to new client id
    IDENTITY_POOL_ID: "eu-west-2:5416aaa4-6fa6-45f4-8572-ac619bb524bb"
  }
};
export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};

