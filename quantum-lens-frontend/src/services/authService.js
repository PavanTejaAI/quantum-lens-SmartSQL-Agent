import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('quantum_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear local storage
            localStorage.removeItem('quantum_token');
            localStorage.removeItem('quantum_user');
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getAuthHeader = () => {
    const token = localStorage.getItem('quantum_token');
    return { Authorization: `Bearer ${token}` };
};

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        localStorage.setItem('quantum_token', response.data.token);
        localStorage.setItem('quantum_user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Login failed';
    }
};

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        localStorage.setItem('quantum_token', response.data.token);
        localStorage.setItem('quantum_user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Registration failed';
    }
};

export const logout = () => {
    localStorage.removeItem('quantum_token');
    localStorage.removeItem('quantum_user');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('quantum_user');
    return userStr ? JSON.parse(userStr) : null;
};

export const updateProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('/auth/profile', profileData);
        localStorage.setItem('quantum_user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Profile update failed';
    }
};

export default {
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    getAuthHeader,
    axiosInstance
};