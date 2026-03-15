require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');

const app = express();
app.use(express.json());
app.use('/audio', express.static('audio-files'));

if (!fs.existsSync('audio-files')) fs.mkdirSync('audio-files');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate Tamil audio using Google TTS
function generateAudio(message, filename) {
  return new Promise((resolve, reject) => {
    const text = encodeURIComponent(message);
    const options = {
      hostname: 'translate.google.com',
      path: `/translate_tts?ie=UTF-8&q=${text}&tl=ta&client=tw-ob`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://translate.google.com/'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const filepath = path.join('audio-files', filename);
        fs.writeFileSync(filepath, buffer);
        console.log('✅ Audio generated:', filename);
        resolve(filename);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Make a phone call
async function makeCall(phone, audioUrl, tier) {
  const twiml = tier === 1
    ? `<Response>
        <Gather numDigits="1" action="/confirm" method="POST">
          <Play>${audioUrl}</Play>
          <Say voice="alice" language="ta-IN">உறுதிப்படுத்த 1 அழுத்துங்கள்.</Say>
        </Gather>
       </Response>`
    : `<Response><Play>${audioUrl}</Play></Response>`;

  const call = await twilioClient.calls.create({
    twiml: twiml,
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER
  });
  return call.sid;
}

// Send SMS
async function sendSMS(phone, message) {
  const msg = await twilioClient.messages.create({
    body: message,
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER
  });
  return msg.sid;
}

// MAIN ROUTE — called by teammates to send alerts
app.post('/call-all', async (req, res) => {
  const { message, tier, contacts, baseUrl } = req.body;

  console.log('\n📢 ALERT RECEIVED!');
  console.log('Tier:', tier);
  console.log('People:', contacts.length);
  console.log('Message:', message);

  const results = { called: [], sms_sent: [], failed: [] };

  try {
    if (tier === 1 || tier === 2) {
      const filename = 'alert-' + Date.now() + '.mp3';
      await generateAudio(message, filename);
      const audioUrl = baseUrl + '/audio/' + filename;
      console.log('Audio URL:', audioUrl);

      for (const phone of contacts) {
        try {
          const sid = await makeCall(phone, audioUrl, tier);
          results.called.push({ phone, sid });
          console.log('✅ Called:', phone);
        } catch (err) {
          results.failed.push({ phone, error: err.message });
          console.log('❌ Failed:', phone, err.message);
        }
      }
    } else {
      for (const phone of contacts) {
        try {
          const sid = await sendSMS(phone, message);
          results.sms_sent.push({ phone, sid });
          console.log('✅ SMS sent:', phone);
        } catch (err) {
          results.failed.push({ phone, error: err.message });
          console.log('❌ SMS failed:', phone, err.message);
        }
      }
    }

    res.json({ success: true, tier, ...results });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Twilio calls this when villager presses 1
app.post('/confirm', (req, res) => {
  const phone = req.body.To;
  console.log('✅ CONFIRMED by:', phone);
  res.type('text/xml').send('<Response><Say voice="alice" language="ta-IN">நன்றி. பாதுகாப்பாக இருங்கள்.</Say></Response>');
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ Bhoomi Voice Server is running!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('🚀 Bhoomi server running on port', PORT);
  console.log('Visit: http://localhost:' + PORT);
});

