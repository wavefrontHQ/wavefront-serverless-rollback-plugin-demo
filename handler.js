//
// Copyright (c) 2017 Wavefront. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Set to true to trigger an automatic rollback
const HIGH_ERROR_RATE = false

const net = require('net');
const HOST = process.env.WAVEFRONT_PROXY_HOST;
const PORT = process.env.WAVEFRONT_PROXY_PORT;

module.exports.transaction = (event, context, callback) => {
	let status = processTransaction();
	if (status) {
		sendWavefrontMetric(1, 'demoapp.mymetric.success', callback);
	} else {
		sendWavefrontMetric(1, 'demoapp.mymetric.error', callback);
	}
};

function sendWavefrontMetric(value, metricName, callback) {
	const metric = metricName
				+ ' ' + value
				+ ' ' + Math.floor(new Date() / 1000)
				+ ' source=' + process.env.AWS_LAMBDA_FUNCTION_NAME
				+ '\n';

	var reply = {
		statusCode: 200,
		body: 'SENT to Wavefront: ' + metric
	};
	var client = net.connect(PORT, HOST, () => {
		console.log('connected to server!');
		console.log('sending ' + metric);
		client.write(metric, () => { client.end(); });
	});
	client.on('data', (data) => {
		console.log(data.toString());
		reply.body += ' REPLY: ' + data.toString();
		client.end();
	});
	client.on('error', (error) => {
	  	console.log('error received ' + error.toString());
	  	reply.body += ' REPLY: ' + error.toString();
	  	callback(null, reply);
	});
	client.on('end', () => {
	  	console.log('disconnected from server');
   	 	callback(null, reply);
	});
}

function processTransaction() {
	if (HIGH_ERROR_RATE) {
		return getRandomInt(-10, 1) >= 0;
	} else {
		return getRandomInt(-1, 10) >= 0;
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

