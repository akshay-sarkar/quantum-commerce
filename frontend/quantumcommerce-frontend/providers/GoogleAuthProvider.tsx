'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export default function GoogleAuthProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // @ts-expect-error: GoogleOAuthProvider types are missing children prop definition
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            {children}
        </GoogleOAuthProvider>
    );
}