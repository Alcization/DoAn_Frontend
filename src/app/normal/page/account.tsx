"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { USER_PROFILE_MOCK } from "../../../context/services/mock/normal/shared/account";
import AccountProfileSection from "../shared_component/AccountProfileSection";
import AccountDetailsForm, { AccountDetailsFormRef } from "../shared_component/AccountDetailsForm";
import AccountActionButtons from "../shared_component/AccountActionButtons";

export default function NormalAccount() {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string | null>(USER_PROFILE_MOCK.avatar);
  
  // State quản lý trạng thái loading chung khi form đang submit
  const [isSaving, setIsSaving] = useState(false);
  
  // Tạo ref để gọi hàm từ AccountDetailsForm
  const formRef = useRef<AccountDetailsFormRef>(null);

  const handleSaveData = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[var(--color-bg)] min-h-[calc(100vh-80px)]">

      <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-md)] flex flex-col gap-5 border border-[var(--color-border)]">
        <AccountProfileSection 
            avatar={avatar} 
          setAvatar={setAvatar}
        />

        <AccountDetailsForm 
            ref={formRef} 
            userProfile={USER_PROFILE_MOCK} 
            onSavingStateChange={setIsSaving}
        />

        <AccountActionButtons 
            onSaveClick={handleSaveData} 
            isSaving={isSaving}
        />
      </div>
    </div>
  );
}