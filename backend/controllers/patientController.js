const { Patient, Prescription } = require('../models');

const createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({}, 'name tcNo'); // Sadece gerekli alanları döndür
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPrescriptionsForPatient = async (req, res) => {
    try {
        const patientId = req.params.id;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const prescriptions = await Prescription.find({ patient: patientId })
            .populate('medicines.medicine', 'name')
            .populate('doctor', 'name');

        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({ error: 'No prescriptions found for this patient' });
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPrescriptionsByPatientId = async (req, res) => {
    try {
        const { id } = req.params; // Hastanın ID'si
        const prescriptions = await Prescription.find({ patient: id })
            .populate('doctor', 'name')
            .populate('medicines.medicine', 'name');
        
        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({ error: 'No prescriptions found for this patient' });
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching prescriptions' });
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPrescriptionsForPatient,
    getPrescriptionsByPatientId,
};
