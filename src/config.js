const dev = {
  s3: {
    REGION: 'ap-northeast-1',
    BUCKET: 'ject-api-dev-attachmentsbucket-b9unefysadas'
  },
  apiGateway: {
    REGION: 'ap-northeast-1',
    URL: 'https://58mrtn1c88.execute-api.ap-northeast-1.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'ap-northeast-1',
    USER_POOL_ID: 'ap-northeast-1_y2kBEwVTR',
    APP_CLIENT_ID: '49h6n4r61frij766uakgjjsoqf',
    IDENTITY_POOL_ID: 'ap-northeast-1:1cab8c85-9f80-48b4-96cd-be0602ee40f9'
  },
  social: {
    facebook: {
      ID: '1719505251494936',
      URL: 'https://connect.facebook.net/en_US/sdk.js'
    }
  },
  randomImage: {
    URL: 'https://picsum.photos/800/600/?random'
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
    URL: 'https://picsum.photos/800/600/?random'
  }
};

// Default to dev if not set
const config = process.env.FRONTEND_STAGE === 'prod' ? prod : dev;
const stage = process.env.FRONTEND_STAGE;
console.log(stage);

const color = {
  primary: {
    light: '#4A6572',
    main: '#344955',
    dark: '#344955',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#F9AA33',
    contrastText: '#000'
  }
};

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...color,
  ...config,
  stage
};
