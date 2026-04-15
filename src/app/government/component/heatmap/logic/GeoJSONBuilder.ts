import * as turf from "@turf/turf";
import { HeatmapArea } from "../../../hooks/useDashboard";
import { MAP_RISK_STRATEGY } from "./HeatmapStrategies";

/**
 * [BUILDER PATTERN] - GeoJSONBuilder: Constructs FeatureCollections for the map.
 */
export class GeoJSONBuilder {
  private features: any[] = [];

  addCircularArea(area: HeatmapArea, isSelected: boolean) {
  
    const config = MAP_RISK_STRATEGY[area.risk];
    const circle = turf.circle([area.lng, area.lat], config.radius, {
      steps: 64,
      units: "kilometers",
      properties: {
        ...area,
        color: config.color,
        isSelected,
      },
    });
    this.features.push(circle);
    return this;
  }

  build(): any {
    return {
      type: "FeatureCollection",
      features: this.features,
    };
  }
}
