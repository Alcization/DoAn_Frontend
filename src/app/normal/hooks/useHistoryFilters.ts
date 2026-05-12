import { useState } from "react";

/**
 * useHistoryFilters Hook (Mediator Pattern)
 * 
 * Acts as a centralized manager for history-specific filtering.
 * It encapsulates the state of filters and the logic to apply those 
 * filters to both route/location history and weather search history.
 */
export const useHistoryFilters = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  return {
    typeFilter,
    setTypeFilter,
    dateFilter,
    setDateFilter
  };
};
