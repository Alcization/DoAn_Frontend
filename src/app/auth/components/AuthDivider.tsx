interface AuthDividerProps {
  text: string;
}

export default function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
      <span className="text-sm text-[var(--color-text-secondary)]">
        {text}
      </span>
      <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
    </div>
  );
}
