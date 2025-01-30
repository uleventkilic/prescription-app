const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const doctorRoutes = require('./routes/doctorRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const authRoutes = require('./routes/authRoutes');
const scheduleNotifications = require('./scheduler/dailyScheduler');
const processNotifications = require('./services/notificationService');
const processUploadedExcel = require('./services/excelProcessor');
const multer = require('multer');
const path = require('path');
const consumeMissingPrescriptions = require('./services/pharmacyConsumer');
const redisClient = require('./config/redis');
const { authenticateToken } = require('./middleware/authMiddleware');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors()); // CORS izinleri

connectDB();

redisClient.on('connect', () => {
    console.log('✅ Redis is connected and ready to use');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

app.get('/', (req, res) => {
    res.status(200).json({ message: '✅ Prescription System API is running...' });
});

const upload = multer({
    dest: path.resolve(__dirname, './uploads'), // Yüklenen dosyaların kaydedileceği dizin
});

app.post('/api/medicines/upload', upload.single('file'), authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = path.resolve(__dirname, './uploads', req.file.filename); // Dosya yolu
        await processUploadedExcel(filePath); // Excel dosyasını işle
        res.status(200).json({ message: '✅ Excel file processed and medicines updated successfully' });
    } catch (error) {
        console.error('❌ Error processing uploaded Excel file:', error.message);
        res.status(500).json({ error: 'Failed to process the Excel file' });
    }
});

app.use('/api/v1/doctors', authenticateToken, doctorRoutes);
app.use('/api/v1/pharmacies', authenticateToken, pharmacyRoutes);
app.use('/api/v1/patients', authenticateToken, patientRoutes);
app.use('/api/v1/prescriptions', authenticateToken, prescriptionRoutes);
app.use('/api/v1/medicines', authenticateToken, medicineRoutes);
app.use('/api/v1/auth', authRoutes);

processNotifications();

scheduleNotifications();

consumeMissingPrescriptions();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

require('./services/cronJob');
