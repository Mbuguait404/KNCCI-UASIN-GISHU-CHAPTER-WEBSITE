import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/auth-service';
import { useLocation } from 'wouter';

interface User {
    _id: string;
    name: string;
    email: string;
    reg_no: string;
    role: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await authService.getMe();
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        localStorage.removeItem('accessToken');
                    }
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    localStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await authService.login(credentials);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                setUser(response.data.user);
            }

        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setLocation('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
