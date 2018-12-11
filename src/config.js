const dev = {
  s3: {
    REGION: 'ap-northeast-1',
    BUCKET: 'ject-api-dev-attachmentsbucket-jxmku0zj86ek'
  },
  apiGateway: {
    REGION: 'ap-northeast-1',
    URL: 'https://vn6s57z8n5.execute-api.ap-northeast-1.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'ap-northeast-1',
    USER_POOL_ID: 'ap-northeast-1_sVXIP2S8W',
    APP_CLIENT_ID: '6hjtq2q8aqrekdvujgbghppf3j',
    IDENTITY_POOL_ID: 'ap-northeast-1:1193783b-97f1-4754-91c0-5ada335570dc'
  },
  social: {
    FB: '1719505251494936'
  }
};

const prod = {
  s3: {
    REGION: 'YOUR_PROD_S3_UPLOADS_BUCKET_REGION',
    BUCKET: 'YOUR_PROD_S3_UPLOADS_BUCKET_NAME'
  },
  apiGateway: {
    REGION: 'YOUR_PROD_API_GATEWAY_REGION',
    URL: 'YOUR_PROD_API_GATEWAY_URL'
  },
  cognito: {
    REGION: 'YOUR_PROD_COGNITO_REGION',
    USER_POOL_ID: 'YOUR_PROD_COGNITO_USER_POOL_ID',
    APP_CLIENT_ID: 'YOUR_PROD_COGNITO_APP_CLIENT_ID',
    IDENTITY_POOL_ID: 'YOUR_PROD_IDENTITY_POOL_ID'
  },
  social: {
    FB: '1719505251494936'
  }
};

// Default to dev if not set
const config = process.env.FRONTEND_STAGE === 'prod' ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
