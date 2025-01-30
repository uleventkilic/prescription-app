const express = require('express');
const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    createPrescription, // Reçete oluşturma fonksiyonu
} = require('../controllers/doctorController');

const router = express.Router();

router.post('/', createDoctor); // Doktor oluştur
router.get('/', getDoctors); // Tüm doktorları getir
router.get('/:id', getDoctorById); // ID'ye göre doktor getir
router.put('/:id', updateDoctor); // Doktor güncelle
router.delete('/:id', deleteDoctor); // Doktor sil

router.post('/prescriptions', createPrescription);

module.exports = router;
