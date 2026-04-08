const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk menangani endpoint /api/exchange-rates
module.exports = async (req, res) => {
  // Menambahkan header CORS untuk mengizinkan akses dari localhost atau domain lain
  res.setHeader('Access-Control-Allow-Origin', '*');  // Ganti '*' dengan domain Anda jika ingin membatasi
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header, Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle pre-flight request
    return res.status(200).end();
  }

  try {
    const url = 'https://www.x-rates.com/table/?from=USD&amount=1';
    const response = await axios.get(url); // Mengambil halaman X-Rates
    const $ = cheerio.load(response.data);  // Memuat HTML halaman

    const exchangeRates = [];

    // Menargetkan tabel dengan class 'ratesTable'
    $('table.ratesTable tbody tr').each((i, element) => {
      const currency = $(element).find('td').eq(0).text().trim();  // Nama mata uang
      const rateToUSD = $(element).find('td').eq(1).text().trim();  // Nilai tukar ke USD

      exchangeRates.push({ currency, rateToUSD });
    });

    // Mengembalikan data dalam format JSON
    res.status(200).json(exchangeRates);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data' });
  }
};
