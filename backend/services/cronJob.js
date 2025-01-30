const cron = require('node-cron');
const updateMedicinePrices = require('./updateMedicinePrices');

console.log('🕒 Cron job service is running...');

cron.schedule('0 22 * * 0', async () => {
    console.log('🔄 Running medicine price update task...');
    try {
        await updateMedicinePrices();
        console.log('✅ Medicine prices updated successfully!');
    } catch (error) {
        console.error('❌ Error updating medicine prices:', error);
    }
}, {
    timezone: "Europe/Istanbul"
});
