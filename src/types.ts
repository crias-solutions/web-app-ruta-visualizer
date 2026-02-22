export interface GpsPoint {
  timestamp_ms: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
}

export interface SensorReading {
  timestamp_ms: number;
  sensor: string;
  x: number;
  y: number;
  z: number;
}

export interface RideUpload {
  ride_id: string;
  vehicle: string;
  platform: string;
  started_at: string;
  sensors_count: number;
  gps_count: number;
  metadata: Record<string, unknown>;
  sensor_csv: string;
  gps_csv: string;
  created_at: string;
}

export interface TripStats {
  rideId: string;
  distanceKm: number;
  durationSeconds: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  startTime: Date;
  endTime: Date;
  pointCount: number;
}

export interface TripFilters {
  vehicle: string | null;
  platform: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}
