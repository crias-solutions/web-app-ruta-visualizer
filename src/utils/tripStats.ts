import type { GpsPoint, TripStats } from '../types';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateTripStats(gpsPoints: GpsPoint[], rideId: string): TripStats {
  if (gpsPoints.length === 0) {
    return {
      rideId,
      distanceKm: 0,
      durationSeconds: 0,
      avgSpeedKmh: 0,
      maxSpeedKmh: 0,
      startTime: new Date(),
      endTime: new Date(),
      pointCount: 0,
    };
  }

  let totalDistance = 0;
  let maxSpeed = 0;

  const sortedPoints = [...gpsPoints].sort((a, b) => a.timestamp_ms - b.timestamp_ms);

  for (let i = 1; i < sortedPoints.length; i++) {
    const prev = sortedPoints[i - 1];
    const curr = sortedPoints[i];
    totalDistance += haversineDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    if (curr.speed > maxSpeed) {
      maxSpeed = curr.speed;
    }
  }

  const startTime = new Date(sortedPoints[0].timestamp_ms);
  const endTime = new Date(sortedPoints[sortedPoints.length - 1].timestamp_ms);
  const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  const avgSpeed = durationSeconds > 0 ? (totalDistance / durationSeconds) * 3600 : 0;

  return {
    rideId,
    distanceKm: Math.round(totalDistance * 100) / 100,
    durationSeconds: Math.round(durationSeconds),
    avgSpeedKmh: Math.round(avgSpeed * 100) / 100,
    maxSpeedKmh: Math.round((maxSpeed * 3.6) * 100) / 100,
    startTime,
    endTime,
    pointCount: gpsPoints.length,
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes < 60) return `${minutes}m ${secs}s`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
