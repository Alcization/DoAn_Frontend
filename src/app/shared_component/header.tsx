"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { useTheme } from "../../context/theme/ThemeContext";
import { useSidebar } from "../../context/sidebar/SidebarContext";

const menuIcon = "/asssets/icon/menu.png";  
const logoImg = "/asssets/logo/Logo.png";
const internetIcon = "/asssets/icon/internet.png";
const brightnessIcon = "/asssets/icon/brightness.png";
const nightModeIcon = "/asssets/icon/night-mode.png";
const userIcon = "/asssets/icon/user.png";

// Asset paths mapped to imports
const ASSETS = {
  menu: menuIcon,
  logo: logoImg,
  internet: internetIcon,
  brightness: brightnessIcon,
  nightMode: nightModeIcon,
  user: userIcon,
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const { i18n, t } = useTranslation();
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/signup";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setIsUserMenuOpen(false);
      window.location.href = "/auth/login"; 
      
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-20 px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] transition-colors duration-300 print:hidden">
      {/* Left Section: Menu + Logo */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu - Hidden on desktop (lg and above) */}
        <button 
          className="bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-sm)] transition-colors duration-200 flex items-center justify-center hover:bg-[var(--color-bg-secondary)]"
          aria-label="Menu"
          onClick={toggleSidebar}
        >
          <Image
            src={ASSETS.menu}
            alt="Menu"
            width={24}
            height={24}
            className={theme === "dark" ? "invert" : ""}
          />
        </button>
        
        {/* Logo */}
        <div className="flex items-center">
             <Image
              src={ASSETS.logo}
              alt="SWTIS Logo"
              width={120} 
              height={70}
              className="w-auto object-contain"
              style={{ width: "auto", height: "70px" }} // Maintain aspect ratio
            />
        </div>
      </div>

      {/* Right Section: Language, Theme, User */}
      <div className="flex items-center gap-5">
        {/* Language */}
        {/* Language Dropdown */}
        <div className="relative">
          <button 
            className="bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-sm)] transition-colors duration-200 flex items-center justify-center hover:bg-[var(--color-bg-secondary)]"
            aria-label="Language"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <Image
              src={ASSETS.internet}
              alt="Language"
              width={24}
              height={24}
              className={theme === "dark" ? "invert" : ""}
            />
          </button>
          
          {isLangOpen && (
            <div className="absolute top-12 right-0 w-32 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] overflow-hidden flex flex-col z-50 animation-fade-in">
              <button
                className={`px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--color-bg-secondary)] ${
                  i18n.language === "en" ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-text-primary)]"
                }`}
                onClick={() => changeLanguage("en")}
              >
                English
              </button>
              <div className="h-[1px] bg-[var(--color-border)] opacity-50" />
              <button
                className={`px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--color-bg-secondary)] ${
                  i18n.language === "vi" ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-text-primary)]"
                }`}
                onClick={() => changeLanguage("vi")}
              >
                Tiếng Việt
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggles */}
        <div className="flex gap-2">
            <button 
              className="bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-sm)] transition-colors duration-200 flex items-center justify-center hover:bg-[var(--color-bg-secondary)]"
              aria-label="Light Mode"
              onClick={() => setTheme("light")}
            >
            <Image
                src={ASSETS.brightness}
                alt="Light Mode"
                width={24}
                height={24}
                className={theme === "dark" ? "invert" : ""}
            />
            </button>
            <button 
              className="bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-sm)] transition-colors duration-200 flex items-center justify-center hover:bg-[var(--color-bg-secondary)]"
              aria-label="Dark Mode"
              onClick={() => setTheme("dark")}
            >
            <Image
                src={ASSETS.nightMode}
                alt="Dark Mode"
                width={24}
                height={24}
                className={theme === "dark" ? "invert" : ""}
            />
            </button>
        </div>

        {/* User Account Dropdown - Hidden on auth pages */}
        {!isAuthPage && (
          <div className="relative">
            <button 
              className="bg-transparent border-none cursor-pointer p-1 rounded-[var(--radius-sm)] transition-colors duration-200 flex items-center justify-center hover:bg-[var(--color-bg-secondary)]"
              aria-label="User Account"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <Image
                src={ASSETS.user}
                alt="User"
                width={24}
                height={24}
                className={theme === "dark" ? "invert" : ""}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] overflow-hidden flex flex-col z-50 animation-fade-in">
                <button
                  className="px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--color-bg-secondary)] text-[var(--color-danger)] font-medium"
                  onClick={handleLogout}
                >
                  {t("header.logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
