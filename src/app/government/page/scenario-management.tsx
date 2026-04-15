"use client";

import React from "react";
import ScenarioList from "../component/ScenarioList";
import EditScenarioModal from "../modal/EditScenarioModal";
import DeleteScenarioModal from "../modal/DeleteScenarioModal";
import { useScenarioManagement } from "../hooks/useScenarioManagement";

/**
 * [FACADE PATTERN] - GovScenarioManagement: Orchestrates the scenario management view.
 * Adheres to SOLID by delegating all business logic to the useScenarioManagement hook.
 */
export default function GovScenarioManagement() {
  const {
    filteredScenarios,
    selectedScenarioId,
    isEditModalOpen,
    isDeleteModalOpen,
    modalScenario,
    filters,
    setFilters,
    handleSelect,
    handleAdd,
    handleEdit,
    handleDeleteTrigger,
    onSaveScenario,
    onDeleteScenario,
    closeEditModal,
    closeDeleteModal,
  } = useScenarioManagement();

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto pr-2 pb-10">
      {/* List Column: Full Width */}
      <div className="h-full">
        <ScenarioList 
            scenarios={filteredScenarios}
            selectedId={selectedScenarioId} 
            onSelect={handleSelect}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDeleteTrigger}
            filters={filters}
            onFilterChange={setFilters}
        />
      </div>

      {/* Modals Facade */}
      <EditScenarioModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        scenario={modalScenario}
        onSave={onSaveScenario}
      />
      <DeleteScenarioModal 
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        scenario={modalScenario}
        onDelete={onDeleteScenario}
      />
    </div>
  );
}
