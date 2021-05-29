# mongoose-session-issue

## Setup

To test transactions, you need to have a replica set mongoose connection.
I used an atlas cluster to test, but replica sets can be used locally with tools like https://www.npmjs.com/package/run-rs. You can set the env variable `MONGO_URL` to test.

## Running

Run `yarn` to install dependencies.

Run `yarn dev` to run the `sr/index.ts` script.

You should get the following

```
MongoError: Use of expired sessions is not permitted
```
