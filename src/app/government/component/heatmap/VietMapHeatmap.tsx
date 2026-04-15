"use client";

import { useEffect, useRef, useMemo } from "react";
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";
import * as turf from "@turf/turf";
import { HeatmapArea } from "../../hooks/useDashboard";
import { GeoJSONBuilder } from "./logic/GeoJSONBuilder";
import { useTranslation } from "react-i18next";
import { Focus } from "lucide-react";

interface VietMapHeatmapProps {
  heatmapData: HeatmapArea[];
  selectedArea: HeatmapArea | null;
  onSelectArea: (area: HeatmapArea | null) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_MAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY || "your-apikey";
const MAP_STYLE = `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${API_KEY}`;

export default function VietMapHeatmap({ heatmapData, selectedArea, onSelectArea }: VietMapHeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { t } = useTranslation();

  const onSelectAreaRef = useRef(onSelectArea);

  useEffect(() => {
    onSelectAreaRef.current = onSelectArea;
  }, [onSelectArea]);

  const geoData = useMemo(() => {
    const builder = new GeoJSONBuilder();
    heatmapData.forEach(area => builder.addCircularArea(area, selectedArea?.id === area.id));
    return builder.build();
  }, [heatmapData, selectedArea]);

  // Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const map = new vietmapgl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        center: [106.660172, 10.762622],
        zoom: 10,
        maxPitch: 85,
      });

      map.on("load", () => {
        map.addSource("heatmap-source", { type: "geojson", data: geoData });

        map.addLayer({
          id: "heatmap-fill",
          type: "fill",
          source: "heatmap-source",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": ["case", ["boolean", ["get", "isSelected"], false], 0.5, 0.25],
          },
        });

        map.addLayer({
          id: "heatmap-outline",
          type: "line",
          source: "heatmap-source",
          paint: {
            "line-color": ["get", "color"],
            "line-width": ["case", ["boolean", ["get", "isSelected"], false], 4, 2],
            "line-opacity": 0.8,
          },
        });

        map.on("click", "heatmap-fill", (e: any) => {
          const feature = e.features?.[0];
          if (feature) onSelectAreaRef.current(feature.properties);
        });

        map.on("mouseenter", "heatmap-fill", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "heatmap-fill", () => { map.getCanvas().style.cursor = ""; });

        // fitBounds is now handled by the Sync Selection View effect
        map.resize();
      });

      map.addControl(new vietmapgl.NavigationControl(), "top-right");
      mapRef.current = map;
    } catch (err) {
      console.error("Map init error:", err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Data Updates
  useEffect(() => {
    if (mapRef.current?.isStyleLoaded()) {
      const source = mapRef.current.getSource("heatmap-source");
      if (source) (source as any).setData(geoData);
    }
  }, [geoData]);

  // Sync Selection View
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (selectedArea) {
      map.flyTo({
        center: [selectedArea.lng, selectedArea.lat],
        zoom: 12,
        duration: 1000,
      });
    } else if (heatmapData.length > 0) {
      // Fit all if none selected (behavior for "show all polygons" or initial load)
      const bounds = turf.bbox(geoData) as [number, number, number, number];
      map.fitBounds(bounds, { padding: 40, duration: 1000 });
    }
  }, [selectedArea, heatmapData, geoData]);

  const handleZoomToBound = () => {
    console.log("VietMapHeatmap: Zoom to bounds triggered");
    if (mapRef.current && heatmapData.length > 0) {
      const bounds = turf.bbox(geoData) as [number, number, number, number];
      mapRef.current.fitBounds(bounds, { padding: 60, duration: 1000 });
    } else {
      console.warn("VietMapHeatmap: Zoom failed - map or data is missing");
    }
  };

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Zoom to bound button - Styled to match VietMap native controls */}
      <div className="absolute top-[124px] right-[10px] z-10 flex flex-col gap-2">
        <div className="bg-white rounded-[4px] shadow-[0_0_0_2px_rgba(0,0,0,0.1)] overflow-hidden">
          <button
            onClick={handleZoomToBound}
            className="w-[29px] h-[29px] flex items-center justify-center bg-white hover:bg-[#f2f2f2] text-[#333] transition-colors"
            title={t("dashboard.map.zoomToBound") || "Zoom to all alert areas"}
          >
            <Focus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
