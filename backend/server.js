const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const redisClient = require('./config/redis');
const { authenticateToken } = require('./middleware/authMiddleware');

// Route Imports
const doctorRoutes = require('./routes/doctorRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const authRoutes = require('./routes/authRoutes');

// Service Imports
const scheduleNotifications = require('./scheduler/dailyScheduler');
const processNotifications = require('./services/notificationService');
const processUploadedExcel = require('./services/excelProcessor');
const consumeMissingPrescriptions = require('./services/pharmacyConsumer');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
connectDB();

// Redis Connection
redisClient.on('connect', () => console.log('✅ Redis is connected and ready to use'));
redisClient.on('error', (err) => console.error('❌ Redis connection error:', err));

// API Status Route
app.get('/', (req, res) => res.status(200).json({ message: '✅ Prescription System API is running...' }));

// File Upload Setup
const upload = multer({ dest: path.resolve(__dirname, './uploads') });
app.post('/api/medicines/upload', upload.single('file'), authenticateToken, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const filePath = path.resolve(__dirname, './uploads', req.file.filename);
        await processUploadedExcel(filePath);
        res.status(200).json({ message: '✅ Excel file processed and medicines updated successfully' });
    } catch (error) {
        console.error('❌ Error processing uploaded Excel file:', error.message);
        res.status(500).json({ error: 'Failed to process the Excel file' });
    }
});

// API Routes
app.use('/api/v1/doctors', authenticateToken, doctorRoutes);
app.use('/api/v1/pharmacies', authenticateToken, pharmacyRoutes);
app.use('/api/v1/patients', authenticateToken, patientRoutes);
app.use('/api/v1/prescriptions', authenticateToken, prescriptionRoutes);
app.use('/api/v1/medicines', authenticateToken, medicineRoutes);
app.use('/api/v1/auth', authRoutes);

// Start Background Services
processNotifications();
scheduleNotifications();
consumeMissingPrescriptions();
require('./services/cronJob');

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
