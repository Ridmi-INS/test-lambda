# realtime-auth-deployment

This repository contains two main parts:

1. Lambda function code for deploying changes to Auth0.
2. The declaration of the auth roles and permissions in the `authDeclaration.json` file

## Building the Lambda Function

1. Run `npm ci && npm build`
2. Upload the zip file to AWS Lambda. I don't have a SkyU way to deploy it yet.

## Making roles and permissions changes

1. Make a new branch from `main`.
2. Update the `authDeclaration.json`. Add any new permissions to the `permissions` array, and add any new roles or role-permission assignments to the `rolePermissions` object.
3. Make a PR into the `main` branch, get someone to review it, and make sure it passes checks.
4. There should be some way to deploy `main` branch on SkyU after the PR is merged. I'm working on it.
