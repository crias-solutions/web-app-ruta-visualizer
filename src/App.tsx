import type { TripFilters } from './types';
import TripFiltersComponent from './components/TripFilters';
import TripMap from './components/Map';
import StatsDashboard from './components/StatsDashboard';
import TripList from './components/TripList';
import { useState, useMemo } from 'react';
import { useSupabase, useRideStats } from './hooks/useSupabase';
import { parseGpsCsv } from './utils/gpsParser';
import { calculateTripStats } from './utils/tripStats';
import './App.css';

export default function App() {
  const [filters, setFilters] = useState<TripFilters>({
    vehicle: null,
    platform: null,
    dateFrom: null,
    dateTo: null,
  });
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  const { rides, loading, error, fetchRides } = useSupabase();
  const { vehicles, platforms } = useRideStats();

  const statsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateTripStats>>();
    for (const ride of rides) {
      const gpsPoints = parseGpsCsv(ride.gps_csv);
      map.set(ride.ride_id, calculateTripStats(gpsPoints, ride.ride_id));
    }
    return map;
  }, [rides]);

  const handleFilterChange = (newFilters: TripFilters) => {
    setFilters(newFilters);
    fetchRides(newFilters);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ruta Visualizer</h1>
        <p>Vehicle Trip Map Visualization</p>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <TripFiltersComponent
            vehicles={vehicles}
            platforms={platforms}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <StatsDashboard statsMap={statsMap} selectedRideId={selectedRideId} />
          <TripList
            rides={rides}
            statsMap={statsMap}
            selectedRideId={selectedRideId}
            onSelectRide={setSelectedRideId}
          />
        </aside>

        <main className="map-container">
          {loading && <div className="loading">Loading trips...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && (
            <TripMap
              rides={rides}
              selectedRideId={selectedRideId}
              onSelectRide={setSelectedRideId}
            />
          )}
        </main>
      </div>
    </div>
  );
}
