const twilio = require('twilio');

// Replace these placeholders with your Twilio Account SID and Auth Token
const accountSid = 'AC342d1c8f08859722fe50fd347e34f693'; 
const authToken = '6348778ae94e32eb2801c6a19e9a7b2b';

const client = new twilio(accountSid, authToken);

client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml', // This URL provides instructions on how to handle the call
    to: '+916295724564',  // Replace with the phone number you want to call
    from: '+15624533195' // Replace with your Twilio virtual number
})
.then((call) => console.log('Call initiated with SID:', call.sid))
.catch((error) => console.error('Error making call:', error));
