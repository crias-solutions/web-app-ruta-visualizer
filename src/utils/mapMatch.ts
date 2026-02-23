interface OSRMMatchGeometry {
  coordinates: [number, number][];
  type: 'LineString';
}

interface OSRMMatchRoute {
  distance: number;
  duration: number;
  geometry: OSRMMatchGeometry;
}

interface OSRMMatchResponse {
  code: string;
  matchings: OSRMMatchRoute[];
}

export async function mapMatchCoordinates(
  coordinates: [number, number][],
  options?: { geometries?: 'geojson' | 'polyline' }
): Promise<[number, number][]> {
  if (coordinates.length < 2) {
    return coordinates;
  }

  const osrmCoords = coordinates
    .map(([lat, lon]) => `${lon},${lat}`)
    .join(';');

  const url = `https://router.project-osrm.org/match/v1/driving/${osrmCoords}?geometries=${options?.geometries || 'geojson'}&overview=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('OSRM map match request failed, falling back to raw coordinates');
      return coordinates;
    }

    const data: OSRMMatchResponse = await response.json();

    if (data.code !== 'Ok' || !data.matchings || data.matchings.length === 0) {
      console.warn('OSRM returned no matchings, falling back to raw coordinates');
      return coordinates;
    }

    const geometry = data.matchings[0].geometry;
    if (geometry.type === 'LineString') {
      return geometry.coordinates;
    }

    return coordinates;
  } catch (error) {
    console.error('Error calling OSRM map match API:', error);
    return coordinates;
  }
}

export function convertToOSRMFormat(coordinates: [number, number][]): string {
  return coordinates.map(([lat, lon]) => `${lon},${lat}`).join(';');
}
