import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import PharmacyPage from './pages/PharmacyPage';

function App() {
    const userType = localStorage.getItem('userType');

    return (
        <Router>
            <Routes>
                {/* İlk açılışta login ekranına yönlendirme */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {userType === 'doctor' && <Route path="/doctor" element={<DoctorPage />} />}
                {userType === 'patient' && <Route path="/patient" element={<PatientPage />} />}
                {userType === 'pharmacy' && <Route path="/pharmacy" element={<PharmacyPage />} />}
                {/* Varsayılan olarak login sayfasına yönlendir */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
