"use client";

import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { isGoogleAuthConfigured } from "../hooks/authSession";
import Image from "next/image"; // Nhớ import thư viện Image của Next.js

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
  // Đổi kiểu dữ liệu trả về từ CredentialResponse (id_token) sang TokenResponse (access_token)
  onSuccess: (tokenResponse: Omit<TokenResponse, "error" | "error_description" | "error_uri">) => void;
  onError: () => void;
}

export default function GoogleAuthButton({ mode, onSuccess, onError }: GoogleAuthButtonProps) {
  // Khởi tạo hook gọi popup đăng nhập Google
  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onError: onError,
  });

  if (!isGoogleAuthConfigured) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-3 text-center text-sm text-[var(--color-text-secondary)]">
        Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable this button.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center justify-center gap-3"
    >
      {/* Lưu ý nhỏ: đường dẫn của bạn đang là /asssets (có 3 chữ s), hãy kiểm tra lại xem có gõ dư không nhé */}
      <Image src="/asssets/google.svg" alt="Google" width={20} height={20} />
      {mode === "signin" ? "Đăng nhập với Google" : "Đăng ký với Google"}
    </button>
  );
}