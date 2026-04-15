"use client";

/**
 * RouteBuilder (Builder Pattern)
 * Fluent interface for constructing complex route requests.
 */
export class RouteBuilder {
  private points: { lat: number, lng: number }[] = [];
  private vehicleType: 'car' | 'motorcycle' | 'truck' = 'car';
  private capacity: string | null = null;
  private encoded: boolean = true;

  public static create() {
    return new RouteBuilder();
  }

  public addPoint(lat: number, lng: number): this {
    this.points.push({ lat, lng });
    return this;
  }

  public setVehicle(vehicle: 'car' | 'motorcycle' | 'truck'): this {
    this.vehicleType = vehicle;
    return this;
  }

  public setTruckCapacity(capacity: string): this {
    this.capacity = capacity;
    return this;
  }

  public setPointsEncoded(encoded: boolean): this {
    this.encoded = encoded;
    return this;
  }

  public build(): URLSearchParams {
    const params = new URLSearchParams();
    this.points.forEach(p => params.append("point", `${p.lat},${p.lng}`));
    params.append("vehicle", this.vehicleType);
    params.append("points_encoded", String(this.encoded));
    
    if (this.vehicleType === "truck" && this.capacity) {
      params.append("capacity", this.capacity);
    }

    return params;
  }
}
