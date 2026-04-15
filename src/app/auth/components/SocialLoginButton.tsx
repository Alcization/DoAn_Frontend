interface SocialLoginButtonProps {
  onClick: () => void;
  text: string;
  icon: React.ReactNode;
}

export default function SocialLoginButton({ onClick, text, icon }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center justify-center gap-3"
    >
      {icon}
      {text}
    </button>
  );
}
