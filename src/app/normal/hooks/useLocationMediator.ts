"use client";

import { useState, useCallback } from "react";
import { LocationModel } from "./useVietmapFacade";

/**
 * Location State (Mediator/State Pattern)
 * Centralizes the complex state of multiple location points.
 */
export interface LocationState {
  personal: LocationModel | null;
  origin: LocationModel | null;
  destination: LocationModel | null;
  routeData: any | null;
}

/**
 * useLocationMediator (Mediator Pattern)
 * Coordinates location state and broadcasts changes to other components.
 */
export function useLocationMediator(initialState?: Partial<LocationState>) {
  const [state, setState] = useState<LocationState>({
    personal: initialState?.personal || null,
    origin: initialState?.origin || null,
    destination: initialState?.destination || null,
    routeData: initialState?.routeData || null,
  });

  const setLocation = useCallback((type: 'personal' | 'origin' | 'destination', location: LocationModel | null) => {
    setState(prev => ({
      ...prev,
      [type]: location,
      // Clear route if endpoints change
      routeData: (type === 'origin' || type === 'destination') ? null : prev.routeData
    }));

    // Observer Pattern: Broadcast for legacy components or map integration
    if (location) {
      window.dispatchEvent(new CustomEvent("vietmap_location_details_found", {
        detail: { type: type === 'destination' ? 'to' : type === 'origin' ? 'from' : 'personal', coords: { lat: location.lat, lng: location.lng }, info: location }
      }));
    }
  }, []);

  const setRouteData = useCallback((data: any) => {
    setState(prev => ({ ...prev, routeData: data }));
    
    // Observer Pattern: Broadcast route
    if (data) {
      window.dispatchEvent(new CustomEvent("vietmap_route_found", {
        detail: { ...data, from: state.origin, to: state.destination }
      }));
    }
  }, [state.origin, state.destination]);

  const swapRoute = useCallback(() => {
    setState(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
      routeData: null // Reset route on swap for recalculation
    }));
  }, []);

  return {
    state,
    setLocation,
    setRouteData,
    swapRoute
  };
}
