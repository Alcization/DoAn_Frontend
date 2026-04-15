import { useState, useCallback, useEffect } from "react";
import { AreaMutationPayload, AreaType, ManagedArea } from "../component/area-logic/AreaTableTypes";

/**
 * [FACADE PATTERN] - useAreaManagement: Centralizes logic for Area-related modals.
 */
export function useAreaManagement(initialArea: ManagedArea | null = null) {
  const [area, setArea] = useState<ManagedArea | null>(initialArea);
  const [center, setCenter] = useState<[number, number] | null>(initialArea?.center || null);
  const [radius, setRadius] = useState<number>(initialArea?.radius || 2.5);
  const [formData, setFormData] = useState({
    name: initialArea?.name || "",
    adminUnit: initialArea?.address || "",
    type: (initialArea?.type || "Ward") as AreaType,
  });

  useEffect(() => {
    setArea(initialArea);
    setCenter(initialArea?.center || null);
    setRadius(initialArea?.radius || 2.5);
    setFormData({
      name: initialArea?.name || "",
      adminUnit: initialArea?.address || "",
      type: (initialArea?.type || "Ward") as AreaType,
    });
  }, [initialArea]);

  const handleUpdateField = useCallback((field: "name" | "adminUnit" | "type", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async (onSave?: (payload: AreaMutationPayload, area: ManagedArea | null) => Promise<void> | void) => {
    if (onSave && center) {
      const payload: AreaMutationPayload = {
        name: formData.name.trim(),
        area_type: formData.type === "District" ? "Quận" : "Phường",
        address: formData.adminUnit.trim(),
        management_area: {
          center: {
            lat: center[1],
            lng: center[0],
          },
          radius_km: radius,
        },
      };
      await onSave(payload, area);
    }
  }, [area, formData, center, radius]);

  const handleConfirmDelete = useCallback(async (onConfirm?: (id: number) => Promise<void> | void) => {
    if (onConfirm && area) {
      await onConfirm(area.areaId);
    }
  }, [area]);

  const isFormValid = Boolean(center && formData.name.trim() && formData.adminUnit.trim() && radius > 0);

  return {
    area,
    center,
    radius,
    formData,
    setCenter,
    setRadius,
    handleUpdateField,
    handleSave,
    handleConfirmDelete,
    isFormValid,
  };
}
