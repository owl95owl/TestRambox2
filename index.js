const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json()); // Для парсинга JSON в теле запроса

// GET-запрос на /send
app.get('/send', (req, res) => {
  const { phone, tag } = req.query;

  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

  // Замените на ваш URL Google Apps Script
  const googleUrl = 'https://script.google.com/macros/s/AKfycbwGo7Hrx80jLm8QUxW5SR7_Q1_FclqNLhQyDIsnPSTKuUbfuptj4ZDGewS060RrEVn8/exec'; 

  // Отправка данных в Google Apps Script
  fetch(googleUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, tag })
  })
    .then(response => response.json())
    .then(data => {
      res.json({ status: 'success', message: 'Data sent to Google Sheets', data });
    })
    .catch(err => {
      res.status(500).json({ status: 'error', message: err.message });
    });
});

// Сервер слушает на порту 3000 или порту, указанном в переменной окружения
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
