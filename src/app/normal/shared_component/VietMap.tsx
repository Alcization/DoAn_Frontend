"use client";

import { useTheme } from "../../../context/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useCallback } from "react";
// Import GL JS without .js extension for Next.js compatibility
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";

import { FullscreenControl } from "@/util/fullscreen_control";
import { ZoomToBoundsControl } from "@/util/zoom_to_bounds_control";
import { decodePolyline } from "@/util/polyline";

interface VietMapProps {
  apiKey?: string;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  routeData?: any;
  vizMode?: 'traffic' | 'weather';
  onClick?: (lngLat: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  originCoords?: { lat: number; lng: number } | null;
  destCoords?: { lat: number; lng: number } | null;
  hideViz?: boolean;
  hideZoomToBounds?: boolean;
  onOriginChange?: (lngLat: { lat: number; lng: number }) => void;
  onDestChange?: (lngLat: { lat: number; lng: number }) => void;
  onLocationChange?: (lngLat: { lat: number; lng: number }) => void;
}

// Basic constants
const HCM_CENTER: [number, number] = [106.660172, 10.762622];
const DEFAULT_MAP_ZOOM = 13;

export default function VietMap({
  apiKey = process.env.NEXT_PUBLIC_VIETMAP_MAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY || "your-apikey",
  center = HCM_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  routeData: propRouteData,
  vizMode = 'traffic',
  onClick,
  selectedLocation: propSelectedLocation,
  originCoords: propOriginCoords,
  destCoords: propDestCoords,
  hideViz = false,
  hideZoomToBounds = false,
  onOriginChange,
  onDestChange,
  onLocationChange,
}: VietMapProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  
  // Marker refs for persistence and removal
  const originMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const selectedMarkerRef = useRef<any>(null);
  const currentPosMarkerRef = useRef<any>(null);
  const weatherMarkersRef = useRef<any[]>([]);
  const popupRef = useRef<any>(null);
  // --- State ---
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(propSelectedLocation || null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    time: number;
    bbox?: number[];
    points?: string;
    from?: { lat: number; lng: number };
    to?: { lat: number; lng: number };
  } | null>(null);

  // --- Refs (Synced with state/props) ---
  const vizModeRef = useRef(vizMode);
  const tRef = useRef(t);
  const themeRef = useRef(theme);
  const routeInfoRef = useRef<any>(null);
  const propRouteDataRef = useRef<any>(propRouteData);
  const onClickRef = useRef(onClick);
  const hideVizRef = useRef(hideViz);

  useEffect(() => { vizModeRef.current = vizMode; }, [vizMode]);
  useEffect(() => { tRef.current = t; }, [t]);
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { routeInfoRef.current = routeInfo; }, [routeInfo]);
  useEffect(() => { propRouteDataRef.current = propRouteData; }, [propRouteData]);
  useEffect(() => { onClickRef.current = onClick; }, [onClick]);
  useEffect(() => { hideVizRef.current = hideViz; }, [hideViz]);

  // Sync callbacks to refs to avoid effect re-runs
  const onOriginChangeRef = useRef(onOriginChange);
  const onDestChangeRef = useRef(onDestChange);
  useEffect(() => { onOriginChangeRef.current = onOriginChange; }, [onOriginChange]);
  useEffect(() => { onDestChangeRef.current = onDestChange; }, [onDestChange]);
  
  const onLocationChangeRef = useRef(onLocationChange);
  useEffect(() => { onLocationChangeRef.current = onLocationChange; }, [onLocationChange]);
  
  useEffect(() => {
    if (propSelectedLocation !== undefined) {
      setSelectedLocation(propSelectedLocation);
      if (propSelectedLocation && map) {
        map.flyTo({
          center: [propSelectedLocation.lng, propSelectedLocation.lat],
          zoom: 15,
          duration: 1000
        });
      }
    }
  }, [propSelectedLocation, map]);

