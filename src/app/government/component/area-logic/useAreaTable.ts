import { useState, useCallback, useEffect } from "react";
import { usePagination } from "../../../normal/hooks/usePagination";
import { AreaApiModel, AreaMutationPayload, ManagedArea, AreaTableState } from "./AreaTableTypes";
import { API_BASE_URL } from "@/services/api-config";

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (typeof window === "undefined") {
    return headers;
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const mapApiTypeToUiType = (areaType: AreaApiModel["area_type"]): ManagedArea["type"] => {
  return areaType === "Quận" ? "District" : "Ward";
};

const mapAreaApiToManagedArea = (area: AreaApiModel): ManagedArea => {
  const radius = area.management_area?.radius_km ?? 0;
  const centerLng = area.management_area?.center?.lng;
  const centerLat = area.management_area?.center?.lat;

  return {
    id: area.area_id,
    areaId: area.area_id,
    officerId: area.officer_id,
    name: area.name,
    type: mapApiTypeToUiType(area.area_type),
    address: area.address,
    adminUnit: area.address,
    center: typeof centerLng === "number" && typeof centerLat === "number" ? [centerLng, centerLat] : null,
    radius,
    hotspotCount: area.hot_points ?? 0,
    boundary: radius > 0 ? `${radius.toFixed(1)} km` : "-",
    status: "active",
  };
};

const parseErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // keep fallback
  }
  return fallbackMessage;
};

/**
 * [FACADE PATTERN] - useAreaTable: Centralizes logic for the AreaTable component.
 */
export function useAreaTable() {
  const [areas, setAreas] = useState<ManagedArea[]>([]);
  const [state, setState] = useState<AreaTableState>({
    isQuickAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    selectedArea: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination(areas, 8);

  const fetchAreas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/areas`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to fetch areas"));
      }

      const data = (await response.json()) as AreaApiModel[];
      setAreas(Array.isArray(data) ? data.map(mapAreaApiToManagedArea) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while loading areas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const toggleModal = useCallback((modal: keyof Omit<AreaTableState, "selectedArea">, isOpen: boolean, area: ManagedArea | null = null) => {
    setState(prev => ({
      ...prev,
      [modal]: isOpen,
      selectedArea: area || (isOpen ? prev.selectedArea : null),
    }));
  }, []);

  const handleCreate = useCallback(async (payload: AreaMutationPayload) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/areas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to create area"));
      }

      const createdArea = (await response.json()) as AreaApiModel;
      setAreas((prev) => [mapAreaApiToManagedArea(createdArea), ...prev]);
      toggleModal("isQuickAddOpen", false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create area");
    }
  }, [toggleModal]);

  const handleEditSave = useCallback(async (payload: AreaMutationPayload, selectedArea: ManagedArea) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/areas/${selectedArea.areaId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to update area"));
      }

      const updatedArea = (await response.json()) as AreaApiModel;
      const mapped = mapAreaApiToManagedArea(updatedArea);

      setAreas((prev) => prev.map((item) => (item.areaId === mapped.areaId ? mapped : item)));
      toggleModal("isEditOpen", false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update area");
    }
  }, [toggleModal]);

  const handleDeleteConfirm = useCallback(async (areaId: number) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/areas/${areaId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Failed to delete area"));
      }

      setAreas((prev) => prev.filter((item) => item.areaId !== areaId));
      toggleModal("isDeleteOpen", false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete area");
    }
  }, [toggleModal]);

  return {
    ...state,
    ...pagination,
    isLoading,
    error,
    fetchAreas,
    toggleModal,
    handleCreate,
    handleEditSave,
    handleDeleteConfirm,
  };
}
