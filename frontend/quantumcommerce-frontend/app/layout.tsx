import type { Metadata } from "next";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import ApolloProviderWrapper from "@/providers/ApolloProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSyncBridge from "@/components/CartSyncBridge";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quantum Commerce",
  description:
    "A high-performance e-commerce platform built with the modern web stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Rendering RootLayout", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bodoniModa.variable} antialiased`}
      >
        <ThemeProvider>
          <ApolloProviderWrapper>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <AuthProvider>
              <CartSyncBridge />
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
            </AuthProvider>
            </GoogleOAuthProvider>
          </ApolloProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
