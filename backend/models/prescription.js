const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    medicines: [{
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        quantity: { type: Number, required: true },
    }],
    status: { type: String, enum: ['Complete', 'Incomplete', 'In Progress'], default: 'Incomplete' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
