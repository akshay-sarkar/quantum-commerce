'use client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/gql';
import { useMutation } from '@apollo/client/react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { IUser, ILoginResponse, IRegisterResponse, AuthContextType } from '@/models';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(() => {
        if (typeof window === 'undefined') return null;
        const savedUser = sessionStorage.getItem('user');
        if (!savedUser) return null;
        try {
            return JSON.parse(savedUser);
        } catch {
            sessionStorage.removeItem('user');
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null;
        return sessionStorage.getItem('token');
    });
    const [loginMutation] = useMutation<ILoginResponse>(LOGIN_MUTATION);
    const [registerMutation] = useMutation<IRegisterResponse>(REGISTER_MUTATION);

    // login call
    const login = async (email: string, password: string) => {
        const { data } = await loginMutation({
            variables: { input: { email, password } }
        });

        if (data?.login) {
            const { token, user } = data.login;

            // Store in sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));

            // Update context state
            setToken(token);
            setUser(user);
        }
    };

    // register call
    const signup = async (email: string, password: string, firstName: string, lastName: string) => {
        const { data } = await registerMutation({
            variables: { input: { email, password, firstName, lastName } }
        });
        if (data?.register) {
            const { token, user } = data.register;

            // Store in sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));

            // Update context state
            setToken(token);
            setUser(user);
        }
    };

    const logout = () => {
        // Clear sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        // Clear context state
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        setToken,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}