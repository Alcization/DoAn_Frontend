import { useState, useMemo, useCallback } from "react";
import { HISTORY_ITEMS, WEATHER_SEARCH_HISTORY } from "../../../context/services/mock/normal/shared/history";

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

  const filteredHistoryItems = useMemo(() => {
    return HISTORY_ITEMS.filter(item => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      
      const formattedFilterDate = dateFilter 
        ? dateFilter.split('-').reverse().join('/') 
        : "";
        
      const matchesDate = !dateFilter || item.date.startsWith(formattedFilterDate);
      
      return matchesType && matchesDate;
    });
  }, [typeFilter, dateFilter]);

  const filteredWeatherHistory = useMemo(() => {
    return WEATHER_SEARCH_HISTORY.filter(item => {
      const matchesType = typeFilter === "all" || typeFilter === "location";
      
      const formattedFilterDate = dateFilter 
        ? dateFilter.split('-').reverse().join('/') 
        : "";

      const matchesDate = !dateFilter || item.date.startsWith(formattedFilterDate);
      
      return matchesType && matchesDate;
    });
  }, [typeFilter, dateFilter]);

  return {
    typeFilter,
    setTypeFilter,
    dateFilter,
    setDateFilter,
    filteredHistoryItems,
    filteredWeatherHistory
  };
};
