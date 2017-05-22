import test from "ava";
import handler from '../handler';

const url_verification = {type: 'url_verification', token: 'Ha', challenge: 'Hey'};

test.cb('Successful url verification',t => {

	const data = {body: JSON.stringify(url_verification)};

	handler.event(data, {}, (error, res) => {
        t.is(res.body, url_verification.challenge);
        t.is(res.statusCode, 200);
        t.end();
    });
});

test.cb('Wrong token on url verification',t => {

    url_verification.token = 'Wa';
    const data = {body: JSON.stringify(url_verification)};

    handler.event(data, {}, (error) => {
        t.is(error, 'verification failed');
        t.end();
    });

});

const event_callback = {type: 'event_callback', event: {channel: 'KD39'}};

test.cb('Post message not matching regex', t => {
    event_callback.event.text = 'Text that does not match';
    const data = {body: JSON.stringify(event_callback)};

    handler.event(data, {}, (error, res) => {
        t.is(res.statusCode, 200);
        t.end();
    })

});

test.cb('Install',t => {

	handler.install({}, {}, (error, res) => {
        console.log('Body:'+res.body);
        t.is(res.statusCode, 200);
        t.deepEqual(res.headers, {'Content-Type': 'text/html'})
        t.regex(res.body, /client12id34/);
        t.end();
    });
});
