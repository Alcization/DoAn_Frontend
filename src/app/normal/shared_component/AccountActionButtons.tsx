"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChangePasswordModal from "../modal/ChangePasswordModal";
import { API_BASE_URL } from "@/services/api-config";

interface Props {
  onSaveClick: () => void;
  isSaving?: boolean;
}

export default function AccountActionButtons({ onSaveClick, isSaving }: Props) {
  const { t } = useTranslation();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (newPassword: string, confirmPassword: string) => {
    // 1. Validate dữ liệu đầu vào cơ bản
    if (newPassword !== confirmPassword) {
      alert(t("accountPage.messages.passwordMismatch", "Mật khẩu xác nhận không khớp."));
      return;
    }

    if (newPassword.length < 6) {
      alert(t("accountPage.messages.passwordTooShort", "Mật khẩu phải có ít nhất 6 ký tự."));
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error(t("common.notLoggedIn", "Vui lòng đăng nhập để thực hiện chức năng này."));
      }

      // 2. Lấy thông tin User hiện tại để trích xuất email
      const profileResponse = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
      }

      const profileData = await profileResponse.json();
      const userEmail = profileData.email;

      if (!userEmail) {
        throw new Error("Không tìm thấy địa chỉ email liên kết với tài khoản này.");
      }

      // 3. Gọi API Reset Password
      const resetResponse = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail,
          newPassword: newPassword
        })
      });

      const resetData = await resetResponse.json();

      if (!resetResponse.ok) {
        throw new Error(resetData.message || "Đã xảy ra lỗi khi cập nhật mật khẩu.");
      }

      // 4. Thành công: Thông báo và đóng modal
      alert(t("accountPage.messages.passwordChanged", "Cập nhật mật khẩu thành công!"));
      setIsChangePasswordModalOpen(false);

    } catch (error: any) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      alert(error.message || "Đã xảy ra lỗi hệ thống.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={onSaveClick}
          disabled={isSaving || isChangingPassword}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[var(--radius-md)] border-none bg-gradient-to-r from-[var(--color-primary-strong)] to-[var(--color-primary)] text-white font-semibold cursor-pointer shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 transition-all text-[var(--text-sm)] sm:text-[var(--text-base)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? t("common.saving", "Đang lưu...") : t("accountPage.buttons.save")}
        </button>
        <button 
          onClick={() => setIsChangePasswordModalOpen(true)}
          disabled={isSaving || isChangingPassword}
          className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--text-sm)] sm:text-[var(--text-base)] disabled:opacity-50"
        >
          {t("accountPage.buttons.changePassword")}
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handlePasswordChange}
      />
    </>
  );
}