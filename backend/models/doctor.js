const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    availability: { type: String, required: true },
    address: { type: String, required: true },
    loginInfo: {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);
