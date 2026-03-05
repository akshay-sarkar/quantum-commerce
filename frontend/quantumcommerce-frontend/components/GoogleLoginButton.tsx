import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../contexts/AuthContext'; // your auth context
import {LOGIN_WITH_GOOGLE} from '@/graphql/gql';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
  const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE);
  const { setToken, setUser } = useAuth();
  const router = useRouter();

  const handleSuccess = async (res: any) => {
    const idToken = res.credential;
    if (!idToken) return; // user closed popup, etc.

    try {
      const { data } = await loginWithGoogle({
        variables: { idToken },
      });

      if (data?.loginWithGoogle) {
        const { token, user } = data.loginWithGoogle;

        // Store in sessionStorage to persist login
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);

        router.push('/products');
      }
    } catch (err) {
      console.error('google login failed', err);
    }
  };

  const handleError = () => {
    console.error('Google login error');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      size="large"
      theme="outline"
    />
  );
}