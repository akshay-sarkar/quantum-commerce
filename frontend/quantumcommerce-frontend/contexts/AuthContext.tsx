'use client';
import { LOGIN_MUTATION, REGISTER_MUTATION, LOGIN_WITH_GOOGLE } from '@/graphql/gql';
import { useMutation } from '@apollo/client/react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { IUser, ILoginResponse, IRegisterResponse, AuthContextType, IGoogleLoginResponse } from '@/models';

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
      const [loginWithGoogle] = useMutation<IGoogleLoginResponse>(LOGIN_WITH_GOOGLE);

    const handleAuthSuccess = (authResponse: { token: string; user: IUser }) => {
        const { token, user } = authResponse;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    // login call
    const login = async (email: string, password: string) => {
        const { data } = await loginMutation({
            variables: { input: { email, password } }
        });

        if (data?.login) {
            handleAuthSuccess(data.login);
        }
    };

    // register call
    const signup = async (email: string, password: string, firstName: string, lastName: string) => {
        const { data } = await registerMutation({
            variables: { input: { email, password, firstName, lastName } }
        });
        if (data?.register) {
            handleAuthSuccess(data.register);
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

    const handleGoogleLogin = async (idToken: string) => {
        loginWithGoogle({
            variables: { idToken },
          }).then(({ data }) => {
            if (data?.loginWithGoogle) {
              const { token, user } = data.loginWithGoogle;
      
              // Store in sessionStorage to persist login
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('user', JSON.stringify(user));
      
              setToken(token);
              setUser(user);
            }
          }).catch((err) => {
            console.error('google login failed', err);
          });
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        setToken,
        setUser,
        handleGoogleLogin
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