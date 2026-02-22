import type { RideUpload, TripStats } from '../types';
import { formatDuration, formatDate } from '../utils/tripStats';

interface TripListProps {
  rides: RideUpload[];
  statsMap: Map<string, TripStats>;
  selectedRideId: string | null;
  onSelectRide: (rideId: string | null) => void;
}

export default function TripList({ rides, statsMap, selectedRideId, onSelectRide }: TripListProps) {
  return (
    <div className="trip-list">
      <h3>Trips ({rides.length})</h3>
      <ul>
        {rides.map((ride) => {
          const stats = statsMap.get(ride.ride_id);
          const isSelected = ride.ride_id === selectedRideId;

          return (
            <li
              key={ride.ride_id}
              className={`trip-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectRide(isSelected ? null : ride.ride_id)}
            >
              <div className="trip-header">
                <span className="trip-vehicle">{ride.vehicle}</span>
                <span className="trip-platform">{ride.platform}</span>
              </div>
              <div className="trip-time">
                {formatDate(new Date(ride.started_at))}
              </div>
              {stats && (
                <div className="trip-stats">
                  <span>{stats.distanceKm} km</span>
                  <span>{formatDuration(stats.durationSeconds)}</span>
                  <span>{stats.avgSpeedKmh} km/h avg</span>
                </div>
              )}
              <div className="trip-points">
                {ride.gps_count} GPS points
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
