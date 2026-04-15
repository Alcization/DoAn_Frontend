interface RoleOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface AuthRoleSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RoleOption[];
}

export default function AuthRoleSelect({ label, value, onChange, options }: AuthRoleSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                isSelected 
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
                  : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              <div className="mb-2">{option.icon}</div>
              <span className="text-xs font-semibold text-center leading-tight">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
