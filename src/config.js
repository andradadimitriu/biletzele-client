const dev = {
  s3: {
    REGION: "eu-west-2",
    BUCKET: "notes-app-uploadsw" // might be notes-app-uploadsq
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://gghofhd4lk.execute-api.eu-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_YGeyMeU3o",
    APP_CLIENT_ID: "5rnfhc337p5q05l4infvvavts9",
    IDENTITY_POOL_ID: "eu-west-2:ae6f9af5-6c47-4535-af03-069fe51ab068"
  }
};
const prod = dev;//TODO configure prod
// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};