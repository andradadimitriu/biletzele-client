export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "eu-west-2",
    BUCKET: "notes-app-uploadsw" // might be notes-app-uploadsq
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://wffq0ipni6.execute-api.eu-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_Kjed57oPH",
    APP_CLIENT_ID: "6n5lqqvadsummf2uhi2fpsj8pd",
    IDENTITY_POOL_ID: "eu-west-2:edf1d5e4-02c4-4e6e-a8bd-d05b41280e54"
  }
};