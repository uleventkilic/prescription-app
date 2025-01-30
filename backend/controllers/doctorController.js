const { Doctor, Patient, Prescription } = require('../models');

const createDoctor = async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        console.error('Error creating doctor:', error.message);
        res.status(500).json({ error: 'Failed to create doctor' });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error.message);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error.message);
        res.status(500).json({ error: 'Failed to fetch doctor' });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error updating doctor:', error.message);
        res.status(500).json({ error: 'Failed to update doctor' });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error.message);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
};

const createPrescription = async (req, res) => {
    try {
        const { doctorId, patientId, medicines } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const prescription = new Prescription({
            doctor: doctor._id,
            patient: patient._id,
            medicines,
            status: 'Incomplete',
        });

        await prescription.save();

        res.status(201).json({
            message: 'Prescription created successfully',
            prescription,
        });
    } catch (error) {
        console.error('Error creating prescription:', error.message);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    createPrescription, // Yeni eklenen reçete oluşturma fonksiyonu
};
