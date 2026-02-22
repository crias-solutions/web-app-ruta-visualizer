import Papa from 'papaparse';
import type { GpsPoint, SensorReading } from '../types';

export function parseGpsCsv(csvString: string): GpsPoint[] {
  const result = Papa.parse<GpsPoint>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    timestamp_ms: row.timestamp_ms as number,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    accuracy: row.accuracy as number,
    altitude: row.altitude as number,
    speed: row.speed as number,
  }));
}

export function parseSensorCsv(csvString: string): SensorReading[] {
  const result = Papa.parse<SensorReading>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    timestamp_ms: row.timestamp_ms as number,
    sensor: row.sensor as string,
    x: row.x as number,
    y: row.y as number,
    z: row.z as number,
  }));
}

export function getCoordinatesFromGps(gpsPoints: GpsPoint[]): [number, number][] {
  return gpsPoints.map((point) => [point.latitude, point.longitude]);
}
