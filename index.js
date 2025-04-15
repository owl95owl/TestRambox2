const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwGo7Hrx80jLm8QUxW5SR7_Q1_FclqNLhQyDIsnPSTKuUbfuptj4ZDGewS060RrEVn8/exec';

// POST-запрос от Rambox
app.post('/', async (req, res) => {
  const { phone, tag } = req.body;

  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, tag })
    });

    const result = await response.json();
    return res.json({ status: 'success', data: result });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET-запрос на /send — для ручной проверки через браузер
app.get('/send', async (req, res) => {
  const { phone, tag } = req.query;

  if (!phone || !tag) {
    return res.status(400).send('Missing phone or tag');
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, tag })
    });

    const data = await response.json();
    res.send(`✅ Успешно отправлено!<br>Ответ сервера: ${JSON.stringify(data)}`);
  } catch (error) {
    res.status(500).send(`Ошибка отправки: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