  // --- Handlers ---
  const handleZoomToBounds = useCallback(() => {
    console.log("VietMap: Zoom to bounds triggered");
    if (!map) {
      console.warn("VietMap: Zoom failed - map is null");
      return;
    }
    
    const activeRoute = propRouteDataRef.current || (routeInfoRef.current?.points ? {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: decodePolyline(routeInfoRef.current.points) }
    } : null);

    console.log("VietMap: Active route for zoom:", activeRoute);

    let coords: any[] = [];
    if (activeRoute?.type === 'FeatureCollection') {
      activeRoute.features.forEach((f: any) => {
        if (f.geometry.type === 'LineString') coords = [...coords, ...f.geometry.coordinates];
      });
    } else if (activeRoute?.geometry?.type === 'LineString') {
      coords = activeRoute.geometry.coordinates;
    }

    if (coords.length > 0) {
      const bounds = coords.reduce((b: any, c: any) => b.extend(c), new vietmapgl.LngLatBounds(coords[0], coords[0]));
      map.fitBounds(bounds, { padding: 50, duration: 1000 });
      console.log("VietMap: Fitting bounds to", coords.length, "points");
    } else {
      console.warn("VietMap: No route coordinates found to zoom to");
    }
  }, [map]);

  const handleGoToCurrent = useCallback(() => {
    console.log("VietMap: Go to current location triggered");
    if (currentPos && map) {
      map.flyTo({ center: [currentPos.lng, currentPos.lat], zoom: 15, duration: 1000 });
    }
  }, [currentPos, map]);

  const handleZoomRef = useRef(handleZoomToBounds);
  useEffect(() => {
    handleZoomRef.current = handleZoomToBounds;
  }, [handleZoomToBounds]);

  // --- Helpers ---
  const clearMarkers = useCallback(() => {
    [originMarkerRef, destMarkerRef, selectedMarkerRef, currentPosMarkerRef].forEach(ref => {
      if (ref.current) {
        ref.current.remove();
        ref.current = null;
      }
    });
    weatherMarkersRef.current.forEach(m => m.remove());
    weatherMarkersRef.current = [];
  }, []);

  const createMarkerElement = (className: string, text: string = "") => {
    const el = document.createElement('div');
    el.className = className;
    if (text) el.innerText = text;
    return el;
  };

  // --- Effects ---

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.warn("Geolocation failing:", error)
      );
    }
  }, []);

  // --- External Sync Effects ---
  useEffect(() => {
    const handleRouteFound = (event: any) => {
      const data = event.detail;
      if (data?.paths?.[0]) {
        const path = data.paths[0];
        setRouteInfo({
          distance: path.distance,
          time: path.time,
          bbox: path.bbox,
          points: path.points,
          from: data.from,
          to: data.to
        });
      }
    };

    const handleLocationSelected = (event: any) => {
      const { coords } = event.detail;
      if (coords) {
        setSelectedLocation({ lat: coords.lat, lng: coords.lng });
        map?.flyTo({ center: [coords.lng, coords.lat], zoom: 15, duration: 1000 });
      }
    };

    window.addEventListener("vietmap_route_found", handleRouteFound);
    window.addEventListener("vietmap_location_details_found", handleLocationSelected);
    window.addEventListener("vietmap_zoom_to_bounds", handleZoomToBounds);
    window.addEventListener("vietmap_go_to_current", handleGoToCurrent);

    return () => {
      window.removeEventListener("vietmap_route_found", handleRouteFound);
      window.removeEventListener("vietmap_location_details_found", handleLocationSelected);
      window.removeEventListener("vietmap_zoom_to_bounds", handleZoomToBounds);
      window.removeEventListener("vietmap_go_to_current", handleGoToCurrent);
    };
  }, [handleZoomToBounds, handleGoToCurrent, map]);

  // Map initialization
  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    try {
      const mapInstance = new vietmapgl.Map({
        container: mapContainerRef.current,
        style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${apiKey}`,
        center: center,
        zoom: zoom,
      });

      mapInstance.on('load', () => {
        if (!mapInstance.getSource('route-source')) {
          mapInstance.addSource('route-source', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
          });

          // Route Layer with Traffic Coloring
          mapInstance.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route-source',
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { 
              "line-color": hideViz ? "#3b82f6" : [
                "case",
                ["==", ["get", "status"], "low"], "#10b981",    // Green
                ["==", ["get", "status"], "normal"], "#f59e0b", // Yellow
                ["==", ["get", "status"], "heavy"], "#ef4444",  // Red
                theme === 'dark' ? "#f87171" : "#ef4444"         // Default
              ],
              "line-width": 8 
            }
          });
        }

        // --- Interaction Logic (Inside on load) ---
        const popup = new vietmapgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'route-popup'
        });
        popupRef.current = popup;

        mapInstance.on('mouseenter', 'route-layer', (e: any) => {
          if (hideVizRef.current) return;
          mapInstance.getCanvas().style.cursor = 'pointer';
          const feature = e.features?.[0];
          if (!feature) return;

          const { status, weather, label } = feature.properties || {};
          
          let content = '';
          const currentT = tRef.current;
          const currentVizMode = vizModeRef.current;
          const currentTheme = themeRef.current;
          
          const titleColor = '#6b7280'; // gray-500
          const mainColor = currentTheme === 'dark' ? '#f3f4f6' : '#111827';
          const trafficColor = status === 'low' ? '#10b981' : status === 'normal' ? '#f59e0b' : '#ef4444';

          if (currentVizMode === 'traffic') {
            const statusKey = status || label || 'normal';
            const statusText = currentT(`map.visualization.${statusKey}`);
            content = `<div style="padding: 8px; font-family: sans-serif; min-width: 100px; background: ${currentTheme === 'dark' ? '#1f2937' : '#ffffff'}; color: ${mainColor};">
              <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${titleColor}; margin: 0;">${currentT("map.layers.traffic")}</p>
              <p style="font-size: 14px; font-weight: 900; margin: 4px 0 0 0; color: ${trafficColor};">${statusText}</p>
            </div>`;
          } else {
            content = `<div style="padding: 8px; font-family: sans-serif; min-width: 100px; background: ${currentTheme === 'dark' ? '#1f2937' : '#ffffff'}; color: ${mainColor};">
              <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${titleColor}; margin: 0;">${currentT("sidebar.weatherForecast")}</p>
              <p style="font-size: 14px; font-weight: 900; margin: 4px 0 0 0; color: #2563eb; text-transform: capitalize;">${currentT(`map.visualization.${weather || 'sunny'}`)}</p>
            </div>`;
          }

          popup.setLngLat(e.lngLat).setHTML(content).addTo(mapInstance);
        });

        mapInstance.on('mousemove', 'route-layer', (e: any) => {
          if (hideVizRef.current) return;
          popup.setLngLat(e.lngLat);
        });

        mapInstance.on('mouseleave', 'route-layer', () => {
          if (hideVizRef.current) return;
          mapInstance.getCanvas().style.cursor = '';
          popup.remove();
        });

        // Map Click Event
        mapInstance.on('click', (e: any) => {
          if (onClickRef.current) onClickRef.current(e.lngLat);
        });
      });

      mapInstance.addControl(new vietmapgl.NavigationControl(), 'top-right');
      mapInstance.addControl(new FullscreenControl(), 'top-right');
      mapInstance.addControl(new vietmapgl.GeolocateControl({ trackUserLocation: true }), 'top-right');
      
      if (!hideZoomToBounds) {
        mapInstance.addControl(new ZoomToBoundsControl(() => handleZoomRef.current()), 'top-right');
      }
      
      setMap(mapInstance);
    } catch (error) {
      console.error("VietMap init error:", error);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [apiKey, center, zoom, handleZoomToBounds, map]);

  // Theme/VizMode change handler for map layers
  useEffect(() => {
    if (map && map.isStyleLoaded()) {
      if (map.getLayer('route-layer')) {
        map.setPaintProperty('route-layer', 'line-color', hideViz ? "#3b82f6" : [
          "case",
          ["==", ["get", "status"], "low"], "#10b981",
          ["==", ["get", "status"], "normal"], "#f59e0b",
          ["==", ["get", "status"], "heavy"], "#ef4444",
          theme === 'dark' ? "#f87171" : "#ef4444"
        ]);
      }
    }
  }, [theme, map, hideViz]);

  // Route Rendering
  useEffect(() => {
    if (!map) return;

    const activeRoute = propRouteData || (routeInfo?.points ? {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: decodePolyline(routeInfo.points) }
    } : null);

    const updateMap = () => {
      const source = map.getSource('route-source');
      if (source) {
        console.log("VietMap: Updating route source with data:", activeRoute);
        (source as any).setData(activeRoute || { type: 'FeatureCollection', features: [] });
      }

      let coords: any[] = [];
      if (activeRoute?.type === 'FeatureCollection') {
        activeRoute.features.forEach((f: any) => {
          if (f.geometry.type === 'LineString') coords = [...coords, ...f.geometry.coordinates];
        });
      } else if (activeRoute?.geometry?.type === 'LineString') {
        coords = activeRoute.geometry.coordinates;
      }

      if (coords.length > 0) {
        const bounds = coords.reduce((b: any, c: any) => b.extend(c), new vietmapgl.LngLatBounds(coords[0], coords[0]));
        map.fitBounds(bounds, { padding: 50, duration: 1000 });
      }
    };

    if (map.isStyleLoaded()) updateMap();
    else map.once('load', updateMap);
  }, [propRouteData, routeInfo, map]);

  // Weather Markers Lifecycle
  useEffect(() => {
    if (!map) return;

    // Clear existing weather markers first
    weatherMarkersRef.current.forEach(m => m.remove());
    weatherMarkersRef.current = [];

    if (vizMode !== 'weather' || hideViz) return;

    const activeRoute = propRouteData || (routeInfo?.points ? {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: decodePolyline(routeInfo.points) }
      }]
    } : null);

    if (activeRoute?.type === 'FeatureCollection') {
      const weatherIcons: Record<string, string> = {
        sunny: 'https://img.icons8.com/color/48/sun--v1.png',
        rainy: 'https://img.icons8.com/color/48/rain--v1.png',
        cloudy: 'https://img.icons8.com/color/48/cloud--v1.png',
        clear: 'https://img.icons8.com/color/48/sun--v1.png'
      };

      const weatherPopup = new vietmapgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'weather-marker-popup'
      });

      activeRoute.features.forEach((f: any) => {
        if (f.geometry.type === 'Point' && f.properties?.weather) {
          const iconUrl = weatherIcons[f.properties.weather] || weatherIcons.sunny;
          const temperature = typeof f.properties.temperatureC === 'number' ? `${f.properties.temperatureC.toFixed(1)}°C` : null;
          const weatherKey = `map.visualization.${f.properties.weather}`;
          
          const el = document.createElement('div');
          el.className = 'weather-marker flex items-center justify-center p-1 bg-white/80 rounded-full shadow-md border border-white/50 backdrop-blur-sm';
          el.style.width = '36px';
          el.style.height = '36px';
          if (temperature) {
            el.setAttribute('aria-label', `Weather temperature ${temperature}`);
          }
          el.innerHTML = `<img src="${iconUrl}" style="width: 28px; height: 28px; display: block;" alt="${f.properties.weather}" />`;

          el.addEventListener('mouseenter', () => {
            const currentTheme = themeRef.current;
            const currentT = tRef.current;
            const bg = currentTheme === 'dark' ? '#1f2937' : '#ffffff';
            const color = currentTheme === 'dark' ? '#f9fafb' : '#111827';
            const secondary = currentTheme === 'dark' ? '#9ca3af' : '#6b7280';
            const weatherText = currentT(weatherKey);
            const tempText = temperature || '--';

            const content = `<div style="padding: 8px 10px; min-width: 110px; font-family: sans-serif; background: ${bg}; color: ${color}; border-radius: 8px;">
              <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0; color: ${secondary};">${currentT('sidebar.weatherForecast')}</p>
              <p style="font-size: 13px; font-weight: 800; margin: 4px 0 0 0; text-transform: capitalize;">${weatherText}</p>
              <p style="font-size: 12px; font-weight: 700; margin: 2px 0 0 0; color: #2563eb;">${tempText}</p>
            </div>`;

            weatherPopup
              .setLngLat(f.geometry.coordinates)
              .setHTML(content)
              .addTo(map);
          });

          el.addEventListener('mouseleave', () => {
            weatherPopup.remove();
          });

          const marker = new vietmapgl.Marker({ element: el, anchor: 'center' })
            .setLngLat(f.geometry.coordinates)
            .addTo(map);
          
          weatherMarkersRef.current.push(marker);
        }
      });
    }
  }, [propRouteData, routeInfo, vizMode, map, hideViz]);

  // Marker Management
  useEffect(() => {
    if (!map) return;

    const activeOrigin = (propOriginCoords !== undefined) ? propOriginCoords : (routeInfo?.from ? { lat: routeInfo.from.lat, lng: routeInfo.from.lng } : null);
    const activeDest = (propDestCoords !== undefined) ? propDestCoords : (routeInfo?.to ? { lat: routeInfo.to.lat, lng: routeInfo.to.lng } : null);

    // Origin Marker (A)
    if (activeOrigin) {
      if (!originMarkerRef.current) {
        const el = createMarkerElement('w-8 h-8 rounded-full bg-(--color-success) text-white flex items-center justify-center font-bold border-2 border-white shadow-lg cursor-move', 'A');
        originMarkerRef.current = new vietmapgl.Marker({ element: el, draggable: !!onOriginChange })
          .setLngLat([activeOrigin.lng, activeOrigin.lat])
          .addTo(map);

        if (onOriginChange) {
          originMarkerRef.current.on('dragend', () => {
            const lngLat = originMarkerRef.current.getLngLat();
            onOriginChangeRef.current?.({ lat: lngLat.lat, lng: lngLat.lng });
          });
        }
      } else {
        originMarkerRef.current.setLngLat([activeOrigin.lng, activeOrigin.lat]);
      }
    } else {
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
    }

    // Destination Marker (B)
    if (activeDest) {
      if (!destMarkerRef.current) {
        const el = createMarkerElement('w-8 h-8 rounded-full bg-(--color-danger) text-white flex items-center justify-center font-bold border-2 border-white shadow-lg cursor-move', 'B');
        destMarkerRef.current = new vietmapgl.Marker({ element: el, draggable: !!onDestChange })
          .setLngLat([activeDest.lng, activeDest.lat])
          .addTo(map);

        if (onDestChange) {
          destMarkerRef.current.on('dragend', () => {
            const lngLat = destMarkerRef.current.getLngLat();
            onDestChangeRef.current?.({ lat: lngLat.lat, lng: lngLat.lng });
          });
        }
      } else {
        destMarkerRef.current.setLngLat([activeDest.lng, activeDest.lat]);
      }
    } else {
      destMarkerRef.current?.remove();
      destMarkerRef.current = null;
    }

    // Selected Location (Generic)
    if (selectedLocation && !activeOrigin && !activeDest) {
      if (!selectedMarkerRef.current) {
        const el = document.createElement('div');
        el.className = "text-(--color-primary) filter drop-shadow-md cursor-move";
        el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
        
        selectedMarkerRef.current = new vietmapgl.Marker({ element: el, anchor: 'bottom', draggable: !!onLocationChange })
          .setLngLat([selectedLocation.lng, selectedLocation.lat])
          .addTo(map);

        if (onLocationChange) {
          selectedMarkerRef.current.on('dragend', () => {
            const lngLat = selectedMarkerRef.current.getLngLat();
            onLocationChangeRef.current?.({ lat: lngLat.lat, lng: lngLat.lng });
          });
        }
      } else {
        selectedMarkerRef.current.setLngLat([selectedLocation.lng, selectedLocation.lat]);
      }
    } else {
      selectedMarkerRef.current?.remove();
      selectedMarkerRef.current = null;
    }

    // Current Pos
    if (currentPos && !selectedLocation && !activeOrigin && !activeDest) {
      if (!currentPosMarkerRef.current) {
        const el = createMarkerElement('w-5 h-5 rounded-full bg-(--color-primary) border-2 border-white shadow-md ring-4 ring-(--color-primary-bg)');
        currentPosMarkerRef.current = new vietmapgl.Marker({ element: el }).setLngLat([currentPos.lng, currentPos.lat]).addTo(map);
        map.flyTo({ center: [currentPos.lng, currentPos.lat], zoom: 14, duration: 1500 });
      } else currentPosMarkerRef.current.setLngLat([currentPos.lng, currentPos.lat]);
    } else {
      currentPosMarkerRef.current?.remove();
      currentPosMarkerRef.current = null;
    }
  }, [routeInfo, selectedLocation, currentPos, propOriginCoords, propDestCoords, onOriginChange, onDestChange, map]);

  return (
    <div className="w-full h-full relative bg-(--color-bg) rounded-xl overflow-hidden group">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
