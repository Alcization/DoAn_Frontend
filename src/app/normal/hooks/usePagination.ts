import { useState, useMemo, useCallback } from "react";

/**
 * usePagination Hook (Strategy Pattern)
 * 
 * Provides a reusable strategy for handling pagination logic across different list components.
 * It encapsulates current page state, calculations for total pages, and data slicing.
 */
export const usePagination = <T,>(items: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Ensure current page is valid after items change (e.g., filtering)
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const currentItems = useMemo(() => {
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, startIndex, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
};
