import test from "ava";
import handler from '../handler';

test.cb('Successful url verification',t => {
	const data = {body: JSON.stringify( {type: 'url_verification', token: 'Ha', challenge: 'Hey'})};
	handler.event(data, {}, (error, res) => {
        t.is(res.body, 'Hey');
        t.end();
    });
});

test.cb('Wrong token on url verification',t => {
	// `t.end` automatically checks for error as first argument
    const data = {body: JSON.stringify( {type: 'url_verification', token: 'Wo', challenge: 'Hey'})};

    handler.event(data, {}, (error, res) => {
        t.is(error, 'verification failed');
        t.end();
    });

});