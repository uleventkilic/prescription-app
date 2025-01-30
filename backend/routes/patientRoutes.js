const express = require('express');
const {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPrescriptionsForPatient, // Hastanın reçetelerini görüntüleme
} = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/authMiddleware'); // JWT doğrulama için middleware
const { Prescription } = require('../models');

const router = express.Router();

router.post('/', authenticateToken, createPatient); // Yeni hasta oluşturma
router.get('/', authenticateToken, getPatients); // Tüm hastaları görüntüleme
router.get('/:id', authenticateToken, getPatientById); // ID'ye göre hasta görüntüleme
router.put('/:id', authenticateToken, updatePatient); // Hasta güncelleme
router.delete('/:id', authenticateToken, deletePatient); // Hasta silme
router.get('/tc/:tcNo', authenticateToken, async (req, res) => {
    try {
        const patient = await Patient.findOne({ tcNo: req.params.tcNo });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/id/:id/prescriptions', async (req, res) => {
    try {
        const { id } = req.params;
        const prescriptions = await Prescription.find({ patient: id })
            .populate('medicines.medicine', 'name')
            .populate('doctor', 'name');

        if (!prescriptions.length) {
            return res.status(404).json({ error: 'No prescriptions found for this patient.' });
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
