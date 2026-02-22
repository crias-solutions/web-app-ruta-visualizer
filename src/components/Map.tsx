import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RideUpload } from '../types';
import { parseGpsCsv } from '../utils/gpsParser';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const COLORS = [
  '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4',
  '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000',
];

interface TripMapProps {
  rides: RideUpload[];
  selectedRideId: string | null;
  onSelectRide: (rideId: string | null) => void;
}

function MapBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
}

export default function TripMap({ rides, selectedRideId, onSelectRide }: TripMapProps) {
  const rideData = useMemo(() => {
    return rides.map((ride, index) => {
      const gpsPoints = parseGpsCsv(ride.gps_csv);
      const coordinates: [number, number][] = gpsPoints.map((p) => [p.latitude, p.longitude]);
      const color = COLORS[index % COLORS.length];
      const isSelected = ride.ride_id === selectedRideId;

      return {
        ride,
        gpsPoints,
        coordinates,
        color,
        isSelected,
      };
    });
  }, [rides, selectedRideId]);

  const allCoordinates = useMemo(() => {
    return rideData.flatMap((r) => r.coordinates);
  }, [rideData]);

  const center: [number, number] = allCoordinates.length > 0
    ? allCoordinates[0]
    : [14.58, -90.48];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds coordinates={allCoordinates} />

      {rideData.map(({ ride, coordinates, color, isSelected }) => {
        if (coordinates.length === 0) return null;

        return (
          <div key={ride.ride_id}>
            <Polyline
              positions={coordinates}
              pathOptions={{
                color: isSelected ? '#000' : color,
                weight: isSelected ? 6 : 4,
                opacity: isSelected ? 1 : 0.8,
              }}
              eventHandlers={{
                click: () => onSelectRide(ride.ride_id),
              }}
            />
            <Marker position={coordinates[0]}>
              <Popup>
                <div>
                  <strong>Start: {ride.ride_id}</strong>
                  <br />
                  Vehicle: {ride.vehicle}
                  <br />
                  Platform: {ride.platform}
                </div>
              </Popup>
            </Marker>
            {coordinates.length > 1 && (
              <Marker position={coordinates[coordinates.length - 1]}>
                <Popup>
                  <div>
                    <strong>End: {ride.ride_id}</strong>
                  </div>
                </Popup>
              </Marker>
            )}
          </div>
        );
      })}
    </MapContainer>
  );
}
