"use client";

import dynamic from 'next/dynamic';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { decodePolyline } from '@/util/polyline';

// Import sub-components
import MapFullSidebar from './components/MapFullSidebar';
import MapFullControls from './components/MapFullControls';
import MapFullBottomPanel from './components/MapFullBottomPanel';

// Use dynamic import for SSR safety
const DynamicVietMap = dynamic(() => import('@/app/normal/shared_component/VietMap'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[500px] rounded-2xl bg-(--color-surface) border border-(--color-border) animate-pulse text-(--color-text-primary) font-semibold">
      Initializing Full Options Map...
    </div>
  )
});

// Mock Search History
const MOCK_HISTORY = [
  { id: 1, name: "Chung cư Mỹ Kim", address: "Hồng Bàng, Quận 5, HCM", time: "2 giờ trước" },
  { id: 2, name: "Đại học Bách Khoa", address: "Lý Thường Kiệt, Quận 10, HCM", time: "5 giờ trước" },
  { id: 3, name: "Chợ Bến Thành", address: "Quận 1, Ho Chi Minh City", time: "Hôm qua" }
];

// Helper component to handle dynamic route fetching without cluttering main page
const RouteFetcher: React.FC<{
  targetLocation: { lat: number, lng: number } | null;
  onRouteFound: (data: any) => void;
}> = ({ targetLocation, onRouteFound }) => {
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("Geolocation failed for route calculation")
      );
    }
  }, []);

  useEffect(() => {
    if (!targetLocation || !currentPos) return;

    const findRoute = async () => {
      try {
        const params = new URLSearchParams();
        params.append("point", `${currentPos.lat},${currentPos.lng}`);
        params.append("point", `${targetLocation.lat},${targetLocation.lng}`);
        params.append("vehicle", "car");
        params.append("points_encoded", "true");

        const response = await fetch(`/api/vietmap-route?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Route fetched successfully in MapFullPage", data);
          onRouteFound(data);
          // Also dispatch for any other listeners
          window.dispatchEvent(new CustomEvent("vietmap_route_found", {
            detail: { ...data, from: currentPos, to: targetLocation }
          }));
        } else {
          console.error("Route fetch failed in MapFullPage", await response.text());
        }
      } catch (error) {
        console.error("Route fetch error in MapFullPage:", error);
      }
    };

    findRoute();
  }, [targetLocation, currentPos, onRouteFound]);

  return null;
};

export default function MapFullPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'search' | 'history'>('search');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [dynamicRoute, setDynamicRoute] = useState<any>(null);
  const [vizMode, setVizMode] = useState<'traffic' | 'weather'>('traffic');
  
  // Real-time route data from the fetcher
  const routeData = useMemo(() => {
    const points = dynamicRoute?.paths?.[0]?.points;
    if (!points) return null;
    
    const fullCoords = decodePolyline(points);
    if (fullCoords.length < 10) return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: fullCoords } };

    // Split into 4 segments with mock status
    const partLen = Math.floor(fullCoords.length / 4);
    const features: any[] = [];
    const statuses = ['low', 'normal', 'heavy', 'low'];
    const weathers = ['sunny', 'cloudy', 'rainy', 'clear'];

    for (let i = 0; i < 4; i++) {
      const start = i * partLen;
      const end = i === 3 ? fullCoords.length : (i + 1) * partLen + 1;
      const segmentCoords = fullCoords.slice(start, end);
      
      if (segmentCoords.length > 1) {
        features.push({
          type: "Feature",
          properties: { status: statuses[i] },
          geometry: { type: "LineString", coordinates: segmentCoords }
        });
        
        // Add a weather point at the middle of the segment
        const midIdx = Math.floor(segmentCoords.length / 2);
        features.push({
          type: "Feature",
          properties: { weather: weathers[i] },
          geometry: { type: "Point", coordinates: segmentCoords[midIdx] }
        });
      }
    }

    return { type: "FeatureCollection", features };
  }, [dynamicRoute]);

  const routeSummary = useMemo(() => {
    const path = dynamicRoute?.paths?.[0];
    if (!path) return { time: `-- ${t('common.minutes')}`, distance: `-- km` };
    
    return {
      time: path.time > 3600000 
        ? `${Math.floor(path.time / 3600000)}${t('common.hours').charAt(0)} ${Math.floor((path.time % 3600000) / 60000)}${t('common.minutes').charAt(0)}`
        : `${Math.round(path.time / 60000)} ${t('common.minutes')}`,
      distance: path.distance > 1000 
        ? `${(path.distance / 1000).toFixed(1)} km` 
        : `${Math.round(path.distance)} m`
    };
  }, [dynamicRoute, t]);

  useEffect(() => {
    const handleLocationFound = (event: any) => {
      const { coords } = event.detail;
      if (coords) setSelectedLocation(coords);
    };

    window.addEventListener("vietmap_location_details_found", handleLocationFound);
    return () => window.removeEventListener("vietmap_location_details_found", handleLocationFound);
  }, []);

  const handleZoomToBounds = () => {
    window.dispatchEvent(new CustomEvent('vietmap_zoom_to_bounds'));
  };

  const handleGoToCurrent = () => {
    window.dispatchEvent(new CustomEvent('vietmap_go_to_current'));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-(--color-bg) overflow-hidden font-sans">
      <RouteFetcher targetLocation={selectedLocation} onRouteFound={setDynamicRoute} />
      
      {/* Sidebar Component */}
      <MapFullSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        history={MOCK_HISTORY}
      />

        {/* Main Map Section */}
      <main className="flex-1 relative bg-(--color-bg-secondary)">
        <div className="absolute inset-0 z-0">
           <DynamicVietMap routeData={routeData} vizMode={vizMode} />
        </div>

        {/* Floating Controls Overlay Component */}
        <MapFullControls 
          onGoToCurrent={handleGoToCurrent}
          onZoomToBounds={handleZoomToBounds}
          vizMode={vizMode}
          setVizMode={setVizMode}
        />

        {/* Bottom Route Summary Overlay Component */}
        <MapFullBottomPanel 
          time={routeSummary.time}
          distance={routeSummary.distance}
        />

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none border-12 border-(--color-border) opacity-20 rounded-[40px] z-5" />
      </main>
    </div>
  );
}
