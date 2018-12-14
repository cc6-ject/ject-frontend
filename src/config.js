const dev = {
  s3: {
    REGION: 'ap-northeast-1',
    BUCKET: 'ject-api-dev-attachmentsbucket-1sd5da289tltp'
  },
  apiGateway: {
    REGION: 'ap-northeast-1',
    URL: 'https://rkj6psmakh.execute-api.ap-northeast-1.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'ap-northeast-1',
    USER_POOL_ID: 'ap-northeast-1_MAxojmp1N',
    APP_CLIENT_ID: '4ralguhavht02slitv06gi8lvq',
    IDENTITY_POOL_ID: 'ap-northeast-1:ce2d9e32-860c-4759-8313-71b8ad3d092a'
  },
  social: {
    facebook: {
      ID: '1719505251494936',
      URL: 'https://connect.facebook.net/en_US/sdk.js'
    }
  },
  randomImage: {
    // Because of CORS in local CORS proxy was set.
    URL: 'https://cors-anywhere.herokuapp.com/https://lorempixel.com/800/600/'
    // URL: 'https://picsum.photos/800/600/?random'
  }
};

// TODO:
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
    facebook: {
      ID: '1719505251494936',
      URL: 'https://connect.facebook.net/en_US/sdk.js'
    }
  },
  randomImage: {
    URL: 'https://cors-anywhere.herokuapp.com/https://lorempixel.com/800/600/'
    // URL: 'https://picsum.photos/800/600/?random'
  }
};

// Default to dev if not set
const config = process.env.FRONTEND_STAGE === 'prod' ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
