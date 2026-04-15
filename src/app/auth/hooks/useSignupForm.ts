import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api-config";

export function useSignupForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "", // Đã thêm fullName để khớp với API yêu cầu
    email: "",
    password: "",
    confirmPassword: "",
    role: "personal",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateFullName = (name: string): string => {
    if (!name.trim()) {
      return t("auth.errors.fullNameRequired", "Vui lòng nhập họ và tên");
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) {
      return t("auth.errors.emailRequired");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t("auth.errors.emailInvalid");
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return t("auth.errors.passwordRequired");
    }
    if (password.length < 8) {
      return t("auth.errors.passwordMinLength");
    }
    if (!/[A-Z]/.test(password)) {
      return t("auth.errors.passwordUppercase");
    }
    if (!/[a-z]/.test(password)) {
      return t("auth.errors.passwordLowercase");
    }
    if (!/[0-9]/.test(password)) {
      return t("auth.errors.passwordNumber");
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!confirmPassword) {
      return t("auth.errors.confirmPasswordRequired");
    }
    if (confirmPassword !== formData.password) {
      return t("auth.errors.passwordsNoMatch");
    }
    return "";
  };

  // Sử dụng keyof typeof formData để Typescript hiểu các trường linh hoạt hơn
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError(null); // Xóa lỗi API khi người dùng bắt đầu nhập lại
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate dữ liệu ở Client
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);

    if (fullNameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        fullName: fullNameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    // 2. Bắt đầu gọi API
    setIsLoading(true);
    setApiError(null);

    try {
      // Tự động tạo username từ phần trước @ của email
      const generatedUsername = formData.email.split('@')[0];

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: generatedUsername,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName, 
          accountType: formData.role, // Ánh xạ role từ form UI vào accountType
          roles: ["user"] // Set role mặc định theo hệ thống
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("auth.errors.signupFailed", "Đăng ký thất bại."));
      }

      // 3. Đăng ký thành công -> Điều hướng sang luồng xác thực email
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
      
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google Sign-In
    console.log("Google Sign-In clicked");
    // Will be implemented later with actual Google OAuth
  };

  return {
    t,
    router,
    formData,
    errors,
    isLoading, // Export thêm isLoading để disable nút bấm trên UI
    apiError,  // Export thêm apiError để hiển thị lỗi từ server trên UI
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleInputChange,
    handleSignup,
    handleGoogleSignIn,
  };
}