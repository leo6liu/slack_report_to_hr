// file: slack_report_to_hr/functions/interaction_payload_handlers/
//   view_submission.js
//
// description: exports a function to handle a request with payload type
//   view_submission
//

// include modules
//
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// ----------------------------------------------------------------------------
// function: viewSubmission
//
// description: ...
//
// return: Number status (default to 0)
//
function viewSubmission(payload, SLACK_API_URL, SLACK_OAUTH_TOKEN,
			HR_EMAIL_ADDRESS) {    
    // create and send users.info GET request
    //
    const xhr = new XMLHttpRequest();
    xhr.open('GET', SLACK_API_URL + '/users.info?' +
	     'user=' + encodeURIComponent(payload.user.id), false);
    xhr.setRequestHeader('Authorization', 'Bearer ' + SLACK_OAUTH_TOKEN);
    xhr.send();
    console.log('user.info response status: ', xhr.status);
    console.log('user.info response text: ', xhr.responseText, '\n');
    
    // extract reporter's name from users.info responseText
    //
    const reporterName = JSON.parse(xhr.responseText).user.real_name;
    console.log('Reporter\'s name: ', reporterName, '\n');
    
    // extract reported post's permalink from payload
    //   located in: payload.view.blocks[1].text.text
    //
    const permalinkLeftChar = payload.view.blocks[1].text.text.indexOf('<'); // first '<'
    const permalinkRightChar = payload.view.blocks[1].text.text.indexOf('|', permalinkLeftChar); // first '|' after first '<'
    const permalink = payload.view.blocks[1].text.text.substring(permalinkLeftChar + 1, permalinkRightChar);
    console.log('Reported post\'s permalink: ', permalink, '\n');

    // extract message text from payload
    //
    const msgText = payload.view.blocks[2].elements[0].text;
    console.log('Reported message text:\n', msgText, '\n');
    
    // extract report reason from payload
    //
    const reportReason = payload.view.state.values['report-reason']['reason-value'].value;
    console.log('Report reason: ', reportReason, '\n');
    
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
    */

    // create and send email to HR_EMAIL_ADDRESS
    //
    console.log('Generating email to HR...\n');

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
    viewSubmission
};

//
// end of file
