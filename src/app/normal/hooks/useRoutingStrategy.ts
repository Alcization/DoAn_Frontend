"use client";

import { useCallback } from "react";

/**
 * RouteStrategy Interface (Strategy Pattern)
 * Defines a common interface for different routing algorithms.
 */
export interface RouteStrategy {
  calculateRoute(from: { lat: number; lng: number }, to: { lat: number; lng: number }, options?: any): Promise<any>;
}

/**
 * useRoutingStrategy (Strategy Pattern)
 * Manages different routing strategies for Car, Motorcycle, and Truck.
 */
export function useRoutingStrategy() {
  
  /**
   * The Strategy Executor
   * Executes the appropriate strategy based on the vehicle type.
   */
  const findRoute = useCallback(async (
    vehicle: "car" | "motorcycle" | "truck",
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    options?: { capacity?: string }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("point", `${from.lat},${from.lng}`);
      params.append("point", `${to.lat},${to.lng}`);
      params.append("vehicle", vehicle);
      params.append("points_encoded", "true");
      
      // Capacity-specific logic for Truck strategy
      if (vehicle === "truck" && options?.capacity) {
        params.append("capacity", options.capacity);
      }

      const response = await fetch(`/api/vietmap-route?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch route");
      }
      
      return await response.json();
    } catch (err) {
      console.error("Routing Strategy Error:", err);
      throw err;
    }
  }, []);

  return { findRoute };
}
