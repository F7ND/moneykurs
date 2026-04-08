const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors'); // Import CORS

const app = express();

// Aktifkan CORS
app.use(cors());  // Mengizinkan semua origin untuk mengakses API

app.get('/api/exchange-rates', async (req, res) => {
  try {
    const url = 'https://www.x-rates.com/table/?from=USD&amount=1';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const exchangeRates = [];

    $('table.ratesTable tbody tr').each((i, element) => {
      const currency = $(element).find('td').eq(0).text().trim();
      const rateToUSD = $(element).find('td').eq(1).text().trim();
      exchangeRates.push({ currency, rateToUSD });
    });

    res.status(200).json(exchangeRates);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data' });
  }
});

// Menjalankan server di port 3000
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
