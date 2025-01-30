import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token) {
            navigate('/login'); // Token yoksa login sayfasına yönlendir
            return;
        }

        axios
            .get('http://localhost:5000/api/v1/auth/verify-token', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                console.log('Token verified successfully');
                if (userType === 'doctor') navigate('/doctor');
                else if (userType === 'patient') navigate('/patient');
                else if (userType === 'pharmacy') navigate('/pharmacy');
            })
            .catch(() => {
                localStorage.clear(); // Hatalı token varsa temizle
                navigate('/login');
            });
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <h1>Welcome to the Dashboard</h1>
            <p>You are logged in successfully!</p>
        </div>
    );
};

export default Dashboard;
