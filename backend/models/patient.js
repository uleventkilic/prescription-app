const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tcNo: { type: String, unique: true, required: true },
    loginInfo: {
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
