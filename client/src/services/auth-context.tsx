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
    requirePasswordChange?: boolean;
}

export interface OtpPendingState {
    requiresOTP: true;
    otpToken: string;
    maskedEmail: string;
    maskedPhone?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<User | OtpPendingState>;
    verifyOtp: (otpToken: string, code: string, credentials?: any) => Promise<User>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    temporaryPassword: string | null;
    clearTemporaryPassword: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TEMP_PASSWORD_STORAGE_KEY = 'temporaryPassword';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const storedTemporaryPassword = sessionStorage.getItem(TEMP_PASSWORD_STORAGE_KEY);

            if (storedTemporaryPassword) {
                setTemporaryPassword(storedTemporaryPassword);
            }

            if (token) {
                try {
                    const response = await authService.getMe();
                    if (response.success) {
                        setUser(response.data);
                        if (!response.data.requirePasswordChange) {
                            sessionStorage.removeItem(TEMP_PASSWORD_STORAGE_KEY);
                            setTemporaryPassword(null);
                        }
                    } else {
                        localStorage.removeItem('accessToken');
                        sessionStorage.removeItem(TEMP_PASSWORD_STORAGE_KEY);
                        setTemporaryPassword(null);
                    }
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    localStorage.removeItem('accessToken');
                    sessionStorage.removeItem(TEMP_PASSWORD_STORAGE_KEY);
                    setTemporaryPassword(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: any): Promise<User | OtpPendingState> => {
        const response = await authService.login(credentials);
        if (!response.success) throw new Error('Login failed');

        // OTP challenge — return pending state without setting user
        if (response.data?.requiresOTP) {
            return {
                requiresOTP: true,
                otpToken: response.data.otpToken,
                maskedEmail: response.data.maskedEmail,
                maskedPhone: response.data.maskedPhone,
            } as OtpPendingState;
        }

        // Direct login (fallback, e.g. exchange-marketplace-token flow)
        return _applyLoginResponse(response.data, credentials?.password);
    };

    const verifyOtp = async (otpToken: string, code: string, credentials?: any): Promise<User> => {
        const response = await authService.verifyOtp(otpToken, code);
        if (!response.success) throw new Error('OTP verification failed');
        return _applyLoginResponse(response.data, credentials?.password);
    };

    /** Shared helper: store tokens + set user state after successful auth */
    const _applyLoginResponse = (data: any, password?: string): User => {
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data.user);

        const shouldKeepTemporaryPassword =
            data.user?.requirePasswordChange &&
            typeof password === 'string' &&
            password.length > 0;

        if (shouldKeepTemporaryPassword) {
            setTemporaryPassword(password!);
            sessionStorage.setItem(TEMP_PASSWORD_STORAGE_KEY, password!);
        } else {
            setTemporaryPassword(null);
            sessionStorage.removeItem(TEMP_PASSWORD_STORAGE_KEY);
        }

        return data.user;
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem(TEMP_PASSWORD_STORAGE_KEY);
        setTemporaryPassword(null);
        setUser(null);
        setLocation('/');
    };

    const clearTemporaryPassword = () => {
        sessionStorage.removeItem(TEMP_PASSWORD_STORAGE_KEY);
        setTemporaryPassword(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                verifyOtp,
                logout,
                updateUser,
                temporaryPassword,
                clearTemporaryPassword,
                isAuthenticated: !!user,
            }}
        >
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
