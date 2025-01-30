const schedule = require('node-schedule');
const scrapeMedicines = require('../services/medicineScraper');

const scheduleMedicineScraping = () => {
    schedule.scheduleJob('0 0 * * 0', async () => { // Her pazar gece yarısı çalışır
        console.log('Starting weekly medicine scraping...');
        await scrapeMedicines();
    });
};

module.exports = scheduleMedicineScraping;
