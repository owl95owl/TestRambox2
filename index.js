const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json()); // Для парсинга JSON

// POST-запрос от другого клиента (например, Postman, webhook и т.п.)
app.post('/', async (req, res) => {
  const { phone, tag } = req.body;

  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

  const googleUrl = 'https://script.google.com/macros/s/AKfycbwGo7Hrx80jLm8QUxW5SR7_Q1_FclqNLhQyDIsnPSTKuUbfuptj4ZDGewS060RrEVn8/exec';

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
});

// ✅ Новый обработчик для обхода CSP (через GET-запрос)
app.get('/send', async (req, res) => {
  const { phone, tag } = req.query;

  if (!phone || !tag) {
    return res.status(400).send('❌ Укажите номер телефона и тег');
  }

  const googleUrl = 'https://script.google.com/macros/s/AKfycbwGo7Hrx80jLm8QUxW5SR7_Q1_FclqNLhQyDIsnPSTKuUbfuptj4ZDGewS060RrEVn8/exec';

  try {
    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, tag })
    });

    const result = await response.json();
    res.send(`<h3>✅ Успешно отправлено!<br><br>Ответ сервера: ${JSON.stringify(result)}</h3>`);
  } catch (err) {
    res.status(500).send(`<h3>❌ Ошибка отправки: ${err.message}</h3>`);
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
