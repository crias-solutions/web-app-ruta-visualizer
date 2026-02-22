import type { TripFilters as TripFiltersType } from '../types';

interface TripFiltersProps {
  vehicles: string[];
  platforms: string[];
  filters: TripFiltersType;
  onFilterChange: (filters: TripFiltersType) => void;
}

export default function TripFilters({ vehicles, platforms, filters, onFilterChange }: TripFiltersProps) {
  const handleVehicleChange = (vehicle: string) => {
    onFilterChange({
      ...filters,
      vehicle: vehicle === '' ? null : vehicle,
    });
  };

  const handlePlatformChange = (platform: string) => {
    onFilterChange({
      ...filters,
      platform: platform === '' ? null : platform,
    });
  };

  const handleDateFromChange = (dateStr: string) => {
    onFilterChange({
      ...filters,
      dateFrom: dateStr ? new Date(dateStr) : null,
    });
  };

  const handleDateToChange = (dateStr: string) => {
    onFilterChange({
      ...filters,
      dateTo: dateStr ? new Date(dateStr) : null,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      vehicle: null,
      platform: null,
      dateFrom: null,
      dateTo: null,
    });
  };

  const hasActiveFilters = filters.vehicle || filters.platform || filters.dateFrom || filters.dateTo;

  return (
    <div className="trip-filters">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label>Vehicle</label>
        <select
          value={filters.vehicle || ''}
          onChange={(e) => handleVehicleChange(e.target.value)}
        >
          <option value="">All vehicles</option>
          {vehicles.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Platform</label>
        <select
          value={filters.platform || ''}
          onChange={(e) => handlePlatformChange(e.target.value)}
        >
          <option value="">All platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>From Date</label>
        <input
          type="date"
          value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateFromChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>To Date</label>
        <input
          type="date"
          value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
          onChange={(e) => handleDateToChange(e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <button className="clear-filters" onClick={clearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  );
}
