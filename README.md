# Medication Manager

Allows you to define a schedule of medication doses, and track which doses have been taken.

## Requirements

* [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [AWS Credentials](https://sst.dev/docs/iam-credentials)

## Setup

1. Run `npm install`
2. Run `npx sst secret set ApiKey <API_KEY>`. Replace `<API_KEY>` with the Api Key you want to use, such as an UUIDv4
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

## Thoughts

This app is intended to help caregivers keep track of medications they need to give to their patients. The app currently tracks only medications, and has no way to differentiate between different caregivers and/or patients. Adding support for those things would have greatly increased scope. This app is essentially a quick prototype made with minimal/no input from Product. 

I focused on completing the features I would want input from other teams(like Product) on. That said, I believe I covered all of the requirements for the assignment, with the exception of testing. Testing is there, but very very minimal. I made sure the code was testable, but deprioritized actually writing the tests. In a production environment, I would be wary of spending too much time on tests at this point. There would almost definitely be changes to the core business logic, which would break the tests.

The medications table has a column called takenDoses. It keeps a list of days a medication was taken in yyyy-MM-dd format. If you pass in a day that already exists in the list, it will be removed from the list. The idea was that it would be easy to unset a medication as taken for the day, in case the user accidentially clicked on the wrong medication. I regret not going with just a single lastTaken date here. The list logic is a bit confusing, and won't scale well. Also, keeping track of the history of when meds were taken is not particularly useful right now. 

I made 2 non-REST compliant endpoints. One for updating takenDoses, and one for updating active status. Just using a generic PATCH endpoint might have been easier to deal with. 

The API is secured only by an API KEY. Unfortunately that key is available in the front-end javascript. I'd take a more secure approach if I had the time. 

### Framework

I went with SST for the serverless framework. I spent some time with Serverless Framework, and I liked it, but I wanted to give SST a try too. I'd heard a lot of good things about it, and prefer setting up infra using code instead of yaml files. 

### Database

I went with DynamoDB for storing persistent data. I haven't touched a NoSQL memory store other than Redis in a very long time. Considering we're using serverless infrastructure, now seemed like a good idea to learn the main serverless database in AWS. It's also quicker to set up a NoSQL database than a SQL one, so I'd save some time.

That said, the data for this app is relational. It would be better represented and easier to maintain with SQL. 

If this app was meant to be used in a production environment, I would factor cost into my decision. It's easier to scale DyanmoDB than RDS, and I'd expect sporadic use with this app(I would think most people take their pills around breakfast, dinnertime, etc...) Maybe RDS would become cheaper at a certain scale, I didn't do too much number crunching. 

### Backend

I used SST's monorepo template for this project. It uses domain driven architecture.
* `/infra` is where AWS resources are defined
* `packages/core` is where the business logic is contained
* `packages/functions` is where lambdas are defined
* `packages/scripts` includes scripts that you can run on your SST app using the sst shell CLI and tsx. I ended up not touching this folder for this project.

I included a single backend test, mostly just to prove that the code is testable. To run it, open up a terminal in `packages/core`, run `npm install`, and then run `npm run test`. 

The way things are set up now, it is a bit cumbersome to spy on arguments sent to DynamoDB, and check if they match a specific expected value. Abstracting calls to DynamoDB into typescript files+functions that only care about the data layer would help. Then you can call expect() on the small # of parameters passed to those functions, rather than the more verbose UpdateCommand, PutCommand, etc...

### Frontend

The front end is in a functional state. I'm not that enthuastic about the user experience, but I only have so much time to spend on this app. The way active/inactive meds in the medication list are handled and displayed could be improved, the add medication dialog could display form input errors, more error handling needs to be done in general, etc... The time picker component was AI generated and is kind of wonky, but it's not a feature I wanted to prioritize, and I figured it's better than nothing. 

Whenever an http request is made, a loading screen pops up to prevent further user input until the request is done. I considered doing optimistic updates, but that would have added more complexity.

I organized the frontend folder structure by feature. Almost everything is in the components folder. If I decided to use a routing library, I would make a pages folder containing each route(nested, if necessary).

Tailwind was used for CSS. I like it for creating simple UIs quickly. I'd probably opt for something else if the CSS was going to be very complicated.

I included a single backend test, again mostly just to prove that the code is testable. To run it, open up a terminal in `packages/web`, run `npm install`, and then run `npx vitest`. 