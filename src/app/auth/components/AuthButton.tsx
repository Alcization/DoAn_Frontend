interface AuthButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean; // 1. Khai báo thêm prop disabled
}

export default function AuthButton({ 
  children, 
  type = "button", 
  onClick,
  disabled = false // 2. Lấy disabled từ props với giá trị mặc định là false
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled} // 3. Truyền vào thẻ HTML button
      // 4. Cập nhật class Tailwind để xử lý UI khi bị disabled
      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary-strong)] to-[var(--color-primary)] text-white font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed hover:not(:disabled):opacity-90"
    >
      {children}
    </button>
  );
}