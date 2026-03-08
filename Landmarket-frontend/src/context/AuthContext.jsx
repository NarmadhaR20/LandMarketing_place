import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
            return null;
        }
    });

    const [isProfileComplete, setIsProfileComplete] = useState(() => {
        return user ? !!user.isProfileComplete : false;
    });

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            const { token, user: backendUser } = response;

            const decoded = jwtDecode(token);

            // Normalize everything into a consistent frontend user object
            const userData = {
                ...backendUser,
                token,
                role: backendUser.role.toLowerCase(), // CRITICAL for routing
                email: backendUser.email,
                name: backendUser.name,
                mobile: backendUser.primaryMobile,
                altMobile: backendUser.additionalMobile,
                authorityProof: backendUser.authorityProof,
                isProfileComplete: backendUser.profileCompleted
            };

            setUser(userData);
            setIsProfileComplete(userData.isProfileComplete);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsProfileComplete(false);
        localStorage.removeItem('user');
    };

    const completeProfile = async (data) => {
        try {
            const updatedBackendUser = await authService.updateProfile({
                ...data,
                primaryMobile: data.mobile,
                additionalMobile: data.altMobile,
                authorityProof: data.authorityProof
            });

            // Merge backend data into user state
            const updatedUser = {
                ...user,
                ...updatedBackendUser,
                role: updatedBackendUser.role.toLowerCase(), // Ensure consistent casing
                mobile: updatedBackendUser.primaryMobile,
                altMobile: updatedBackendUser.additionalMobile,
                authorityProof: updatedBackendUser.authorityProof,
                isProfileComplete: true
            };

            setUser(updatedUser);
            setIsProfileComplete(true);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Failed to update profile on backend:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isProfileComplete, login, logout, completeProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
