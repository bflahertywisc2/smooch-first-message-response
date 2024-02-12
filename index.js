'use strict';

const express = require('express');
const Smooch = require('smooch-core');
const bodyParser = require('body-parser');

const port = 8029;
const response = process.env.RESPONSE;
const appId = process.env.SMOOCH_APP_ID;
const keyId = process.env.SMOOCH_ACCOUNT_KEY_ID;
const secret = process.env.SMOOCH_ACCOUNT_SECRET;
const webhookSecret = process.env.WEBHOOK_SECRET;

const smooch = new Smooch({
	scope: 'account',
	keyId,
	secret
});

express()
	.use(bodyParser.json())
	.post('/', webhookHandler)
	.listen(port, () => console.log(`Running on port ${port}`));

async function webhookHandler(req, res) {
	// if secret is set and doesn't match, bail
	if (webhookSecret && headers['x-api-key'] !== webhookSecret) return res.end();

	// if not an appUser message event, bail
	if (req.body.trigger !== 'message:appUser') return res.end();
	
	const userId = req.body.appUser._id;
	const messageData = await smooch.appUsers.getMessages(appId, userId);

	// if these are not the first messages, bail
	if (messageData.messages > req.body.messages) return res.end();

	await smooch.appUsers.sendMessage(appId, userId, {
		text: response,
		type: 'text',
		role: 'appMaker'
	});

	res.end();
}
