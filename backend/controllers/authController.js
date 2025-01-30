const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Doctor, Pharmacy, Patient } = require('../models');

const registerUser = async (req, res) => {
    try {
        const { userType, name, email, password, specialty, availability, address, tcNo } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        let existingUser;
        let user;
        switch (userType) {
            case 'doctor':
                existingUser = await Doctor.findOne({ 'loginInfo.email': email });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email is already registered as a doctor.' });
                }
                if (!specialty || !availability || !address) {
                    return res.status(400).json({ error: 'Doctor registration requires specialty, availability, and address fields.' });
                }
                user = new Doctor({
                    name,
                    specialty,
                    availability,
                    address,
                    loginInfo: { email, password: hashedPassword },
                });
                break;

            case 'pharmacy':
                existingUser = await Pharmacy.findOne({ 'loginInfo.email': email });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email is already registered as a pharmacy.' });
                }
                if (!address) {
                    return res.status(400).json({ error: 'Pharmacy registration requires address field.' });
                }
                user = new Pharmacy({
                    name,
                    address,
                    loginInfo: { email, password: hashedPassword },
                });
                break;

            case 'patient':
                existingUser = await Patient.findOne({ tcNo: tcNo });
                if (existingUser) {
                    return res.status(400).json({ error: 'This TC number is already registered as a patient.' });
                }
                if (!tcNo) {
                    return res.status(400).json({ error: 'Patient registration requires tcNo field.' });
                }
                user = new Patient({
                    name,
                    tcNo,
                    loginInfo: { password: hashedPassword },
                });
                break;

            default:
                return res.status(400).json({ error: 'Invalid user type' });
        }

        await user.save();
        res.status(201).json({ message: `${userType} registered successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { userType, email, password, tcNo, name } = req.body;

    if (!userType) {
        return res.status(400).json({ error: 'User type is required' });
    }

    let user;

    if (userType === 'doctor') {
        user = await Doctor.findOne({ 'loginInfo.email': email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.loginInfo.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } else if (userType === 'patient') {
        user = await Patient.findOne({ tcNo, name }); // tcNo ve name kontrolü
        if (!user) {
            return res.status(404).json({ error: 'Patient not found' });
        }
    } else if (userType === 'pharmacy') {
        user = await Pharmacy.findOne({ 'loginInfo.email': email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.loginInfo.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }

    const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userType, userId: user._id });
};

module.exports = {
    registerUser,
    loginUser,
};
