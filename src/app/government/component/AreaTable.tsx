"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AreaRowFactory } from "./area-logic/AreaRowFactory";
import { useAreaTable } from "./area-logic/useAreaTable";
import Pagination from "./Pagination";
import QuickAddAreaModal from "../modal/QuickAddAreaModal";
import EditAreaModal from "../modal/EditAreaModal";
import DeleteAreaModal from "../modal/DeleteAreaModal";

/**
 * [FACADE PATTERN] - AreaTable: The primary interface for area management.
 * Adheres to SRP by delegating logic to useAreaTable and rendering to AreaRowFactory.
 */
export default function AreaTable() {
  const { t } = useTranslation();
  const {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    isQuickAddOpen,
    isEditOpen,
    isDeleteOpen,
    selectedArea,
    isLoading,
    error,
    toggleModal,
    handleCreate,
    handleEditSave,
    handleDeleteConfirm,
  } = useAreaTable();

  return (
    <>
      {/* Modals Facade */}
      <QuickAddAreaModal 
        isOpen={isQuickAddOpen} 
        onClose={() => toggleModal("isQuickAddOpen", false)}
        onCreate={handleCreate}
      />
      <EditAreaModal
        isOpen={isEditOpen}
        onClose={() => toggleModal("isEditOpen", false)}
        area={selectedArea}
        onSave={handleEditSave}
      />
      <DeleteAreaModal
        isOpen={isDeleteOpen}
        onClose={() => toggleModal("isDeleteOpen", false)}
        area={selectedArea}
        onConfirm={handleDeleteConfirm}
      />

      {/* Table Interface */}
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 flex items-center justify-between border-b border-(--color-border) bg-(--color-bg)/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-(--color-primary-bg) text-(--color-primary)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h2 className="text-(--text-lg) font-bold text-(--color-text-primary)">
                {t("areaManagement.title")}
              </h2>
            </div>
          </div>
          <button 
            onClick={() => toggleModal("isQuickAddOpen", true)}
            className="bg-(--color-primary) text-white px-5 py-2.5 rounded-xl font-bold text-(--text-sm) hover:bg-(--color-primary-strong) transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            + {t("areaManagement.actions.quickAdd")}
          </button>
        </div>

        <div className="overflow-x-auto flex-1 h-[400px]">
          {error && (
            <div className="mx-4 mt-4 rounded-xl border border-(--color-danger)/20 bg-(--color-danger-bg) px-4 py-3 text-sm text-(--color-danger)">
              {error}
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-(--color-surface)">
              <tr className="border-b border-(--color-border) text-(--color-text-muted) text-(--text-xs) uppercase tracking-wider">
                <th className="p-4 font-bold">{t("areaManagement.table.areaName")}</th>
                <th className="p-4 font-bold">{t("areaManagement.table.adminUnit")}</th>
                <th className="p-4 font-bold">{t("areaManagement.table.hotspots")}</th>
                <th className="p-4 font-bold text-right">{t("areaManagement.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-(--color-text-secondary)">
                    {t("common.loading")}
                  </td>
                </tr>
              )}

              {!isLoading && currentItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-(--color-text-secondary)">
                    {t("areaManagement.table.noData")}
                  </td>
                </tr>
              )}

              {!isLoading && currentItems.map((area) => 
                AreaRowFactory.createRow(
                  area, 
                  t, 
                  (a) => toggleModal("isEditOpen", true, a), 
                  (a) => toggleModal("isDeleteOpen", true, a)
                )
              )}
            </tbody>
          </table>
        </div>

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
    </>
  );
}
