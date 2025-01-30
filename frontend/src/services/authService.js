import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1'; // Backend API adresinizi ayarlayın

export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    return response.data;
};

export const registerUser = async (registerData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    return response.data;
};
