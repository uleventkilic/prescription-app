const { Prescription, Doctor, Patient, Pharmacy, Medicine } = require('../models');
const redisClient = require('../config/redis');

const createPrescription = async (req, res) => {
    try {
        const { doctorId, patientId, medicines, notes } = req.body;

        if (!doctorId || !patientId || !medicines || medicines.length === 0) {
            return res.status(400).json({ error: 'Missing required fields: doctorId, patientId, or medicines.' });
        }

        const doctor = await Doctor.findById(doctorId);
        const patient = await Patient.findById(patientId);

        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const prescription = new Prescription({
            doctor: doctorId,
            patient: patientId,
            medicines,
            notes,
        });

        await prescription.save();
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPrescriptionsByPatientId = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const prescriptions = await Prescription.find({ patient: id })
            .populate('doctor', 'name')
            .populate('medicines.medicine', 'name');

        if (prescriptions.length === 0) {
            return res.status(404).json({ error: 'No prescriptions found for this patient.' });
        }

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching prescriptions.' });
    }
};



const getPrescriptions = async (req, res) => {
    try {
        const cacheKey = 'prescriptions';
        const cachedPrescriptions = await redisClient.get(cacheKey);

        if (cachedPrescriptions) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedPrescriptions));
        }

        console.log('Cache miss');
        const prescriptions = await Prescription.find()
            .populate('doctor', 'name specialty')
            .populate('patient', 'name tcNo')
            .populate('pharmacy', 'name address')
            .populate('medicines.medicine', 'name price');

        await redisClient.set(cacheKey, JSON.stringify(prescriptions), 'EX', 3600);
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('doctor', 'name specialty')
            .populate('patient', 'name tcNo')
            .populate('pharmacy', 'name address')
            .populate('medicines.medicine', 'name price');

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        res.status(200).json(prescription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePrescription = async (req, res) => {
    try {
        const { userType } = req.user; // Kullanıcı türünü al
        if (userType !== 'doctor' && userType !== 'pharmacy') {
            return res.status(403).json({ error: 'You are not authorized to edit prescriptions.' });
        }

        const { medicines } = req.body;

        if (medicines) {
            await Promise.all(
                medicines.map(async (item) => {
                    const medicine = await Medicine.findById(item.medicine);
                    if (!medicine) {
                        throw new Error(`Medicine with ID ${item.medicine} not found`);
                    }
                })
            );
        }

        const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        res.status(200).json(prescription);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deletePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndDelete(req.params.id);
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        await redisClient.del('prescriptions');
        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    getPrescriptionsByPatientId,
};
