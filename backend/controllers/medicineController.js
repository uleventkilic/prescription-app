const { Medicine } = require('../models');
const redisClient = require('../config/redis');

const getMedicines = async (req, res) => {
    try {
        const cacheKey = 'medicines';

        const cachedMedicines = await redisClient.get(cacheKey);
        if (cachedMedicines) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedMedicines));
        }

        console.log('Cache miss');
        const medicines = await Medicine.find();
        await redisClient.set(cacheKey, JSON.stringify(medicines), 'EX', 3600); // 1 saatlik önbellek

        res.status(200).json(medicines);
    } catch (error) {
        console.error('Error fetching medicines:', error.message);
        res.status(500).json({ error: 'Failed to fetch medicines' });
    }
};

const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        console.error('Error fetching medicine:', error.message);
        res.status(500).json({ error: 'Failed to fetch medicine' });
    }
};

const createMedicine = async (req, res) => {
    try {
        const medicine = new Medicine(req.body);
        await medicine.save();
        res.status(201).json(medicine);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
};
