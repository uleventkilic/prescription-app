const mongoose = require('mongoose');
const Medicine = require('../models/medicine'); // Model dosyanın yolu

const MONGO_URI = process.env.MONGO_URI;

const generateRandomPrice = () => {
    return (Math.random() * 100 + 10).toFixed(2);
};

const updateMedicinePrices = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ MongoDB connected for price update...');

        const medicines = await Medicine.find();
        console.log(`🔍 Found ${medicines.length} medicines.`);

        for (const medicine of medicines) {
            const newPrice = generateRandomPrice();
            medicine.price = newPrice;
            await medicine.save();
            console.log(`💊 Updated ${medicine.name} to ${newPrice} TL.`);
        }

        console.log('✅ All medicine prices updated successfully!');
    } catch (error) {
        console.error('❌ Error updating medicine prices:', error);
    } finally {
        mongoose.disconnect();
        console.log('🔌 MongoDB disconnected.');
    }
};

module.exports = updateMedicinePrices;
