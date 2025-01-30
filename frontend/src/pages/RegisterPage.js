import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [userType, setUserType] = useState('doctor'); // Varsayılan kullanıcı tipi
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialty: '',
        availability: '',
        address: '',
        tcNo: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, userType };

            if (userType !== 'doctor') {
                delete data.specialty;
                delete data.availability;
            }
            if (userType !== 'pharmacy') {
                delete data.address;
            }
            if (userType !== 'patient') {
                delete data.tcNo;
            }

            await axios.post('http://localhost:5000/api/v1/auth/register', data); // v1 olarak güncellendi
            alert('Registration successful! You can now log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration Error:', error.response?.data || error.message);
            alert(error.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>User Type:</label>
                    <select
                        name="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="form-control"
                    >
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                        <option value="pharmacy">Pharmacy</option>
                    </select>
                </div>
                {userType === 'doctor' && (
                    <>
                        <div className="form-group">
                            <label>Specialty:</label>
                            <input
                                type="text"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Availability:</label>
                            <input
                                type="text"
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                    </>
                )}
                {userType === 'pharmacy' && (
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                )}
                {userType === 'patient' && (
                    <div className="form-group">
                        <label>TC ID No:</label>
                        <input
                            type="text"
                            name="tcNo"
                            value={formData.tcNo}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                )}
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
