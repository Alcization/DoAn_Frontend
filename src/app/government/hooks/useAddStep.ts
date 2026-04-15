import { useState, useCallback } from "react";
import { Priority, ScenarioAction } from "../../../context/services/mock/government/scenario-management";
import { ModalFormData } from "../modal/logic/ModalTypes";

/**
 * [FACADE PATTERN] - useAddStep: Manages form state and actions for adding a scenario step.
 */
export function useAddStep(onAdd?: (step: Omit<ScenarioAction, "id" | "step">) => void, onClose?: () => void) {
  const [formData, setFormData] = useState<ModalFormData>({
    description: "",
    priority: "Medium",
  });

  const updateDescription = useCallback((description: string) => {
    setFormData(prev => ({ ...prev, description }));
  }, []);

  const updatePriority = useCallback((priority: Priority) => {
    setFormData(prev => ({ ...prev, priority }));
  }, []);

  const handleAdd = useCallback(() => {
    if (formData.description.trim() && onAdd) {
      onAdd({
        description: formData.description,
        priority: formData.priority,
      });
      // Reset form
      setFormData({
        description: "",
        priority: "Medium",
      });
    }
    if (onClose) onClose();
  }, [formData, onAdd, onClose]);

  const resetForm = useCallback(() => {
    setFormData({
      description: "",
      priority: "Medium",
    });
  }, []);

  return {
    formData,
    updateDescription,
    updatePriority,
    handleAdd,
    resetForm
  };
}
