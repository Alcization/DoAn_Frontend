"use client";

import { useTheme } from "../../../context/theme/ThemeContext";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { Incident } from "../../../context/services/mock/government/history-incidents";
import { useTranslation } from "react-i18next";
import { Clock, MapPin } from "lucide-react";

// Vietmap keys
const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_MAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY || "your-apikey";
const VIETMAP_LIGHT = `https://maps.vietmap.vn/maps/styles/lm/style.json?apikey=${API_KEY}`;
const VIETMAP_DARK = `https://maps.vietmap.vn/maps/styles/dm/style.json?apikey=${API_KEY}`;

type IncidentMapProps = {
  incidents: Incident[];
  selectedId: number | null;
  onSelect: (incident: Incident) => void;
};

// Helper function to generate mock coordinates for incidents based on area
const getCoordinatesForArea = (area: string, index: number): [number, number] => {
  const baseCoordinates: Record<string, [number, number]> = {
    "Quận 1": [106.7009, 10.7769], // Lng, Lat
    "Quận 7": [106.7197, 10.7333],
    "Nhà Bè": [106.7333, 10.6833],
    "Quận 3": [106.6917, 10.7860],
    "Bình Thạnh": [106.7072, 10.8142],
  };
  
  const base = baseCoordinates[area] || [106.6297, 10.8231]; // Default to HCM center
  // Add slight offset to prevent markers from overlapping
  const offset = index * 0.005;
  return [base[0] + offset, base[1] + offset];
};

export default function IncidentMap({ incidents, selectedId, onSelect }: IncidentMapProps) {
  const { theme } = useTheme();
  const mapStyle = theme === "dark" ? VIETMAP_DARK : VIETMAP_LIGHT;
  
  const initialViewState = {
    longitude: 106.6297,
    latitude: 10.8231,
    zoom: 12
  };
  
  const { t } = useTranslation();
  const mapRef = useRef<any>(null);
  const [popupInfo, setPopupInfo] = useState<Incident | null>(null);

  useEffect(() => {
    if (selectedId && mapRef.current) {
      const incident = incidents.find(i => i.id === selectedId);
      if (incident) {
        const index = incidents.indexOf(incident);
        const coords = getCoordinatesForArea(incident.area, index);
        mapRef.current.getMap().flyTo({ center: coords, zoom: 14 });
      }
    }
  }, [selectedId, incidents]);

  // Handle open popup when selectedId changes externally
  useEffect(() => {
    if (selectedId) {
      const incident = incidents.find(i => i.id === selectedId);
      if (incident) {
        setPopupInfo(incident);
      }
    } else {
      setPopupInfo(null);
    }
  }, [selectedId, incidents]);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
        case 'High': return 'text-[var(--color-danger)]';
        case 'Medium': return 'text-[var(--color-warning)]';
        default: return 'text-[var(--color-success)]';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch(severity) {
        case 'High': return 'bg-[var(--color-danger)]';
        case 'Medium': return 'bg-[var(--color-warning)]';
        default: return 'bg-[var(--color-success)]';
    }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Handled': return 'text-[var(--color-success)]';
          default: return 'text-[var(--color-warning)]';
      }
  };

  // Ensure ALL requests to vietmap include the API key
  const transformRequest = useCallback((url: string, resourceType: any) => {
    if (url.includes('vietmap.vn') && !url.includes('apikey=')) {
      return {
        url: url.includes('?') ? `${url}&apikey=${API_KEY}` : `${url}?apikey=${API_KEY}`,
      };
    }
    return { url };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: 'relative', borderRadius: '1rem', overflow: 'hidden' }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapLib={vietmapgl as any}
        transformRequest={transformRequest}
      >
        {incidents.map((incident, index) => {
          const coords = getCoordinatesForArea(incident.area, index);
          return (
            <Marker
              key={`marker-${incident.id}`}
              longitude={coords[0]}
              latitude={coords[1]}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                onSelect(incident);
                setPopupInfo(incident);
              }}
            >
              <div className="cursor-pointer flex flex-col items-center group">
                <div className={`w-6 h-6 rounded-full ${getSeverityBgColor(incident.severity)} border-2 border-white flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110`}>
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${
                  incident.severity === 'High' ? 'border-t-[var(--color-danger)]' : 
                  incident.severity === 'Medium' ? 'border-t-[var(--color-warning)]' : 'border-t-[var(--color-success)]'
                } -mt-[1px]`}></div>
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={getCoordinatesForArea(popupInfo.area, incidents.indexOf(popupInfo))[0]}
            latitude={getCoordinatesForArea(popupInfo.area, incidents.indexOf(popupInfo))[1]}
            offset={20}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="min-w-[200px] text-[var(--color-text-primary)]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                <strong className="text-base">{popupInfo.location}</strong>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <Clock size={12} />
                  <span>{popupInfo.time}</span>
                </div>
                
                <div className="text-[var(--color-text-secondary)]">
                  {t("alertHistory.detail.area")}: {popupInfo.area}
                </div>
                
                <div className="text-[var(--color-text-secondary)]">
                  {t("alertHistory.detail.type")}: {t(`alertHistory.type.${popupInfo.type}`)}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-secondary)]">
                    {t("alertHistory.severity.High").split(' ')[0]}:
                  </span>
                  <span className={`font-semibold ${getSeverityColor(popupInfo.severity)}`}>
                    {t(`alertHistory.severity.${popupInfo.severity}`)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-secondary)]">
                    Status:
                  </span>
                  <span className={`font-semibold ${getStatusColor(popupInfo.status)}`}>
                    {t(`alertHistory.status.${popupInfo.status}`)}
                  </span>
                </div>
                
                <p className="mt-2 pt-2 border-t border-[var(--color-border)]">
                  {popupInfo.description}
                </p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
