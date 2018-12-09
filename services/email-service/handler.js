'use strict';

const MAILGUN_APIKEY   = process.env.MAILGUN_APIKEY
const MAILGUN_DOMAIN   = process.env.MAILGUN_DOMAIN

const mailgun = require('mailgun-js')({
  apiKey: MAILGUN_APIKEY,
  domain: MAILGUN_DOMAIN
});

const fromAddress    = `serverless@sandbox88d21615743746e8b7dda20b12ad14c8.mailgun.org`;
const subjectText    = "Serverless Email Demo";
const messageText    = 'Sample email sent from Serverless Email Demo.';
const messageHtml    = `
  <html>
    <title>Serverless Mailer</title>
    <body>
      <div>
        <h1>Serverless Mailer</h1>
        <span>Sample email hopefully sent if everything works out.</span>
      </div>
    </body>
  </html>
`;

module.exports.sendEmail = (event, context, callback) => {
  let toAddress = "";

  if (event.body) {
    try {
      toAddress = JSON.parse(event.body).to_address || "";
    }
    catch (e){}
  }

  if (toAddress !== "") {

    const emailData = {
        from: fromAddress,
        to: toAddress,
        subject: subjectText,
        text: messageText,
        html: messageHtml
    };

    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        const response = {
          statusCode: 400,
          body: JSON.stringify({
            message: error,
            input: body,
          }),
        };
        callback(null, response);
      } else {
        const response = {
          statusCode: 202,
          body: JSON.stringify({
            message: "Request to send email is successful.",
            input: body,
          }),
        };
        console.log(response);
        callback(null, response);
      }
    });
  } else {
    const err = {
      statusCode: 422,
      body: JSON.stringify({
        message: "Bad input data or missing email address.",
        input: event.body,
      }),
    };
    console.log(err);
    callback(null, err);
  }
};
