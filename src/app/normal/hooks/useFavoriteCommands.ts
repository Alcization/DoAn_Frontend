"use client";

import { useState, useCallback } from "react";

/**
 * Favorite Action Commands (Command Pattern)
 */
export interface FavoriteCommand {
  execute(item: any): void;
}

export function useFavoriteCommands(options: {
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAlert: (item: any) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [modals, setModals] = useState({
    edit: false,
    delete: false,
    alert: false
  });

  const openEdit = useCallback((item: any) => {
    setSelectedItem(item);
    setModals(prev => ({ ...prev, edit: true }));
  }, []);

  const openDelete = useCallback((item: any) => {
    setSelectedItem(item);
    setModals(prev => ({ ...prev, delete: true }));
  }, []);

  const openAlert = useCallback((item: any) => {
    setSelectedItem(item);
    setModals(prev => ({ ...prev, alert: true }));
  }, []);

  const closeAll = useCallback(() => {
    setModals({ edit: false, delete: false, alert: false });
  }, []);

  return {
    selectedItem,
    modals,
    commands: {
      edit: openEdit,
      delete: openDelete,
      alert: openAlert
    },
    closeAll
  };
}
