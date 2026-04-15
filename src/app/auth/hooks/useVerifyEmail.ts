import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/services/api-config";

export function useVerifyEmail() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây

  const hasAutoSentOtp = useRef(false);

  useEffect(() => {
    if (email && !hasAutoSentOtp.current) {
      hasAutoSentOtp.current = true;

      const autoSendOtp = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.message || t("auth.errors.sendOtpFailed", { defaultValue: "Failed to send OTP automatically" }));
          } else {
            console.log("Auto-sent OTP to:", email);
            setCountdown(300);
          }
        } catch (err: any) {
          console.error("Lỗi gửi OTP tự động:", err);
        }
      };

      autoSendOtp();
    }
  }, [email, t]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError(t("auth.errors.otpRequired", { defaultValue: "OTP is required" }));
      return;
    }
    if (otp.length !== 6) {
      setError(t("auth.errors.otpInvalid", { defaultValue: "OTP must be 6 digits" }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("auth.errors.otpIncorrect", { defaultValue: "Incorrect OTP code. Please try again." }));
      }

      if (data.ok) {
        console.log("Verified email successfully:", email);
        router.push(`/auth/new-password?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("auth.errors.sendOtpFailed", { defaultValue: "Failed to resend OTP" }));
      }

      console.log("Resent OTP to:", email);
      setCountdown(300); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return {
    t,
    email,
    otp,
    setOtp,
    error,
    isLoading,
    countdown,
    handleVerify,
    handleResend,
    formatTime,
  };
}