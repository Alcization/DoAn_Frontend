"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onNext, 
  onPrev 
}: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-(--color-surface) border-t border-(--color-border)">
      <div className="text-(--color-text-secondary) font-medium">
        {t("common.pagination.page")} <span className="text-(--color-text-primary) font-bold">{currentPage}</span> {t("common.pagination.of")} <span className="text-(--color-text-primary) font-bold">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-bg) disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title={t("common.pagination.prev")}
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (totalPages > 7) {
                if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                    if (page === 2 || page === totalPages - 1) return <span key={page} className="text-(--color-text-muted) px-1">...</span>;
                    return null;
                }
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-(--text-xs) font-bold transition-all
                  ${currentPage === page 
                    ? "bg-(--color-primary) text-white shadow-sm shadow-blue-500/20" 
                    : "text-(--color-text-secondary) hover:bg-(--color-bg)"
                  }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-bg) disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title={t("common.pagination.next")}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
