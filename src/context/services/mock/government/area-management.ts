import { HEATMAP_AREAS, HeatmapArea } from "./dashboard";

export type AreaManager = {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string;
};

export interface ManagedArea extends HeatmapArea {
  manager: AreaManager;
  population: number;
  lastUpdate: string;
  status: "active" | "maintenance" | "inactive";
  // New fields for the design
  adminUnit: string;
  type: "District" | "Ward";
  hotspotCount: number;
  boundary: string;
  center?: [number, number];
  radius?: number;
}

export const AREA_MANAGERS: AreaManager[] = [
  { id: 1, name: "Nguyễn Văn A", phone: "0901234567", email: "a.nguyen@swtis.vn", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Trần Thị B", phone: "0909876543", email: "b.tran@swtis.vn", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Lê Văn C", phone: "0912345678", email: "c.le@swtis.vn", avatar: "https://i.pravatar.cc/150?u=3" },
];

export const MANAGED_AREAS: ManagedArea[] = HEATMAP_AREAS.map((area, index) => {
  return {
    ...area,
    manager: AREA_MANAGERS[index % AREA_MANAGERS.length],
    population: 150000 + index * 50000,
    lastUpdate: new Date().toISOString(),
    status: index === 3 ? "maintenance" : "active",
    adminUnit: "TP.HCM",
    type: index % 2 === 0 ? "District" : "Ward",
    hotspotCount: Math.floor(Math.random() * 10),
    boundary: `Circle ${String.fromCharCode(65 + index)}`,
    center: [area.lng, area.lat],
    radius: 2.5 + (index % 3), // km
  };
});
