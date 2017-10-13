# smooch-first-message-response
Send an automated response to a first message

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Setup:

define the following environment variables:

```bash
PORT
RESPONSE
SMOOCH_APP_ID
SMOOCH_ACCOUNT_KEY_ID
SMOOCH_ACCOUNT_SECRET
```

then set a message:appUser webhook to point at this service.
