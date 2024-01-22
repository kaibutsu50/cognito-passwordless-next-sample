import 'dotenv/config'
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Passwordless } from "amazon-cognito-passwordless-auth/cdk";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** Create User Pool */
    const userPool = new cdk.aws_cognito.UserPool(this, "UserPool", {
      signInAliases: {
        username: false,
        email: true,
      },
    });

    /** Add Passwordless authentication to the User Pool */
    const passwordless = new Passwordless(this, "Passwordless", {
      userPool,
      allowedOrigins: [
        process.env.FRONTEND_URL!
      ],
      fido2: {
        allowedRelyingPartyIds: [
          process.env.FRONTEND_HOST!
        ],
      },
      magicLink: {
        sesFromAddress: process.env.SES_FROM_ADDRESS!,
      },
    });

    /** Let's grab the ClientId that the Passwordless solution created for us */
    new cdk.CfnOutput(this, "ClientId", {
      value: passwordless.userPoolClients!.at(0)!.userPoolClientId,
    });

    /** Let's grab the FIDO2 API base URL. This is the API with which (signed-in) users can manage FIDO2 credentials */
    new cdk.CfnOutput(this, "Fido2Url", {
      value: passwordless.fido2Api!.url!,
    });
  }
}
