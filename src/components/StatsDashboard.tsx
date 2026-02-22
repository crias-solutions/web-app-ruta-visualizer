import type { TripStats } from '../types';
import { formatDuration } from '../utils/tripStats';

interface StatsDashboardProps {
  statsMap: Map<string, TripStats>;
  selectedRideId: string | null;
}

interface DisplayStats {
  tripsOrPoints: number;
  tripsLabel: string;
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
}

function aggregateStats(statsMap: Map<string, TripStats>): DisplayStats {
  const allStats = Array.from(statsMap.values());
  
  if (allStats.length === 0) {
    return { tripsOrPoints: 0, tripsLabel: 'Trips', distance: 0, duration: 0, avgSpeed: 0, maxSpeed: 0 };
  }

  const distance = allStats.reduce((sum, s) => sum + s.distanceKm, 0);
  const duration = allStats.reduce((sum, s) => sum + s.durationSeconds, 0);
  const avgSpeed = duration > 0 ? (distance / duration) * 3600 : 0;
  const maxSpeed = Math.max(...allStats.map((s) => s.maxSpeedKmh));

  return {
    tripsOrPoints: allStats.length,
    tripsLabel: 'Trips',
    distance: Math.round(distance * 100) / 100,
    duration,
    avgSpeed: Math.round(avgSpeed * 100) / 100,
    maxSpeed: Math.round(maxSpeed * 100) / 100,
  };
}

function tripStatsToDisplay(stats: TripStats): DisplayStats {
  return {
    tripsOrPoints: stats.pointCount,
    tripsLabel: 'Points',
    distance: stats.distanceKm,
    duration: stats.durationSeconds,
    avgSpeed: stats.avgSpeedKmh,
    maxSpeed: stats.maxSpeedKmh,
  };
}

export default function StatsDashboard({ statsMap, selectedRideId }: StatsDashboardProps) {
  const stats: DisplayStats | null = selectedRideId
    ? (statsMap.get(selectedRideId) ? tripStatsToDisplay(statsMap.get(selectedRideId)!) : null)
    : aggregateStats(statsMap);

  if (!stats) return null;

  return (
    <div className="stats-dashboard">
      <h3>{selectedRideId ? 'Trip Stats' : 'Overall Stats'}</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">{stats.tripsLabel}</span>
          <span className="stat-value">{stats.tripsOrPoints}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Distance</span>
          <span className="stat-value">{stats.distance} km</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{formatDuration(stats.duration)}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Avg Speed</span>
          <span className="stat-value">{stats.avgSpeed} km/h</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Max Speed</span>
          <span className="stat-value">{stats.maxSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}
