// file: validate.js
//
// description: exports a function to validate if a request is from Slack
//

// include modules
//
const crypto = require('crypto');
const qs = require('qs');

// ----------------------------------------------------------------------------
// function: validateRequest
//
// description:
//   - validates if request came from Slack using the methodology outlined here
//     https://api.slack.com/authentication/verifying-requests-from-slack
//   - logs status to console
//
// return: Boolean validStatus
//
function validateRequest(req, slackSigningSecret) {
    // set return value (default to invalid request)
    //
    let validStatus = false;
    
    // collect information from request
    //
    const slackSignature = req.headers['x-slack-signature'];
    const requestBody = qs.stringify(req.body, { format: 'RFC1738' });
    const timestamp = req.headers['x-slack-request-timestamp'];
    
    // check if request is older than 5 minutes
    // returning invalid (false) if so
    //
    const time = Math.floor(new Date().getTime()/1000); // time in seconds
    if (Math.abs(time - timestamp) > 300) {
	console.log('Ignoring request... (older than 5 minutes)\n');
	return validStatus;
    }
    
    // construct signature base string
    //
    const sigBasestring = 'v0:' + timestamp + ':' + requestBody;
    
    // hash string and take hex digest of the hash
    //
    const signature = 'v0=' + crypto.createHmac('sha256', slackSigningSecret)
          .update(sigBasestring, 'utf8')
          .digest('hex');
    
    // compare the resulting signature to the header on the request
    //
    if (crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(slackSignature, 'utf8'))) {
	console.log('Verification succeeded\n');
	validStatus = true;
	return validStatus;
    } else {
	console.log('Verification failed\n');
	return validStatus;
    }
}
//
// end of function: validateRequest
// ----------------------------------------------------------------------------

// module exports
//
module.exports = {
    validateRequest
};

//
// end of file
