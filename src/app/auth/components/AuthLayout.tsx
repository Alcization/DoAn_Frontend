import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-bg)] to-[var(--color-primary)]/5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/asssets/logo/Logo.png"
            alt="SWTIS Logo"
            width={200}
            height={100}
            className="mx-auto mb-4"
          />
        </div>

        {/* Auth Form Container */}
        <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
