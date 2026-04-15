"use client";


import LocationInputs from "../shared_component/LocationInputs";
import MapVisualization from "../shared_component/MapVisualization";

export default function NormalMap() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[var(--color-bg)] min-h-[calc(100vh-80px)]">
      
      <LocationInputs />
      <MapVisualization />
    </div>
  );
}
