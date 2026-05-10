"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import EditLocationModal from "../modal/EditLocationModal";
import SetAlertModal from "../modal/SetAlertModal";
import DeleteLocationModal from "../modal/DeleteLocationModal";
import { useFavoriteCommands } from "../hooks/useFavoriteCommands";
import { FavoriteItem, LocationItemRenderer } from "./FavoriteItemFactory";
import { API_BASE_URL } from "@/services/api-config";

// Interface khớp với dữ liệu API
export interface Location {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  temp?: number;
  weather?: string;
}

// Lược bỏ locations, onReorder, onDelete vì Component tự quản lý Fetch API
interface PersonalFavoriteLocationsProps {
  maxLocations?: number;
}

export default function PersonalFavoriteLocations({
  maxLocations = 5,
}: PersonalFavoriteLocationsProps) {
  const { t } = useTranslation();
  
  // States quản lý dữ liệu từ API
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. GET: Lấy danh sách địa điểm đã lưu
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Vui lòng đăng nhập để xem địa điểm đã lưu.");

        const response = await fetch(`${API_BASE_URL}/routes/locations`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Không thể tải danh sách địa điểm.");

        const result = await response.json();
        
        if (result.success && result.data) {
          const mappedLocations: Location[] = result.data.map((item: any) => ({
            id: item.location_id,
            name: item.custom_name,
            address: item.address,
            lat: item.latitude,
            lng: item.longitude,
            temp: 0, // Mock: Chờ API thời tiết
            weather: "sunny" // Mock: Chờ API thời tiết
          }));
          setLocations(mappedLocations);
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // 2. PUT: Cập nhật địa điểm
  const updateLocationAPI = async (id: number, name: string, address: string, lat?: number, lng?: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/routes/locations/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          custom_name: name,
          address: address,
          latitude: lat,
          longitude: lng
        })
      });

      const result = await response.json();
      if (result.success) {
        setLocations((prev) => 
          prev.map((loc) => loc.id === id ? { ...loc, name, address, lat: lat || loc.lat, lng: lng || loc.lng } : loc)
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật địa điểm:", error);
    }
  };

  // 3. DELETE: Xoá địa điểm
  const deleteLocationAPI = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/routes/locations/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const result = await response.json();
      if (result.success) {
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      }
    } catch (error) {
      console.error("Lỗi khi xoá địa điểm:", error);
    }
  };

  // Command Pattern (Modal / Action management)
  const { selectedItem, modals, commands, closeAll } = useFavoriteCommands({
    onEdit: (loc) => console.log("Mở modal sửa cho:", loc.name),
    onDelete: (loc) => console.log("Mở modal xoá cho:", loc.name),
    onAlert: (loc) => console.log("Mở modal cảnh báo cho:", loc.name)
  });

  // Abstract Factory Renderer (Bridge Pattern)
  const renderer = useMemo(() => new LocationItemRenderer(), []);

  // Drag & Drop
  const handleDrop = (index: number, draggedIndex: number, setDraggedIndex: any) => {
    if (draggedIndex === null) return;
    const newItems = [...locations];
    const item = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, item);
    
    setLocations(newItems); // Cập nhật state local
    // TODO: Nối API để lưu lại thứ tự mới nếu backend có hỗ trợ
    
    setDraggedIndex(null);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-[var(--color-text-secondary)]">Đang tải danh sách...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-[var(--color-danger)]">{error}</div>;
  }

  return (
    <>
      <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] flex flex-col gap-3 border border-[var(--color-border)]">
        {locations.length === 0 ? (
          <p className="text-center text-[var(--color-text-muted)] py-8">
            {t("personalPage.empty")}
          </p>
        ) : (
          locations.map((loc, index) => (
            <FavoriteItem
              key={`personal-${loc.id}`}
              item={loc}
              index={index}
              renderer={renderer}
              commands={commands}
              onDragStart={(idx: number) => (window as any)._draggedIdx = idx}
              onDragOver={(e: any) => e.preventDefault()}
              onDrop={(e: any, idx: number) => handleDrop(idx, (window as any)._draggedIdx, () => {})}
            />
          ))
        )}
        {locations.length >= maxLocations && (
          <p className="text-[var(--text-xs)] text-[var(--color-warning)] text-center mt-2">
            {t("personalPage.limit", { max: maxLocations })}
          </p>
        )}
      </div>

      <EditLocationModal
        isOpen={modals.edit}
        onClose={closeAll}
        location={selectedItem}
        onSave={(id, name, address, lat, lng) => {
          updateLocationAPI(id, name, address, lat, lng);
          closeAll();
        }}
      />
      <SetAlertModal
        isOpen={modals.alert}
        onClose={closeAll}
        location={selectedItem}
        onSave={() => {
          closeAll();
        }}
      />
      <DeleteLocationModal
        isOpen={modals.delete}
        onClose={closeAll}
        location={selectedItem}
        onConfirm={(id) => {
          deleteLocationAPI(id);
          closeAll();
        }}
      />
    </>
  );
}