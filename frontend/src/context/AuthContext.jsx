import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser({ email: decoded.email, username: decoded.sub, role: decoded.role, token });
                }
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token'); // Clear invalid token
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Login with username
            const response = await api.post('/auth/login', { username, password });
            const token = response.data.access_token;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            // Decode checks
            setUser({ email: decoded.email, username: decoded.sub, role: decoded.role, token });
            return { success: true, role: decoded.role };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false };
        }
    };

    const register = async (email, username, password) => {
        try {
            await api.post('/auth/register', { email, username, password });
            return true;
        } catch (error) {
            console.error("Register failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Note: Navigation should be handled by the component calling logout or by ProtectedRoute redirect
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
