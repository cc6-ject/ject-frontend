const dev = {
  s3: {
    REGION: "ap-northeast-1",
    BUCKET: "ject-stats"
  },
  apiGateway: {
    REGION: "ap-northeast-1",
    URL: "https://32wmy1b1sj.execute-api.ap-northeast-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "ap-northeast-1",
    USER_POOL_ID: "ap-northeast-1_XQ4u2J77c",
    APP_CLIENT_ID: "24i4j0mqpgtnnklk54ri710gef",
    IDENTITY_POOL_ID: "ap-northeast-1:b48ab953-81a1-419e-a17d-decda53b2cd3"
  },
  social: {
    FB: "1719505251494936"
  }
};

const prod = {
  s3: {
    REGION: "YOUR_PROD_S3_UPLOADS_BUCKET_REGION",
    BUCKET: "YOUR_PROD_S3_UPLOADS_BUCKET_NAME"
  },
  apiGateway: {
    REGION: "YOUR_PROD_API_GATEWAY_REGION",
    URL: "YOUR_PROD_API_GATEWAY_URL"
  },
  cognito: {
    REGION: "YOUR_PROD_COGNITO_REGION",
    USER_POOL_ID: "YOUR_PROD_COGNITO_USER_POOL_ID",
    APP_CLIENT_ID: "YOUR_PROD_COGNITO_APP_CLIENT_ID",
    IDENTITY_POOL_ID: "YOUR_PROD_IDENTITY_POOL_ID"
  },
  social: {
    FB: "1719505251494936"
  }
};

// Default to dev if not set
const config = process.env.FRONTEND_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
