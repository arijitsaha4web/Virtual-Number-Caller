const twilio = require('twilio');
const fs = require('fs');
const xlsx = require('xlsx');

// Replace these placeholders with your Twilio Account SID and Auth Token
const accountSid = 'AC342d1c8f08859722fe50fd347e34f693'; 
const authToken = '6348778ae94e32eb2801c6a19e9a7b2b';

const client = new twilio(accountSid, authToken);

// Function to read phone numbers from Excel
const readPhoneNumbers = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  return data.map(row => row.PhoneNumber); // Adjust this based on your Excel file
};

// Function to make a call
const makeCall = (toNumber, fromNumber) => {
  return client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: toNumber,
    from: fromNumber
  });
};

// Main function to handle the call logic
const initiateCalls = async (excelFilePath, fromNumber) => {
  const phoneNumbers = readPhoneNumbers(excelFilePath);

  for (const number of phoneNumbers) {
    try {
      const call = await makeCall(number, fromNumber);
      console.log(`Call initiated to ${number} with SID: ${call.sid}`);
    } catch (error) {
      console.error('Error making call:', error);
    }
  }
};

// Example usage
const excelFilePath = 'phoneNumbers.xlsx'; // Update with your Excel file path
const fromNumber = '+15624533195'; // Your Twilio virtual number

initiateCalls(excelFilePath, fromNumber);
