import { useTranslation } from "react-i18next";
import { Calendar, MapPin } from "lucide-react";
import { Incident } from "../../../context/services/mock/government/history-incidents";
import dynamic from "next/dynamic";
import { usePagination } from "../../normal/hooks/usePagination";
import Pagination from "./Pagination";
import { HistoryItemFactory } from "./history-logic/HistoryItemFactory";
import { ViewMode } from "./history-logic/HistoryTypes";

// Dynamically import the map component to avoid SSR issues with Leaflet
const IncidentMap = dynamic(() => import("./IncidentMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-(--color-text-muted)">
      Loading map...
    </div>
  ),
});

interface HistoryListProps {
  incidents: Incident[];
  selectedId: number | null;
  onSelect: (incident: Incident) => void;
  viewMode: ViewMode;
  loading?: boolean;
}

/**
 * [FACADE PATTERN] - HistoryList: Manages list/map views and delegates item rendering to a Factory.
 */
export default function HistoryList({ incidents, selectedId, onSelect, viewMode, loading = false }: HistoryListProps) {
  const { t } = useTranslation();
  const { currentItems, currentPage, totalPages, nextPage, prevPage, goToPage } = 
    usePagination(incidents, 5);

  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm overflow-hidden flex flex-col h-full">
        <div className="border-b border-(--color-border) px-6 py-4 text-(--color-text-secondary) flex items-center justify-between">
        {viewMode === "list" ? (
            <>
            <Calendar size={16} className="text-(--color-primary)" />
            {incidents.length} {t("alertHistory.list.found")}
            </>
        ) : (
            <>
            <MapPin size={16} className="text-(--color-primary)" />
            {t("alertHistory.list.mapView")}: {incidents.length}
            </>
        )}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-(--color-primary)"></div>
            <span className="text-(--text-xs) text-(--color-text-muted)">Loading...</span>
          </div>
        )}
        </div>
        
        {viewMode === "list" ? (
        <>
            <div className="divide-y divide-(--color-border) overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary) mx-auto mb-4"></div>
                  <p className="text-(--color-text-secondary)">{t("common.loading", "Loading alerts...")}</p>
                </div>
              </div>
            ) : (
                <>
                  {currentItems.map((incident) => 
                    HistoryItemFactory.createItem(incident, selectedId, onSelect, t)
                  )}
                </>
            )}
            </div>
            {!loading && (
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrev={prevPage}
            />
            )}
        </>
        ) : (
        <div className="h-full bg-(--color-bg) relative overflow-hidden">
            <IncidentMap 
              incidents={incidents}
              selectedId={selectedId}
              onSelect={onSelect}
            />
        </div>
        )}
    </div>
  );
}
