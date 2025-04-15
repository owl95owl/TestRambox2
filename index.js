const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  console.log('POST request received on /send');
  
  const { phone, tag } = req.body;
  console.log('Request Body:', req.body);

  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

  return res.json({ status: 'success', message: 'Test success (без Google Script)', data: { phone, tag } });
});

app.get('/test', (req, res) => {
  console.log('GET request received on /test');
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
