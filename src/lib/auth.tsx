"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// MVP: Mock "Cinematic Login" with no backend for now
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Simulate session check
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const login = () => {
        setLoading(true);
        setTimeout(() => {
            setUser({
                id: 'user_123',
                name: 'Alex Actuary',
                avatar: 'https://ui-avatars.com/api/?name=Alex+Actuary&background=6366f1&color=fff'
            });
            setLoading(false);
        }, 800);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
