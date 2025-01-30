const express = require('express');
const {
    createPharmacy,
    getPharmacies,
    getPharmacyById,
    updatePharmacy,
    deletePharmacy,
    getPrescriptionsForPharmacy, // Belirli bir eczanenin reçetelerini görüntüleme
    completePrescription, // Eksik reçeteyi tamamlama
} = require('../controllers/pharmacyController');
const { authenticateToken } = require('../middleware/authMiddleware'); // JWT doğrulama middleware

const router = express.Router();

router.post('/', authenticateToken, createPharmacy); // Yeni eczane oluşturma
router.get('/', authenticateToken, getPharmacies); // Tüm eczaneleri görüntüleme
router.get('/:id', authenticateToken, getPharmacyById); // ID'ye göre eczane görüntüleme
router.put('/:id', authenticateToken, updatePharmacy); // Eczane güncelleme
router.delete('/:id', authenticateToken, deletePharmacy); // Eczane silme
router.get('/:pharmacyId/prescriptions', authenticateToken, getPrescriptionsForPharmacy); // Belirli bir eczanenin reçetelerini görüntüleme
router.put('/prescriptions/:id/complete', authenticateToken, completePrescription); // Eksik reçeteyi tamamlama

module.exports = router;
