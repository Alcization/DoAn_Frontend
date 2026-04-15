export type AreaType = "District" | "Ward";
export type AreaApiType = "Quận" | "Phường";

export interface AreaApiModel {
  area_id: number;
  officer_id: number;
  name: string;
  area_type: AreaApiType;
  address: string;
  boundary_polygon: unknown | null;
  management_area: {
    center: {
      lat: number;
      lng: number;
    };
    radius_km: number;
  };
  hot_points: number;
}

export interface ManagedArea {
  id: number;
  areaId: number;
  officerId: number;
  name: string;
  type: AreaType;
  address: string;
  adminUnit: string;
  center: [number, number] | null;
  radius: number;
  hotspotCount: number;
  boundary: string;
  status: "active" | "inactive";
}

export interface AreaMutationPayload {
  name: string;
  area_type: AreaApiType;
  address: string;
  management_area: {
    center: {
      lat: number;
      lng: number;
    };
    radius_km: number;
  };
}

export interface AreaTableState {
  isQuickAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  selectedArea: ManagedArea | null;
}
