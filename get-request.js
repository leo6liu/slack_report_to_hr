// file: report-to-hr.js
//
// description: ...
//

// set port, credentials, and app variables
//
const slackToken = 'xoxb-1214041371813-1283814382608-rC5RqZqKXZZuKH5yv4ZjlCk2';

// include modules
//
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// create and send chat.getPermalink GET request
//
const xhrGetP = new XMLHttpRequest();
xhrGetP.open('GET', 'https://slack.com/api/chat.getPermalink?channel=G017A66DXFU&message_ts=1595542026.001000', false);
xhrGetP.setRequestHeader('Authorization', 'Bearer ' + slackToken);
xhrGetP.send();
console.log(xhrGetP.status);
console.log(xhrGetP.responseText);

//
// end of file
