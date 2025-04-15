const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // если не установлено — установи: npm install node-fetch

const app = express();
const PORT = process.env.PORT || 10000; // используй порт из переменной окружения, если не задан — 10000

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.json());

// Обработчик POST запроса на /send
app.post('/send', async (req, res) => {
  const { phone, tag } = req.body;
  console.log('POST /send received:', req.body);

  // Проверка на обязательные поля
  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
