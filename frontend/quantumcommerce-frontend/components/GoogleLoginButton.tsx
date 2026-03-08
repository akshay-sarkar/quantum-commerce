"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";

export default function GoogleLoginButton() {
  const { handleGoogleLogin } = useAuth();
  const router = useRouter();

  const handleSuccess = (res: CredentialResponse | null) => {
    if (!res?.credential) return; // user closed popup, etc.
    const idToken = res.credential;
    if (handleGoogleLogin) {
      handleGoogleLogin(idToken);
      router.push("/products");
    }
  };

  const handleError = () => {
    console.error("Google login error");
  };

  return (
    <GoogleLogin
      // @ts-expect-error: GoogleLogin types are missing prop definitions in this version
      onSuccess={handleSuccess}
      onError={handleError}
      size="large"
      theme="outline"
      shape="rectangular"
    />
  );
}
