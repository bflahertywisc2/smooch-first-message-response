'use strict';

const express = require('express');
const Smooch = require('smooch-core');
const bodyParser = require('body-parser');

const port = process.env.PORT;
const response = process.env.RESPONSE;
const appId = process.env.SMOOCH_APP_ID;
const keyId = process.env.SMOOCH_ACCOUNT_KEY_ID;
const secret = process.env.SMOOCH_ACCOUNT_SECRET;

const smooch = new Smooch({
	scope: 'account',
	keyId,
	secret
});

express()
	.use(bodyParser.json())
	.use(webhookHandler)
	.listen(PORT, () => console.log(`Running on port ${PORT}`));

async function webhookHandler(req, res) {
	// if not an appUser message event, bail
	if (req.body.trigger !== 'message:appUser') return res.end();
	
	const userId = req.body.appUser._id;
	const messageData = await smooch.appUsers.getMessages(appId, userId);

	// if these are not the first messages, bail
	if (messageData.messages > req.body.messages) return res.end();

	smooch.appUsers.postMessage(appId, userId, {
		text: response,
		type: 'text',
		role: 'appMaker'
	});

	res.end();
}
