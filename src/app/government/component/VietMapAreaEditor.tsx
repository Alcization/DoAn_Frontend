"use client";

import { useEffect, useRef, useMemo } from "react";
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";
import * as turf from "@turf/turf";
import { Trash2, MapPin, Focus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VietMapAreaEditorProps {
  center: [number, number] | null;
  radius: number; // in km
  onChange: (center: [number, number] | null, radius: number) => void;
  mapCenter?: [number, number];
  zoom?: number;
}

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_MAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY || "your-apikey";
const MAP_STYLE = `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${API_KEY}`;

export default function VietMapAreaEditor({ 
  center, 
  radius, 
  onChange, 
  mapCenter = [106.660172, 10.762622], 
  zoom = 12 
}: VietMapAreaEditorProps) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const centerRef = useRef(center);
  const radiusRef = useRef(radius);

  useEffect(() => {
    centerRef.current = center;
    radiusRef.current = radius;
  }, [center, radius]);

  // Generate GeoJSON for the circle and center point
  const geojson = useMemo(() => {
    const features: any[] = [];

    if (center) {
      // Center Point
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: center },
        properties: { isCenter: true }
      });

      // Circle Polygon
      const circle = turf.circle(center, radius || 0.1, {
        steps: 64,
        units: "kilometers",
        properties: { isCircle: true }
      });
      features.push(circle);
    }

    return {
      type: "FeatureCollection" as const,
      features
    };
  }, [center, radius]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new vietmapgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: center || mapCenter,
      zoom: center ? 14 : zoom,
    });

    map.on("load", () => {
      map.addSource("area-boundary", {
        type: "geojson",
        data: geojson
      });

      // Circle Fill
      map.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "area-boundary",
        filter: ["has", "isCircle"],
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.2
        }
      });

      // Circle Outline
      map.addLayer({
        id: "circle-outline",
        type: "line",
        source: "area-boundary",
        filter: ["has", "isCircle"],
        paint: {
          "line-color": "#3b82f6",
          "line-width": 3,
        }
      });

      // Center Marker
      map.addLayer({
        id: "center-point",
        type: "circle",
        source: "area-boundary",
        filter: ["has", "isCenter"],
        paint: {
          "circle-radius": 8,
          "circle-color": "#3b82f6",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff"
        }
      });

      // Click to set center
      map.on("click", (e: any) => {
        const { lng, lat } = e.lngLat;
        onChange([lng, lat], radiusRef.current);
      });

      map.getCanvas().style.cursor = "crosshair";
    });

    map.addControl(new vietmapgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync GeoJSON updates
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded()) {
      const source = map.getSource("area-boundary");
      if (source) {
        (source as any).setData(geojson);
      }
    }
  }, [geojson]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, radius);
  };

  const handleZoomToBound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const map = mapRef.current;
    if (map && map.isStyleLoaded() && center) {
      try {
        const bounds = turf.bbox(geojson) as [number, number, number, number];
        map.fitBounds(bounds, {
          padding: 60,
          duration: 1000,
          maxZoom: 16
        });
      } catch (err) {
        console.error("Zoom to bounds error:", err);
        map.flyTo({ center, zoom: 14 });
      }
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden border border-(--color-border)">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button 
          onClick={handleZoomToBound}
          disabled={!center}
          className="p-2.5 rounded-xl bg-(--color-surface) border border-(--color-border) text-(--color-primary) shadow-lg hover:bg-(--color-primary-bg) transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs font-medium"
          title={t("dashboard.map.zoomToBound")}
        >
          <Focus size={16} /> {t("dashboard.map.zoomToBound")}
        </button>

        <button 
          onClick={handleClear}
          disabled={!center}
          className="p-2.5 rounded-xl bg-(--color-surface) border border-(--color-border) text-(--color-danger) shadow-lg hover:bg-(--color-danger-bg) transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs font-medium"
        >
          <Trash2 size={16} /> {t("areaManagement.editor.clearCenter")}
        </button>
      </div>

      {/* Tip Overlay */}
      <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold pointer-events-none flex items-center gap-2">
        <MapPin size={12} className="text-blue-400" />
        {!center ? t("areaManagement.editor.clickToSet") : t("areaManagement.editor.clickToMove")}
      </div>
    </div>
  );
}
