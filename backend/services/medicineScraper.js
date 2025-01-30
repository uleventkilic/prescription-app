const axios = require('axios');
const cheerio = require('cheerio');
const { Medicine } = require('../models');

const scrapeMedicines = async () => {
    try {
        const url = 'https://www.titck.gov.tr/dinamikmodul/43';
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        const medicines = [];

        $('table tbody tr').each((index, element) => {
            const name = $(element).find('td:nth-child(2)').text().trim();

            const priceText = $(element)
                .find('td:nth-child(3)') // Doğru sütun indeksi buradan kontrol edilebilir
                .text()
                .trim()
                .replace(/[^0-9.,]/g, '') // Sayısal olmayan karakterleri temizle
                .replace(',', '.'); // Virgülü noktaya çevir

            const price = parseFloat(priceText); // Fiyatı sayıya dönüştür

            const stock = Math.floor(Math.random() * 100) + 1;

            if (!isNaN(price)) {
                medicines.push({ name, price, stock });
            } else {
                console.log(`Invalid price for medicine: ${name}`);
            }
        });

        await Medicine.deleteMany(); // Eski verileri temizle
        await Medicine.insertMany(medicines); // Yeni verileri ekle

        console.log(`${medicines.length} medicines scraped and saved successfully.`);
    } catch (error) {
        console.error('Error scraping medicines:', error.message);
    }
};

module.exports = scrapeMedicines;
