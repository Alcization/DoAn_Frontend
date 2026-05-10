"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../context/sidebar/SidebarContext";

interface SidebarItem {
  labelKey: string;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Backdrop overlay for mobile/tablet - only visible when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          flex-shrink-0 h-[calc(100vh-80px)] sticky top-20 bg-[var(--color-surface)] border-r border-[var(--color-border)] overflow-y-auto transition-all duration-300 ease-in-out print:hidden
          lg:w-64 lg:opacity-100
          ${isOpen ? "w-64 opacity-100 z-50" : "w-0 opacity-0 overflow-hidden border-none"}
        `}
      >
        <nav className="flex flex-col p-4 gap-2">
          {items.map((item) => {
            // Parse the item href to check for query params
            const [itemPath, itemQuery] = item.href.split('?');
            const isPathMatch = pathname === itemPath;
            
            // Check query params if they exist in the item href
            let isQueryMatch = true;
            if (itemQuery) {
              const itemParams = new URLSearchParams(itemQuery);
              itemParams.forEach((value, key) => {
                if (searchParams.get(key) !== value) {
                  isQueryMatch = false;
                }
              });
            }
            
            const isActive = isPathMatch && isQueryMatch;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-3 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200
                  flex items-center text-[var(--color-sidebar-text)]
                  ${isActive 
                    ? "bg-[var(--color-bg-secondary)] border-l-4 border-[var(--color-primary)]" 
                    : "hover:bg-[var(--color-bg)] border-l-4 border-transparent"
                  }
                `}
              >
                <span className="truncate">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
