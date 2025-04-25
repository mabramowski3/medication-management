# Medication Manager

Allows you to define a schedule of medication doses, and track which doses have been taken.
A small scale app that was made in ~6 hours, with most of the time spent on the front-end and learning SST.
## Requirements

* [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [AWS Credentials](https://sst.dev/docs/iam-credentials)

## Setup

1. Run `npm install`
2. Run `npx sst secret set ApiKey <API_KEY>`. Replace `<API_KEY>` with the Api Key you want to use. You can generate a UUIDv4 to use as a key with `node gen-api-key.js`
3. Run `npx sst deploy` OR `npx sst dev`

`npx sst deploy` will deploy all of the infrastructure to AWS. 
`npx sst dev` will run the the frontend locally, deploy everything else to AWS, and run the lambdas in live mode.  
Once you are done with dev mode, you'll need to run `npx sst deploy` to get the lambdas out of live mode. 
Whenever I run `sst dev` in a new project, it fails the first time, but works the second time. So if it fails the first time you try the command, give it a bit then try again. Seems to be related to the creation of the AppSync Events API endpoint it needs for live lambda development.

## Cleanup

`npx sst remove` will remove all AWS resources allocated specifically for this app. However, this will not remove the state and bootstrap resources SST allocates for all apps. Removing those has to be done manually.

To remove the bootstrap and state resources:

* Remove the S3 buckets `sst-state-<hash>` and `sst-asset-<hash>`
* Delete the SSM parameters stored under `/sst/passphrase/` and `/sst/bootstrap`
* Delete the ECR repository named `sst-asset`
* Remove the AppSync Events API endpoint used for Live Lambda Development
  
