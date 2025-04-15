const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json()); // Для парсинга JSON в теле запроса

// POST-запрос на /send
app.post('/send', async (req, res) => {
  const { phone, tag } = req.body;

  if (!phone || !tag) {
    return res.status(400).json({ status: 'error', message: 'Phone and tag are required' });
  }

  // Замените на ваш URL Google Apps Script
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

// Сервер слушает на порту 3000 или порту, указанном в переменной окружения
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
