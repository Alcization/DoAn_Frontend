"use client";

import { MapPin, Plus, Eye, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import AddFavoritePlaceModal from "../modal/AddFavoritePlaceModal";
import ViewAllFavoritesModal from "../modal/ViewAllFavoritesModal";
import FavoritePlaceItem from "./FavoritePlaceItem";
import { API_BASE_URL } from "@/services/api-config";

interface FavoritePlacesProps {
  mode: "business" | "personal";
  navMode?: "business" | "personal";
}

// Interface gộp chung cho cả Địa điểm (Personal) và Tuyến đường (Business)
export interface FavoriteItemData {
  id: number;
  name: string;
  address: string; // address cho Personal, start_address cho Business
  lat: number;     // lat cho Personal, start_point.lat cho Business
  lng: number;     // lng cho Personal, start_point.lng cho Business
  isRoute?: boolean; // Cờ nhận biết có phải tuyến đường không
  end_address?: string; // Dành riêng cho Business
}

export default function FavoritePlaces({ mode, navMode }: FavoritePlacesProps) {
  const { t } = useTranslation();
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  
  // API states
  const [locations, setLocations] = useState<FavoriteItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const titleKey = mode === "business" ? "home.favorite.businessTitle" : "home.favorite.personalTitle";

  // Fetch API theo Mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Vui lòng đăng nhập để xem dữ liệu.");

        // Chọn endpoint dựa trên mode
        const endpoint = mode === "business" 
          ? `${API_BASE_URL}/routes`
          : `${API_BASE_URL}/routes/locations`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Không thể tải danh sách dữ liệu.");

        const result = await response.json();
        
        if (result.success && result.data) {
          if (mode === "business") {
            // Map dữ liệu Tuyến đường
            const mappedRoutes: FavoriteItemData[] = result.data.map((item: any) => ({
              id: item.route_id,
              name: item.name,
              address: item.start_address,
              end_address: item.end_address,
              lat: item.start_point.lat, // Lấy tọa độ điểm bắt đầu để lấy thời tiết
              lng: item.start_point.lng,
              isRoute: true
            }));
            setLocations(mappedRoutes);
          } else {
            // Map dữ liệu Địa điểm
            const mappedLocations: FavoriteItemData[] = result.data.map((item: any) => ({
              id: item.location_id,
              name: item.custom_name,
              address: item.address,
              lat: item.latitude,
              lng: item.longitude,
              isRoute: false
            }));
            setLocations(mappedLocations);
          }
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  // Show only top 3 items
  const displayData = locations.slice(0, 3);
  const hasMore = locations.length > 3;

  // POST: Thêm dữ liệu mới (Địa điểm hoặc Tuyến đường)
  const handleAddPlace = async (place: { 
    name: string; 
    address: string; 
    lat?: number; 
    lng?: number;
    destination?: { lat: number; lng: number; address: string };
    distance?: number;
  }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Vui lòng đăng nhập để thêm dữ liệu.");
        return;
      }

      // 1. Nếu là Business Mode (Thêm tuyến đường)
      if (mode === "business") {
        if (!place.destination) {
          alert("Vui lòng chọn đầy đủ điểm đi và điểm đến cho tuyến đường.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/routes`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: place.name,
            start_point: { lat: place.lat || 0, lng: place.lng || 0 },
            end_point: { lat: place.destination.lat, lng: place.destination.lng },
            start_address: place.address,
            end_address: place.destination.address,
            distance: Number(place.distance?.toFixed(2)) || 0, // Truyền distance lên (làm tròn 2 chữ số)
            waypoints: [] // Option: Hiện tại API cần một mảng rỗng nếu không có điểm trung gian
          })
        });

        const result = await response.json();
        if (result.success && result.data) {
          const newRoute: FavoriteItemData = {
            id: result.data.route_id,
            name: result.data.name,
            address: result.data.start_address,
            end_address: result.data.end_address,
            lat: result.data.start_point.lat,
            lng: result.data.start_point.lng,
            isRoute: true
          };
          setLocations((prev) => [newRoute, ...prev]);
          setIsAddModalOpen(false);
        } else {
          alert(result.message || "Không thể thêm tuyến đường.");
        }
      }
      // 2. Nếu là Personal Mode (Thêm địa điểm)
      else {
        const response = await fetch(`${API_BASE_URL}/routes/locations`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            custom_name: place.name,
            address: place.address,
            latitude: place.lat || 0, 
            longitude: place.lng || 0
          })
        });

        const result = await response.json();
        if (result.success && result.data) {
          const newLocation: FavoriteItemData = {
            id: result.data.location_id,
            name: result.data.custom_name,
            address: result.data.address,
            lat: result.data.latitude,
            lng: result.data.longitude,
            isRoute: false
          };
          setLocations((prev) => [newLocation, ...prev]);
          setIsAddModalOpen(false);
        } else {
          alert(result.message || "Không thể thêm địa điểm mới.");
        }
      }
    } catch (err) {
      console.error("Lỗi khi thêm dữ liệu:", err);
      alert("Đã xảy ra lỗi khi kết nối với máy chủ.");
    }
  };

  if (isLoading) {
    return (
      <section className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex justify-center items-center min-h-[200px]">
        <span className="text-[var(--color-text-secondary)]">Đang tải danh sách...</span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex justify-center items-center min-h-[200px]">
        <span className="text-[var(--color-danger)]">{error}</span>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="m-0 text-[var(--text-xl)] font-semibold text-[var(--color-text-primary)]">
            {t(titleKey)}
          </h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-[var(--radius-md)] border-none bg-[var(--color-primary)] text-white font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity text-[var(--text-sm)]"
          >
            <Plus size={18} /> {t("home.favorite.add")}
          </button>
        </div>
        
        {locations.length === 0 ? (
          <p className="text-center text-[var(--color-text-muted)] py-6">
            Chưa có {mode === "business" ? "tuyến đường" : "địa điểm"} nào được lưu.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {displayData.map((loc) => (
              <FavoritePlaceItem
                key={loc.id}
                loc={loc}
                mode={mode}
                navMode={navMode}
              />
            ))}
          </div>
        )}
        
        {hasMore && (
          <button
            onClick={() => setIsViewAllModalOpen(true)}
            className="w-full mt-4 px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--color-bg)] transition-colors text-[var(--text-sm)]"
          >
            <Eye size={18} />
            {t("home.favorite.showAll")} ({locations.length})
          </button>
        )}
      </section>

      <AddFavoritePlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode={mode}
        onAdd={handleAddPlace}
      />

      <ViewAllFavoritesModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        mode={mode}
        data={locations}
      />
    </>
  );
}