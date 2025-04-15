const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // если не установлено — установи: npm install node-fetch

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  console.log("Received POST request at /send");
  const { phone, tag } = req.body;
  console.log('POST /send received:', req.body);

  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

  return res.json({ status: 'success', message: 'Test success (без Google Script)', data: { phone, tag } });
});


  // Временно отключим Google Script, чтобы не висло
  return res.json({ status: 'success', message: 'Test success (без Google Script)', data: { phone, tag } });

  // Если потом хочешь вернуть — раскомментируй:
  /*
  const googleUrl = 'https://script.google.com/macros/s/___ТВОЙ_URL___/exec';

  try {
    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, tag })
    });

    const data = await response.json();
    return res.json({ status: 'success', message: 'Data sent to Google Sheets', data });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
  */
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
