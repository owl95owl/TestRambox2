const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const keys = require('C:/Users/cekco/rambox-webhook/rambox-1489ade9f89a.json');  // Это твой файл с ключами Google API

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Для парсинга JSON данных

// Инициализация Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ID твоей таблицы
const spreadsheetId = '1hgWSJE7pc6sEHOwO7Ukx-s0c77bMSMyxATf3_KCtsBQ'; // Замените на ID вашей таблицы

// Эндпоинт для получения данных
app.post('/webhook', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).send('Missing name or message');
  }

  try {
    // Данные, которые будем отправлять в Google Sheets
    const data = [
      [
        new Date().toISOString(),  // Дата/время получения
        name,
        message,
      ],
    ];

    // Записываем данные в таблицу
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Чат-статистика!A:C', // Изменили 'Лист1!A:C' на 'Чат-статистика!A:C'
      valueInputOption: 'RAW',
      requestBody: {
        values: data,
      },
    });

    res.status(200).send('Data sent to Google Sheets');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error sending data to Google Sheets');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




