const https = require('https'),
      qs = require('querystring'),
      ACCESS_TOKEN = "[SLACK ACCESS TOKEN]";

// Verify Url - https://api.slack.com/events/url_verification
function verify(data, callback) {
    if (data.token === process.env.VERIFICATION_TOKEN) callback(null, data.challenge);
    else callback("verification failed");   
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function process(event, callback) {
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

    callback(null);
}

// Lambda handler
exports.event = (data, context, callback) => {
    switch (data.type) {
        case "url_verification": verify(data, callback); break;
        case "event_callback": process(data.event, callback); break;
        default: callback(null);
    }
};