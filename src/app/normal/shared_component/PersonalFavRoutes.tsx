"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditLocationModal from "../modal/EditLocationModal";
import SetAlertModal from "../modal/SetAlertModal";
import DeleteLocationModal from "../modal/DeleteLocationModal";
import { API_BASE_URL } from "@/services/api-config";
import { usePagination } from "../hooks/usePagination";

// Design Pattern Infrastructure
import { useFavoriteCommands } from "../hooks/useFavoriteCommands";
import { FavoriteItem, RouteItemRenderer } from "./FavoriteItemFactory";

interface Route {
  id: number;
  name: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number;
}

interface PersonalFavoriteRoutesProps {
  maxRoutes?: number;
}

export default function PersonalFavoriteRoutes({
  maxRoutes = 5,
}: PersonalFavoriteRoutesProps) {
  const { t } = useTranslation();
  
  // States quản lý dữ liệu từ API
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. GET: Lấy danh sách tuyến đường đã lưu
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Vui lòng đăng nhập để xem tuyến đường đã lưu.");

        const response = await fetch(`${API_BASE_URL}/routes`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Không thể tải danh sách tuyến đường.");

        const result = await response.json();
        
        if (result.success && result.data) {
          const mappedRoutes: Route[] = result.data.map((item: any) => ({
            id: item.route_id,
            name: item.name,
            origin: {
              address: item.start_address,
              lat: item.start_point.lat,
              lng: item.start_point.lng
            },
            destination: {
              address: item.end_address,
              lat: item.end_point.lat,
              lng: item.end_point.lng
            },
            distance: item.distance || 0
          }));
          setRoutes(mappedRoutes);
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // 2. PUT: Cập nhật tuyến đường
  const updateRouteAPI = async (
    id: number, 
    name: string, 
    originAddr: string, 
    originLat?: number, 
    originLng?: number, 
    destAddr?: string, 
    destLat?: number, 
    destLng?: number
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/routes/favorites/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          start_point: { lat: originLat || 0, lng: originLng || 0 },
          end_point: { lat: destLat || 0, lng: destLng || 0 },
          start_address: originAddr,
          end_address: destAddr,
        })
      });

      const result = await response.json();
      if (result.success) {
        setRoutes((prev) => 
          prev.map((r) => r.id === id ? { 
            ...r, 
            name, 
            origin: { address: originAddr, lat: originLat || r.origin.lat, lng: originLng || r.origin.lng },
            destination: { address: destAddr || r.destination.address, lat: destLat || r.destination.lat, lng: destLng || r.destination.lng }
          } : r)
        );
      } else {
        alert("Không thể cập nhật tuyến đường.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tuyến đường:", error);
    }
  };

  // 3. DELETE: Xoá tuyến đường
  const deleteRouteAPI = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/routes/favorites/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const result = await response.json();
      if (result.success) {
        setRoutes((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("Không thể xoá tuyến đường.");
      }
    } catch (error) {
      console.error("Lỗi khi xoá tuyến đường:", error);
    }
  };

  // Pagination hook
  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(routes, 10);

  const startIndex = (currentPage - 1) * 10;

  // Command Pattern (Modal / Action management)
  const { selectedItem, modals, commands, closeAll } = useFavoriteCommands({
    onEdit: (route) => console.log("Mở modal sửa cho:", route.name),
    onDelete: (route) => console.log("Mở modal xoá cho:", route.name),
    onAlert: (route) => console.log("Mở modal cảnh báo cho:", route.name)
  });

  // Abstract Factory Renderer (Bridge Pattern)
  const renderer = useMemo(() => new RouteItemRenderer(), []);

  // Drag & Drop
  const handleDrop = (index: number, draggedIndex: number) => {
    if (draggedIndex === null) return;
    const newItems = [...routes];
    const item = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, item);
    
    setRoutes(newItems);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-[var(--color-text-secondary)]">Đang tải danh sách tuyến đường...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-[var(--color-danger)]">{error}</div>;
  }

  return (
    <>
      <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] flex flex-col gap-3 border border-[var(--color-border)]">
        {currentItems.length === 0 ? (
          <p className="text-center text-[var(--color-text-muted)] py-8">
            {t("personalPage.empty")}
          </p>
        ) : (
          currentItems.map((route, index) => (
            <FavoriteItem
              key={`route-${route.id}`}
              item={route}
              index={startIndex + index}
              renderer={renderer}
              commands={commands}
              onDragStart={(idx: number) => (window as any)._draggedIdx = idx}
              onDragOver={(e: any) => e.preventDefault()}
              onDrop={(e: any, idx: number) => handleDrop(idx, (window as any)._draggedIdx)}
            />
          ))
        )}
        {routes.length >= maxRoutes && (
          <p className="text-[var(--text-xs)] text-[var(--color-warning)] text-center mt-2">
            {t("personalPage.limit", { max: maxRoutes })}
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-xl font-bold transition-all text-xs ${
                    currentPage === page
                      ? "bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditLocationModal
        isOpen={modals.edit}
        onClose={closeAll}
        mode="business"
        //@ts-ignore
        location={selectedItem}
        onSave={(id, name, originAddr, originLat, originLng, destAddr, destLat, destLng) => {
          updateRouteAPI(id, name, originAddr, originLat, originLng, destAddr, destLat, destLng);
          closeAll();
        }}
      />
      <SetAlertModal
        isOpen={modals.alert}
        onClose={closeAll}
        //@ts-ignore
        location={selectedItem}
        onSave={() => closeAll()}
      />
      <DeleteLocationModal
        isOpen={modals.delete}
        onClose={closeAll}
        //@ts-ignore
        location={selectedItem}
        onConfirm={(id) => {
          deleteRouteAPI(id);
          closeAll();
        }}
      />
    </>
  );
}