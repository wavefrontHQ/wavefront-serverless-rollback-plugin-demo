# Wavefront Serverless Rollback Plugin Demo

This is a demo for the Wavefront rollback plugin. 

How it works:
* This Lambda function will send mock metric data to Wavefront
* The plugin uses the `wavefrontRollbackCondition` ts query in `severless.yml` to determine the health of your function
* If the alert condition is fulfilled it will trigger rollback the Lambda function
* After rolling back, the Lambda function will delete the alert and itself

### Installing and Running
#### From NPM
* Switch to your own serverless service project directory
* Run `npm install -g wavefront-serverless-rollback-plugin` to install plugin
* Add `wavefront-serverless-rollback-plugin` to plugin list in your `serverless.yml`
* Run `serverless deploy` to deploy your service with the rollback function
#### From Cloned Plugin Repo
Assuming you have cloned plugin to [path/to/wavefront-serverless-rollback-plugin]
* Switch to cloned directory
* Install plugin with `npm install [path/to/wavefront-serverless-rollback-plugin]`
* Setup the Wavefront proxy's host and port in `serverless.yml`
* Setup the Wavefront plugin options in `serverless.yml`, including the API key
* Run `serverless deploy`
* Test the service using the endpoint reported by serverless e.g. `curl https://931s566921.execute-api.us-east-1.amazonaws.com/dev/process`
#### Setup Wavefront Proxy
* Install a Wavefront proxy using method described [here](https://community.wavefront.com/docs/DOC-1271)
* Setup the proxy to be able to collect log data as described [here](https://community.wavefront.com/docs/DOC-1217)
* Add grok pattern (match this to your actual metric pattern):
```
counters:
   - pattern: 'demoapp.%{GREEDYDATA:metricName} %{NUMBER:status} %{NUMBER:time} source=%{GREEDYDATA:funcName}'
     metricName: 'demoapp.%{metricName}'
```