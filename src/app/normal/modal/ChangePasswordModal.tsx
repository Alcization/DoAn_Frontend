import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // Cập nhật kiểu trả về thành Promise<void> | void để hỗ trợ async/await
  onSave: (newPassword: string, confirmPassword: string) => Promise<void> | void; 
};

export default function ChangePasswordModal({ isOpen, onClose, onSave }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  
  // State quản lý hiệu ứng loading khi đang gọi API
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password: string): string => {
    // API yêu cầu tối thiểu 6 ký tự
    if (password.length < 6) {
      return t("accountPage.modals.changePassword.errors.tooShort", "Mật khẩu phải có ít nhất 6 ký tự.");
    }
    if (!/[A-Z]/.test(password)) {
      return t("accountPage.modals.changePassword.errors.noUppercase");
    }
    if (!/[a-z]/.test(password)) {
      return t("accountPage.modals.changePassword.errors.noLowercase");
    }
    if (!/[0-9]/.test(password)) {
      return t("accountPage.modals.changePassword.errors.noNumber");
    }
    return "";
  };

  const handleSave = async () => {
    const newPasswordError = validatePassword(formData.newPassword);
    const confirmPasswordError = formData.newPassword !== formData.confirmPassword
      ? t("accountPage.modals.changePassword.errors.noMatch")
      : "";

    if (newPasswordError || confirmPasswordError) {
      setErrors({
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Đợi component cha gọi API xong
      await onSave(formData.newPassword, formData.confirmPassword);
      
      // Reset form sau khi gọi API hoàn tất
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({
        newPassword: "",
        confirmPassword: "",
      });
      // Lưu ý: Việc đóng modal (onClose) đã được xử lý ở component cha khi API thành công.
    } catch (error) {
      // Nếu có lỗi, component cha đã báo lỗi, ta chỉ cần tắt loading
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (field: "newPassword" | "confirmPassword", value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error khi người dùng bắt đầu gõ lại
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader 
        title={t("accountPage.modals.changePassword.title")}
        subtitle={t("accountPage.modals.changePassword.desc")}
        icon={<Lock size={20} className="text-[var(--color-primary)]" />}
        onClose={onClose}
      />

      <ModalBody>
        <div className="space-y-5">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              {t("accountPage.modals.changePassword.newPasswordLabel")}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input 
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                placeholder={t("accountPage.modals.changePassword.newPasswordPlaceholder")}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                  errors.newPassword ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)] disabled:opacity-60`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-[var(--color-danger)] mt-1">{errors.newPassword}</p>
            )}
            <p className="text-xs text-[var(--color-text-muted)]">
              {t("accountPage.modals.changePassword.requirements")}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              {t("accountPage.modals.changePassword.confirmPasswordLabel")}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                placeholder={t("accountPage.modals.changePassword.confirmPasswordPlaceholder")}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                  errors.confirmPassword ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
                } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)] disabled:opacity-60`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-[var(--color-danger)] mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button 
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium text-sm hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("common.cancel")}
        </button>
        <button 
          onClick={handleSave}
          disabled={!formData.newPassword.trim() || !formData.confirmPassword.trim() || isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          {isSubmitting ? t("common.saving", "Đang lưu...") : t("accountPage.modals.changePassword.saveBtn")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}