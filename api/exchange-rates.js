const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk menangani endpoint /api/exchange-rates
module.exports = async (req, res) => {
  try {
    const url = 'https://www.x-rates.com/table/?from=USD&amount=1';
    const response = await axios.get(url); // Mengambil halaman X-Rates
    const $ = cheerio.load(response.data);  // Memuat HTML halaman

    const exchangeRates = [];

    // Menargetkan tabel dengan class 'ratesTable'
    $('table.ratesTable tbody tr').each((i, element) => {
      const currency = $(element).find('td').eq(0).text().trim();  // Nama mata uang
      const rateToUSD = $(element).find('td').eq(1).text().trim();  // Nilai tukar ke USD

      // Menambahkan data ke array
      exchangeRates.push({ currency, rateToUSD });
    });

    // Mengembalikan data dalam format JSON
    res.status(200).json(exchangeRates);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data' });
  }
};
