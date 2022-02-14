const config = {
  env: process.env.REACT_APP_ENV,
  websocketHostname: process.env.REACT_APP_WEBSOCKET_HOSTNAME,
  apiGateway: {
    API_NAME: process.env.REACT_APP_API_NAME,
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID
  }
};
export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
