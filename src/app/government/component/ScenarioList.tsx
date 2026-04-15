"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Search, List } from "lucide-react";
import { ScenarioType } from "../../../context/services/mock/government/scenario-management";
import { usePagination } from "../../normal/hooks/usePagination";
import Pagination from "./Pagination";
import { ScenarioItemFactory } from "./scenario-logic/ScenarioItemFactory";
import { FilterOptions, Scenario } from "./scenario-logic/ScenarioTypes";

interface ScenarioListProps {
  scenarios: Scenario[];
  selectedId: number | null;
  onSelect: (scenario: Scenario) => void;
  onAdd: () => void;
  onEdit: (scenario: Scenario) => void;
  onDelete: (scenario: Scenario) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

/**
 * [FACADE PATTERN] - ScenarioList: Purely presentational list that delegates item rendering to a Factory.
 */
export default function ScenarioList({ 
  scenarios, 
  selectedId, 
  onSelect, 
  onAdd, 
  onEdit, 
  onDelete, 
  filters,
  onFilterChange 
}: ScenarioListProps) {
  const { t } = useTranslation();

  const { currentItems, currentPage, totalPages, nextPage, prevPage, goToPage } = 
    usePagination(scenarios, 6);

  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 flex flex-col gap-4 border-b border-(--color-border) bg-(--color-bg)/30">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-(--color-primary-bg) text-(--color-primary)">
                  <List size={20} />
                </div>
                <div>
                  <h2 className="text-(--text-lg) font-bold text-(--color-text-primary)">
                    {t("scenarioManagement.title")}
                  </h2>
                </div>
            </div>
        </div>

        {/* Inline Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {/* Search */}
             <div className="relative group sm:col-span-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) group-focus-within:text-(--color-primary) transition-colors" />
                <input 
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                    placeholder={t("scenarioManagement.filterModal.searchPlaceholder")}
                    className="w-full pl-9 pr-4 py-2 text-(--text-sm) rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/10 transition-all border-none shadow-inner"
                />
             </div>

             {/* Type Select */}
             <select 
                value={filters.type}
                onChange={(e) => onFilterChange({ ...filters, type: e.target.value as ScenarioType | "all" })}
                className="px-3 py-2 text-(--text-sm) rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/10 transition-all appearance-none cursor-pointer border-none shadow-inner"
             >
                <option value="all">{t("scenarioManagement.filterModal.allTypes")}</option>
                <option value="flood">{t("scenarioManagement.type.flood")}</option>
                <option value="storm">{t("scenarioManagement.type.storm")}</option>
                <option value="fire">{t("scenarioManagement.type.fire")}</option>
                <option value="earthquake">{t("scenarioManagement.type.earthquake")}</option>
             </select>
        </div>
      </div>

      {/* List content with Factory Pattern */}
      <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3 h-[400px]">
         <button 
            onClick={onAdd}
            className="w-full py-3 border-2 border-dashed border-(--color-primary)/30 rounded-2xl text-(--color-primary) font-semibold hover:bg-(--color-primary-bg) transition-all active:scale-95"
         >
            + {t("scenarioManagement.createTitle")}
         </button>

         <div className="flex flex-col gap-3">
           {currentItems.map((scenario) => 
              ScenarioItemFactory.createItem(
                scenario, 
                selectedId, 
                onSelect, 
                onEdit, 
                onDelete, 
                t
              )
           )}
         </div>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-(--color-border) bg-(--color-bg)/10">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </div>
    </div>
  );
}
