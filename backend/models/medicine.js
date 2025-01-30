const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Medicine', medicineSchema);
