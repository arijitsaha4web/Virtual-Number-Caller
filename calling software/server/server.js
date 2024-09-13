const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const xlsx = require('xlsx');
const path = require('path');
const app = express();
const port = 5000;

// Replace these placeholders with your Twilio Account SID and Auth Token
const accountSid = 'AC342d1c8f08859722fe50fd347e34f693';
const authToken = '6348778ae94e32eb2801c6a19e9a7b2b';
const client = new twilio(accountSid, authToken);

// Path to your Excel file
const excelFilePath = path.join(__dirname, 'phoneNumbers.xlsx');
const virtualNumber = '+15624533195'; // Your fixed virtual number

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const makeCall = async (phoneNumber) => {
    try {
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: phoneNumber,
            from: virtualNumber
        });
        console.log(`Call initiated with SID: ${call.sid} to ${phoneNumber}`);
    } catch (error) {
        console.error(`Error making call to ${phoneNumber}:`, error);
    }
};

const callNumbersSequentially = async (phoneNumbers) => {
    for (let i = 0; i < Math.min(50, phoneNumbers.length); i++) {
        await makeCall(phoneNumbers[i]);
        // Wait until the current call ends before making the next one
        await new Promise(resolve => setTimeout(resolve, 30000)); // Assuming each call lasts about a minute
    }
};

app.post('/api/call/50-calls', async (req, res) => {
    try {
        // Read phone numbers from Excel file
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        const phoneNumbers = data.flat().map(num => num.toString().replace(/[^0-9]/g, '')); // Clean up numbers

        console.log('Phone numbers to call:', phoneNumbers);

        // Start calling the numbers sequentially
        callNumbersSequentially(phoneNumbers);

        res.json({ message: 'Call process started for 50 numbers' });
    } catch (error) {
        console.error('Error reading Excel file or making calls:', error);
        res.status(500).json({ message: 'Error initiating calls' });
    }
});

app.post('/api/call', async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        await makeCall(phoneNumber);
        res.json({ message: 'Call initiated successfully' });
    } catch (error) {
        console.error('Error making call:', error);
        res.status(500).json({ message: 'Error making call' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
