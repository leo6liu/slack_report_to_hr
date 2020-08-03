// file: slack_report_to_hr/functions/interaction_payload_handlers/
//   message-action.js
//
// description: exports a function to handle a request with payload type
//   message_action
//

// include modules
//
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// ----------------------------------------------------------------------------
// function: messageAction
//
// description: ...
//
// return: Number status (default to 0)
//
function messageAction(payload, SLACK_API_URL, SLACK_OAUTH_TOKEN) {
    // extract reporter's user ID and trigger_id from payload
    //
    const reporterID = payload.user.id;
    const triggerID = payload.trigger_id;

    

    // create and send chat.getPermalink GET request
    //
    console.log('creating chat.getPermalink GET request...');
    const xhr_a = new XMLHttpRequest();
    xhr_a.open('GET', SLACK_API_URL + '/chat.getPermalink?' +
	       'channel=' + encodeURIComponent(payload.channel.id) + '&' +
	       'message_ts=' + encodeURIComponent(payload.message_ts), false);
    xhr_a.setRequestHeader('Authorization', 'Bearer ' + SLACK_OAUTH_TOKEN);
    xhr_a.send();
    console.log('chat.getPermalink request status: ', xhr_a.status);
    console.log('chat.getPermalink response text: ', xhr_a.responseText, '\n');

    // extract permalink from responseText
    //
    const permalink = JSON.parse(xhr_a.responseText).permalink;

    // create and send views.open POST request
    //
    console.log('creating views.open POST request');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', SLACK_API_URL + '/views.open', false);
    xhr.setRequestHeader('Authorization', 'Bearer ' + SLACK_OAUTH_TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
	'trigger_id': triggerID,
	'view': {
	    "title": {
		"type": "plain_text",
		"text": "Report to HR",
		"emoji": true
	    },
	    "submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	    },
	    "type": "modal",
	    "close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	    },
	    "blocks": [
		{
		    "type": "section",
		    "text": {
			"type": "mrkdwn",
			"text": "*Reporter:* <@" + reporterID + ">"
		    }
		},
		{
		    "type": "section",
		    "text": {
			"type": "mrkdwn",
			"text": "*Reported Post:* <" + permalink + "|*permalink to post*>"
		    }
		},
		{
		    "type": "input",
		    "element": {
			"type": "plain_text_input",
			"multiline": true
		    },
		    "label": {
			"type": "plain_text",
			"text": "Reason for Report",
			"emoji": true
		    }
		}
	    ]
	}
    }));
    console.log('views.open request status: ', xhr.status);
    console.log('views.open response test: ', xhr.responseText, '\n');
    
    /*
    // create and send chat.postMessage POST request
    //
    console.log('creating chat.postMessage POST request...');
    const xhr_b = new XMLHttpRequest();
    xhr_b.open('POST', SLACK_API_URL + '/chat.postMessage', false);
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
    */

    // exit normally
    //
    return 0;
}
//
// end of function: messageAction
// ----------------------------------------------------------------------------

// module exports
//
module.exports = {
    messageAction
};

//
// end of file
