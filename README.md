# Wavefront Serverless Rollback Plugin Demo

This is a demo for the Wavefront rollback plugin. 

How it works:
* This Lambda function will send mock metric data to Wavefront
* The plugin uses the `wavefrontRollbackCondition` ts query in `severless.yml` to determine the health of your function
* If the ts query condition is triggered it will rollback function

### Running
Assuming you have cloned plugin to [path/to/wavefront-serverless-rollback-plugin]
* Switch to cloned directory
* Install plugin with `npm install [path/to/wavefront-serverless-rollback-plugin]`
* Setup the Wavefront proxy's host and port in `serverless.yml`
* Setup the Wavefront plugin options in `serverless.yml`, including the API key
* Run `serverless deploy`
* Test the service using the endpoint reported by serverless e.g. `curl https://931s566921.execute-api.us-east-1.amazonaws.com/dev/process`

