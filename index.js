const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Декодируем Google credentials из переменной среды и сохраняем во временный файл
const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
const decodedPath = path.join(__dirname, 'service-account-decoded.json');

fs.writeFileSync(decodedPath, Buffer.from(credentialsBase64, 'base64').toString('utf-8'));

// Авторизация
const auth = new google.auth.GoogleAuth({
  keyFile: decodedPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  const { phone, source } = req.body;

  if (!phone || !source) {
    return res.status(400).send('Missing phone or source');
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1hgWSJE7pc6sEHOwO7Ukx-s0c77bMSMyxATf3_KCtsBQ';
    const range = 'A1'; // Начнёт писать с первой строки

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[phone, source, new Date().toISOString()]],
      },
    });

    res.status(200).send('Data appended to Google Sheets');
  } catch (error) {
    console.error('Ошибка при отправке в таблицу:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
