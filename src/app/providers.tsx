"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from "./auth/hooks/authSession";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  if (!isGoogleAuthConfigured) {
    return children;
  }

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
}