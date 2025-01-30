import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('doctor'); // Varsayılan kullanıcı türü
    const [tcNo, setTcNo] = useState(''); // Hasta için TC Kimlik No
    const [name, setName] = useState(''); // Hasta için isim
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        let loginData;

        if (userType === 'patient') {
            loginData = { userType, tcNo, name }; // Patient için tcNo ve name
        } else {
            loginData = { userType, email, password }; // Doctor ve Pharmacy için email ve password
        }

        try {
            const response = await loginUser(loginData, 'v1'); // API sürümünü ekledik

            localStorage.setItem('token', response.token);
            localStorage.setItem('userType', response.userType);
            localStorage.setItem('userId', response.userId);

            if (response.userType === 'doctor') navigate('/doctor');
            if (response.userType === 'pharmacy') navigate('/pharmacy');
            if (response.userType === 'patient') navigate('/patient');
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); // Register sayfasına yönlendirme
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                {userType === 'patient' ? (
                    <>
                        <div className="form-group">
                            <label>TC ID No:</label>
                            <input
                                type="text"
                                value={tcNo}
                                onChange={(e) => setTcNo(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Full Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <label>User Type:</label>
                    <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="form-control"
                    >
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                        <option value="pharmacy">Pharmacy</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleRegisterRedirect}
                    style={{ marginLeft: '10px' }}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
