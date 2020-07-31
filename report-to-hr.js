// file: report-to-hr.js
//
// description: ...
//

// set port, credentials, and app variables
//
const messageActionPort = 8080; // port to listen for message_action
const optionsLoadPort = 8081; // port to listen for options_load
const slackToken = 'xoxb-1214041371813-1283814382608-dTiIFmKzeTFqdBS84eoC8sDR';
const slackSigningSecret = 'b6946a6e5bf78e0fa524f8263fbdcdce';
const forwardChannelID = 'G017A66DXFU'; // to be deprecated
const hrEmailAddr = 'rktliu.001@gmail.com'; // to be implemented

// include modules
//
const express = require('express');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const validate = require('./validate.js'); // validate request is from Slack

// create express app to listen for events
//
const app = express(); // create express messageAction
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle report-to-hr-options-load post requests
// expected request:
//
app.post('/report-to-hr-options-load', (req, res) => {
    // print time and request body to terminal
    //
    console.log('\nnew report-to-hr-options-load request (' +
		new Date().toString() + ')');
    console.log('body: \n', req.body);
    
    // end response if request fails validation
    //
    if (validate.validateRequest(req, slackSigningSecret) == false) {
	return res.status(400).send('Verification failed');
    }

    // close response
    //
    res.end();
});

// handle report-to-hr post requests
// expected request: message_action
//
app.post('/report-to-hr', (req, res) => {
    // print time and request body to terminal
    //
    console.log('\nnew report-to-hr request (' + new Date().toString() + ')');
    console.log('body: \n', req.body);
    
    // end response if request fails validation
    //
    if (validate.validateRequest(req, slackSigningSecret) == false) {
	return res.status(400).send('Verification failed');
    }

    // close response
    //
    res.end();
    
    // extract payload from reqest body
    // extract reporter user ID from payload
    // extract trigger_id from payload
    //
    const payload = JSON.parse(req.body.payload);
    const reporterID = payload.user.id;
    const triggerID = payload.trigger_id;
    console.log('payload:\n', payload);
    // create and send chat.getPermalink GET request
    //
    console.log('creating chat.getPermalink GET request...');
    const xhr_a = new XMLHttpRequest();
    xhr_a.open('GET', 'https://slack.com/api/chat.getPermalink?' +
	       'channel=' + encodeURIComponent(payload.channel.id) + '&' +
	       'message_ts=' + encodeURIComponent(payload.message_ts), false);
    xhr_a.setRequestHeader('Authorization', 'Bearer ' + slackToken);
    xhr_a.send();
    console.log('chat.getPermalink request status: ', xhr_a.status);
    console.log('chat.getPermalink response text: ', xhr_a.responseText, '\n');
    
    // extract permalink from responseText
    //
    const permalink = JSON.parse(xhr_a.responseText).permalink;

    // get report text
    //
    const reportReason = 'uhh, idk...';

    /*
    console.log('creating dialog.open POST request...');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://slack.com/api/dialog.open', false);
    xhr.setRequestHeader('Authorization', 'Bearer ' + slackToken);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
	'dialog': {
	    'callback_id': 'placeholder_001',
	    'title': 'Report to HR',
	    'submit_label': 'Report',
	    'notify_on_cancel': true,
	    'state': 'Limo',
	    'elements': [
		{
		    'type': 'textarea',
		    'label': 'pickup location',
		    'name': 'reason_text'
		}
	    ]
	},
	'trigger_id': triggerID
    }));
    console.log('dialog.open response status: ', xhr.status);
    console.log('dialog.open response text: ', xhr.responseText, '\n');
    */

    
    // format message text
    //
    const reportText = 'User <@' + reporterID + '>, ' +
	  'has reported the following message: ' + permalink + '\n\n' +
	  'Reason for report: \n' + reportReason;
    
    // create and send chat.postMessage POST request
    //
    console.log('creating chat.postMessage POST request...');
    const xhr_b = new XMLHttpRequest();
    xhr_b.open('POST', 'https://slack.com/api/chat.postMessage', false);
    xhr_b.setRequestHeader('Authorization', 'Bearer ' + slackToken);
    xhr_b.setRequestHeader('Content-Type', 'application/json');
    xhr_b.send(JSON.stringify({
	'channel': forwardChannelID,
	'text': reportText
    }));
    console.log('chat.postMessage response status: ', xhr_b.status);
    console.log('chat.postMessage response text: ', xhr_b.responseText, '\n');
    
    // create and send email to hrEmailAddr
    //
    
    // print status message
    //
    console.log('Waiting for next request...\n');
});

// listen indefinitely on specified port
//
app.listen(messageActionPort, '0.0.0.0');

//
// end of file
