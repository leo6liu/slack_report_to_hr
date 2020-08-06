// file: slack_report_to_hr/report-to-hr.js
//
// npm dependencies: express, xmlhttprequest
//

// include modules
//
const express = require('express');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const validate = require('./functions/validate.js'); // validate request is from Slack
const msgAction = require('./functions/interaction_payload_handlers/message-action.js');
const viewSub = require('./functions/interaction_payload_handlers/view-submission.js');

// define constants
//
const FORWARD_CHANNEL_ID = 'G017A66DXFU'; // to be deprecated
const HR_EMAIL_ADDRESS = 'rktliu.001@gmail.com'; // to be implemented
const PORT = 8080; // port to listen for message_action
const SLACK_API_URL = 'https://slack.com/api';
const SLACK_OAUTH_TOKEN = 'xoxb-1214041371813-1283814382608-yGVs0edwBQ1SBvN4aOz8TG0o';
const SLACK_SIGNING_SECRET = 'b6946a6e5bf78e0fa524f8263fbdcdce';

// create express app to listen for events
//
const app = express(); // create express messageAction
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle report-to-hr post requests
// expected request: message_action
//
app.post('/report-to-hr', (req, res) => {
    // print time and request body to terminal
    //
    console.log('\nnew /report-to-hr request');
    console.log(new Date().toString());
    console.log('body:\n' + JSON.stringify(req.body) + '\n');
    
    // if validation fails, send status 400 and exit
    // else, send status 200 and continue
    //
    if (validate.validateRequest(req, SLACK_SIGNING_SECRET) == false) {
	return (res.status(400).send('Verification failed'));
    } else {
	res.status(200).send();
    }
    
    // extract payload from reqest body
    //
    const payload = JSON.parse(req.body.payload);
    //console.log('payload:\n' + JSON.stringify(payload) + '\n');

    // choose request handler based on payload type
    //
    if (payload.type == 'message_action') {
	console.log('detected payload type: message_action\n');
	msgAction.messageAction(payload, SLACK_API_URL, SLACK_OAUTH_TOKEN);
    } else if (payload.type == 'view_submission') {
	console.log('detected payload type: view_submission\n');
	viewSub.viewSubmission(payload, SLACK_API_URL, SLACK_OAUTH_TOKEN,
			       HR_EMAIL_ADDRESS);
    } else {
	console.log('Unrecognized payload type...');
	console.log('No action taken.\n');
    }
    
    // print status message
    //
    console.log('Waiting for next request...\n');
});


// print status message
//
console.log('Waiting for requests...');

// listen indefinitely on specified port
//
app.listen(PORT, '0.0.0.0');

//
// end of file
