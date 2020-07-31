// file: slack_report_to_hr/report-to-hr.js
//
// npm dependencies: express, xmlhttprequest
//

// define constants
//
const PORT = 8080; // port to listen for message_action
const SLACK_OAUTH_TOKEN = 'xoxb-1214041371813-1283814382608-df3eJy4bCPB6gIiemppPLgDo';
const SLACK_SIGNING_SECRET = 'b6946a6e5bf78e0fa524f8263fbdcdce';
const FORWARD_CHANNEL_ID = 'G017A66DXFU'; // to be deprecated
const HR_EMAIL_ADDRESS = 'rktliu.001@gmail.com'; // to be implemented

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

    // extract reporter's user ID and trigger_id from payload
    //
    const reporterID = payload.user.id;
    const triggerID = payload.trigger_id;

    // get report reason from user
    //
    let reportReason = '';
    
    // create and send chat.getPermalink GET request
    //
    console.log('creating chat.getPermalink GET request...');
    const xhr_a = new XMLHttpRequest();
    xhr_a.open('GET', 'https://slack.com/api/chat.getPermalink?' +
	       'channel=' + encodeURIComponent(payload.channel.id) + '&' +
	       'message_ts=' + encodeURIComponent(payload.message_ts), false);
    xhr_a.setRequestHeader('Authorization', 'Bearer ' + SLACK_OAUTH_TOKEN);
    xhr_a.send();
    console.log('chat.getPermalink request status: ', xhr_a.status);
    console.log('chat.getPermalink response text: ', xhr_a.responseText, '\n');
    
    // extract permalink from responseText
    //
    const permalink = JSON.parse(xhr_a.responseText).permalink;

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
    xhr_b.setRequestHeader('Authorization', 'Bearer ' + SLACK_OAUTH_TOKEN);
    xhr_b.setRequestHeader('Content-Type', 'application/json');
    xhr_b.send(JSON.stringify({
	'channel': FORWARD_CHANNEL_ID,
	'text': reportText
    }));
    console.log('chat.postMessage response status: ', xhr_b.status);
    console.log('chat.postMessage response text: ', xhr_b.responseText, '\n');
    
    // create and send email to HR_EMAIL_ADDRESS
    //
    
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
