require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const MY_PHONE_NUMBER = '+918438786020';

client.calls.create({
  twiml: '<Response><Say voice="alice">Hello! This is Bhoomi working!</Say></Response>',
  to: MY_PHONE_NUMBER,
  from: process.env.TWILIO_PHONE_NUMBER
})
.then(call => {
  console.log('SUCCESS! Phone will ring now!');
  console.log('Call ID:', call.sid);
})
.catch(err => {
  console.log('ERROR:', err.message);
});