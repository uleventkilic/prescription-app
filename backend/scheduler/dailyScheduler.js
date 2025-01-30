const schedule = require('node-schedule');
const processMissingPrescriptions = require('../services/missingPrescriptionWorker');

const scheduleNotifications = () => {
    schedule.scheduleJob('59 23 * * *', async () => {
        console.log('Running scheduled task: Checking for missing prescriptions...');
        await processMissingPrescriptions();
    });
};

module.exports = scheduleNotifications;
