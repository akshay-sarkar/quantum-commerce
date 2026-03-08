'use client';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../contexts/AuthContext';
import { LOGIN_WITH_GOOGLE } from '@/graphql/gql';
import { useRouter } from 'next/navigation';
import {CredentialResponse} from '@react-oauth/google';
import { IGoogleLoginResponse } from '@/models';

export default function GoogleLoginButton() {
  const [loginWithGoogle, { loading }] = useMutation<IGoogleLoginResponse>(LOGIN_WITH_GOOGLE);
  const  { setToken, setUser } = useAuth();
  const router = useRouter();

  const handleSuccess = (res: CredentialResponse | null) => {
    if (!res?.credential) return; // user closed popup, etc.
    const idToken = res.credential;
    
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

        router.push('/products');
      }
    }).catch((err) => {
      console.error('google login failed', err);
    });
  };

  const handleError = () => {
    console.error('Google login error');
  };

  return (
    loading ? (
      <div className="w-full flex justify-center py-3">
        <div className="loader" />
      </div>
    ) : (
    
    <GoogleLogin
      // @ts-expect-error: GoogleLogin types are missing prop definitions in this version
      onSuccess={handleSuccess}
      onError={handleError}
      size="large"
      theme="outline"
      shape="rectangular"
    />
    )
  );
}