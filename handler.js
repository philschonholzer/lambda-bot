const https = require('https'),
      qs = require('querystring'),
      VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN,
      ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Verify Url - https://api.slack.com/events/url_verification
function verify(data, callback) {
    if (data.token === VERIFICATION_TOKEN) {
        console.log('Verified - respond with challenge');
        const response = {
		    statusCode: 200,
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.challenge
        };
        callback(null, response);
    }
    else callback("verification failed");   
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function postMessage(event, callback) {
    // test the message for a match and not a bot
    if (!event.bot_id && /(aws|lambda)/ig.test(event.text)) {
        var text = `<@${event.user}> isn't AWS Lambda awesome?`;
        var message = { 
            token: ACCESS_TOKEN,
            channel: event.channel,
            text: text
        };

        var query = qs.stringify(message); // prepare the querystring
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    // Your app should respond to the event request with an HTTP 2xx within three seconds. 
    // If it does not, we'll consider the event delivery attempt failed. 
    // After a failure, we'll retry three times, backing off exponentially.
    callback(null, {statusCode: 200});
}

// Lambda handler
exports.event = ({body}, context, callback) => {
    console.log('Event:' + JSON.stringify(body));
    let data = JSON.parse(body);
    switch (data.type) {
        case "url_verification": verify(data, callback); break;
        case "event_callback": postMessage(data.event, callback); break;
        default: callback(null);
    }
};