const express = require('express');
const {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    getPrescriptionsByPatientId,
} = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, createPrescription);
router.get('/', authenticateToken, getPrescriptions);
router.get('/:id', authenticateToken, getPrescriptionById);
router.put('/:id', authenticateToken, updatePrescription);
router.delete('/:id', authenticateToken, deletePrescription);

router.get('/patient/:id', authenticateToken, getPrescriptionsByPatientId);

module.exports = router;
