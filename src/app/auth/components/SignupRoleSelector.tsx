import { User, Briefcase, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import AuthRoleSelect from "./AuthRoleSelect";

interface SignupRoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SignupRoleSelector({ value, onChange }: SignupRoleSelectorProps) {
  const { t } = useTranslation();

  return (
    <AuthRoleSelect
      label={t("auth.signup.roleLabel", { defaultValue: "Vai trò" })}
      value={value}
      onChange={onChange}
      options={[
        { value: "personal", label: t("auth.roles.personal", { defaultValue: "Cá nhân" }), icon: <User size={20} /> },
        { value: "business", label: t("auth.roles.business", { defaultValue: "Doanh nghiệp" }), icon: <Briefcase size={20} /> },
        { value: "government", label: t("auth.roles.government", { defaultValue: "Cơ quan quản lí" }), icon: <Building2 size={20} /> },
      ]}
    />
  );
}
