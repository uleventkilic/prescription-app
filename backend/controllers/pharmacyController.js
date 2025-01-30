const { Pharmacy, Prescription } = require('../models');

const createPharmacy = async (req, res) => {
    try {
        const pharmacy = new Pharmacy(req.body);
        await pharmacy.save();
        res.status(201).json(pharmacy);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPharmacies = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find();
        res.status(200).json(pharmacies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPharmacyById = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findById(req.params.id);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Pharmacy not found' });
        }
        res.status(200).json(pharmacy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePharmacy = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!pharmacy) {
            return res.status(404).json({ error: 'Pharmacy not found' });
        }
        res.status(200).json(pharmacy);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePharmacy = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Pharmacy not found' });
        }
        res.status(200).json({ message: 'Pharmacy deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPrescriptionsForPharmacy = async (req, res) => {
    try {
        const { pharmacyId } = req.params;

        const prescriptions = await Prescription.find({ pharmacy: pharmacyId })
            .populate('doctor', 'name specialty') // Doktor bilgilerini getir
            .populate('patient', 'name tcNo') // Hasta bilgilerini getir
            .populate('medicines.medicine', 'name price'); // İlaç bilgilerini getir

        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({ error: 'No prescriptions found for this pharmacy' });
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const completePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        if (prescription.status === 'Complete') {
            return res.status(400).json({ error: 'Prescription is already complete' });
        }

        prescription.status = 'Complete';
        await prescription.save();

        res.status(200).json({ message: 'Prescription completed successfully', prescription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setAddedMedicines(
        prescription.medicines.map((med) => ({
            medicine: med.medicine,
            quantity: med.quantity,
        }))
    );
};

const handleSavePrescription = async () => {
    if (!selectedPatient || addedMedicines.length === 0) {
        alert('Please select a patient and add at least one medicine.');
        return;
    }

    const prescriptionData = {
        doctorId: localStorage.getItem('userId'), // Eczane kullanıcıları için `userId` eczane bilgisi olabilir
        patientId: selectedPatient,
        medicines: addedMedicines.map((med) => ({
            medicine: med.medicine._id,
            quantity: med.quantity,
        })),
    };

    try {
        if (editingPrescription) {
            await axios.put(
                `http://localhost:5000/api/prescriptions/${editingPrescription._id}`,
                prescriptionData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert('Prescription updated successfully!');
        }
        setAddedMedicines([]);
        setEditingPrescription(null);
    } catch (error) {
        console.error('Error saving prescription:', error);
        alert('Failed to save prescription.');
    }
};



module.exports = {
    createPharmacy,
    getPharmacies,
    getPharmacyById,
    updatePharmacy,
    deletePharmacy,
    getPrescriptionsForPharmacy, // Eczanenin reçetelerini görüntüleme
    completePrescription, // Eksik reçeteyi tamamlama
    handleEditPrescription,
    handleSavePrescription,
};
