import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  error,
  helperText,
  isPassword,
  showPassword,
  onTogglePassword,
}: AuthInputProps) {
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          {icon}
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 ${isPassword ? "pr-12" : "pr-4"} py-3 rounded-xl border ${
            error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
          } bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--color-text-muted)]`}
        />
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
