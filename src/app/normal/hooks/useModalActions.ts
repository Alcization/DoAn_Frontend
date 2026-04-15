import { useCallback } from "react";

export const useModalActions = () => {
  const handleAdd = useCallback((onAdd: any, data: any, onClose: () => void) => {
    if (data) {
      onAdd?.(data);
      onClose();
    }
  }, []);

  const handleSave = useCallback((onSave: any, id: number, data: any, onClose: () => void) => {
    if (data) {
      onSave(
        id,
        data.name,
        data.address,
        data.lat,
        data.lng,
        data.destination?.address,
        data.destination?.lat,
        data.destination?.lng
      );
      onClose();
    }
  }, []);

  const handleDelete = useCallback((onConfirm: any, id: number, onClose: () => void) => {
    onConfirm(id);
    onClose();
  }, []);

  return {
    handleAdd,
    handleSave,
    handleDelete
  };
};
