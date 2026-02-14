'use client';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mutation
const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!){
        login(input: $input) {
            token
            user {
                id
                email
                firstName
                lastName
            }
        }
    }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

// Context Creation
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface UserResponse {
    token: string,
    user: User
}

interface LoginResponse {
    login: UserResponse
}

interface RegisterResponse {
    register: UserResponse
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loginMutation] = useMutation<LoginResponse>(LOGIN_MUTATION);
    const [registerMutation] = useMutation<RegisterResponse>(REGISTER_MUTATION);

    // Initialize from sessionStorage only on mount
    useEffect(() => {
        const savedToken = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

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
        logout
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