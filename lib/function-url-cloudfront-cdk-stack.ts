import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class FunctionUrlCloudfrontCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      entry: path.join(__dirname, '../src/lambda/index.ts'),
    });

    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });


    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: functionUrl.url,
      description: 'URL for the Lambda function',
    });

    const oac = new cloudfront.CfnOriginAccessControl(this, 'MyOAC', {
      originAccessControlConfig: {
        name: 'MyOAC',
        originAccessControlOriginType: 'lambda',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    const customOriginRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'CustomOriginRequestPolicy', {
      originRequestPolicyName: 'LambdaFunctionUrlPolicy',
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList('User-Agent', 'Referer'),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
    });

    const distribution = new cloudfront.Distribution(this, 'MyDistribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(cdk.Fn.select(2, cdk.Fn.split('/', functionUrl.url))),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        originRequestPolicy: customOriginRequestPolicy,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
    });

    lambdaFunction.addPermission('AllowCloudFront', {
      principal: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
      action: 'lambda:InvokeFunctionUrl',
      sourceArn: `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
    });

    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', oac.ref);

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });
  }
}
