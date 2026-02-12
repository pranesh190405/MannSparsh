import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token
        const token = sessionStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user', error);
            sessionStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        sessionStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        // Explicitly fetch full user details if needed, or just use what login returned
        // Login returns { token, user: {id, name, role} }
        // We might want full profile
        await fetchUser();
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post('/api/auth/register', userData);
        sessionStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        await fetchUser();
        return res.data;
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
