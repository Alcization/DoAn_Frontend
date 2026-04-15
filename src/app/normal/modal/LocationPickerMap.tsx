"use client";

import { useTheme } from "../../../context/theme/ThemeContext";
import Map, { Marker } from "react-map-gl/maplibre";
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_MAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY || "your-apikey";
const VIETMAP_LIGHT = `https://maps.vietmap.vn/maps/styles/lm/style.json?apikey=${API_KEY}`;
const VIETMAP_DARK = `https://maps.vietmap.vn/maps/styles/dm/style.json?apikey=${API_KEY}`;

type LocationPickerMapProps = {
  selectedLocation: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
  searchQuery: string;
};

export default function LocationPickerMap({ selectedLocation, onLocationSelect, searchQuery }: LocationPickerMapProps) {
  const { theme } = useTheme();
  const mapStyle = theme === "dark" ? VIETMAP_DARK : VIETMAP_LIGHT;
  const mapRef = useRef<any>(null);

  const defaultCenter = { lng: 106.6297, lat: 10.8231 }; // HCM City center

  const [viewState, setViewState] = useState({
    longitude: defaultCenter.lng,
    latitude: defaultCenter.lat,
    zoom: 13
  });

  // Handle map click
  const onMapClick = (event: any) => {
    const { lngLat } = event;
    onLocationSelect(lngLat.lat, lngLat.lng);
  };

  // Mock search function - in production, this would call a geocoding API
  useEffect(() => {
    if (searchQuery.trim()) {
      // Mock search results for common places in HCMC
      const mockLocations: Record<string, [number, number]> = {
        "quận 1": [10.7769, 106.7009],
        "district 1": [10.7769, 106.7009],
        "quận 3": [10.7860, 106.6917],
        "district 3": [10.7860, 106.6917],
        "quận 7": [10.7333, 106.7197],
        "district 7": [10.7333, 106.7197],
        "bình thạnh": [10.8142, 106.7072],
        "binh thanh": [10.8142, 106.7072],
        "tân bình": [10.8006, 106.6530],
        "tan binh": [10.8006, 106.6530],
        "nhà bè": [10.6833, 106.7333],
        "nha be": [10.6833, 106.7333],
        "sân bay": [10.8184, 106.6595],
        "airport": [10.8184, 106.6595],
      };

      const query = searchQuery.toLowerCase().trim();
      const foundLocation = mockLocations[query];
      
      if (foundLocation) {
        if (mapRef.current) {
          mapRef.current.getMap().flyTo({ center: [foundLocation[1], foundLocation[0]], zoom: 13 });
        }
        onLocationSelect(foundLocation[0], foundLocation[1]);
      }
    }
  }, [searchQuery, onLocationSelect]);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation && !selectedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
           if (mapRef.current) {
               mapRef.current.getMap().flyTo({ center: [position.coords.longitude, position.coords.latitude], zoom: 13 });
           }
           onLocationSelect(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
           console.log("Could not get user location, using default:", error);
           onLocationSelect(defaultCenter.lat, defaultCenter.lng);
        }
      );
    } else if (!selectedLocation) {
       onLocationSelect(defaultCenter.lat, defaultCenter.lng);
    }
  }, []);

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
    <div style={{ height: "300px", width: "100%", position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapLib={vietmapgl as any}
        transformRequest={transformRequest}
        onClick={onMapClick}
      >
        {selectedLocation && (
          <Marker 
            longitude={selectedLocation[1]} 
            latitude={selectedLocation[0]} 
            anchor="bottom"
          >
             <MapPin size={32} className="text-(--color-primary) -mt-8" fill="white" />
          </Marker>
        )}
      </Map>
    </div>
  );
}
