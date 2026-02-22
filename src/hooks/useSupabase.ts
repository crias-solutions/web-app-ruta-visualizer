import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback } from 'react';
import type { RideUpload, TripFilters } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabase() {
  const [rides, setRides] = useState<RideUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = useCallback(async (filters?: TripFilters) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('ride_uploads')
        .select('*')
        .order('started_at', { ascending: false });

      if (filters?.vehicle) {
        query = query.eq('vehicle', filters.vehicle);
      }
      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters?.dateFrom) {
        query = query.gte('started_at', filters.dateFrom.toISOString());
      }
      if (filters?.dateTo) {
        query = query.lte('started_at', filters.dateTo.toISOString());
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setRides(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  return { rides, loading, error, fetchRides };
}

export function useRideStats() {
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const { data: vehicleData } = await supabase
        .from('ride_uploads')
        .select('vehicle');
      
      const { data: platformData } = await supabase
        .from('ride_uploads')
        .select('platform');

      if (vehicleData) {
        setVehicles([...new Set(vehicleData.map((v) => v.vehicle))]);
      }
      if (platformData) {
        setPlatforms([...new Set(platformData.map((p) => p.platform))]);
      }
    }

    fetchStats();
  }, []);

  return { vehicles, platforms };
}
