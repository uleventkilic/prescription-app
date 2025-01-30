const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    loginInfo: {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
});

module.exports = mongoose.model('Pharmacy', pharmacySchema);
