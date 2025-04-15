const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Добавляем CORS для обработки запросов из других источников

const app = express();

// Для парсинга JSON в теле запроса
app.use(express.json());

// Разрешаем CORS
app.use(cors());

// POST-запрос на /send
app.post('/send', async (req, res) => {
  const { phone, tag } = req.body;

  console.log('Получен POST-запрос на /send');
  console.log('Тело запроса:', req.body); // Логируем тело запроса для отладки

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
    console.log('Данные успешно отправлены в Google Sheets:', data);
    return res.json({ status: 'success', message: 'Data sent to Google Sheets', data });
  } catch (err) {
    console.error('Ошибка при отправке данных в Google Sheets:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// Сервер слушает на порту 10000 или другом, если указано в переменной окружения
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
