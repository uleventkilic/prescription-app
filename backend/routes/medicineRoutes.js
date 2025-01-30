const express = require('express');
const {
    createMedicine,
    getMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine,
} = require('../controllers/medicineController');

const router = express.Router();

router.post('/', createMedicine); // Create
router.get('/', getMedicines); // Read All
router.get('/:id', getMedicineById); // Read By ID
router.put('/:id', updateMedicine); // Update
router.delete('/:id', deleteMedicine); // Delete

module.exports = router;
