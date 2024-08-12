# Lambda Function URL with CloudFront CDK Sample

This project demonstrates how to set up a Lambda Function URL with CloudFront using AWS CDK (Cloud Development Kit). It provides a secure and scalable way to expose Lambda functions through CloudFront distributions.

## Features

- Lambda Function URL creation
- CloudFront distribution setup
- Custom Origin Request Policy
- IAM permissions for CloudFront to access Lambda Function URL

## Prerequisites

- AWS Account
- Node.js (version 20.x or later)
- AWS CDK CLI (version 2.x)
- TypeScript

## Setup

1. Clone the repository:

```
git clone https://github.com/nog/lambda-function-url-cloudfront-cdk.git
cd lambda-function-url-cloudfront-cdk
```

2. Install dependencies:

```
npm install
```

3. Configure your AWS credentials:

```
aws configure
```

## Deployment

1. Synthesize the CloudFormation template:

```
cdk synth
```

2. Deploy the stack:

```
cdk deploy
```

3. After deployment, the CloudFront Distribution URL and Lambda Function URL will be displayed in the output.

## Project Structure

- `lib/function-url-cloudfront-cdk-stack.ts`: Main CDK stack definition
- `src/lambda/index.ts`: Lambda function code
- `bin/function-url-cloudfront-cdk.ts`: CDK app entry point

## Customization

You can customize the Lambda function code in `src/lambda/index.ts` and adjust the CDK stack in `lib/function-url-cloudfront-cdk-stack.ts` to fit your specific requirements.

## Clean Up

To avoid incurring future charges, remember to destroy the resources when you're done:

```
cdk destroy
```

## Security

This sample code is provided for demonstration purposes only. Ensure you review and adjust security settings before using in a production environment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or issues, please open an issue in the GitHub repository.