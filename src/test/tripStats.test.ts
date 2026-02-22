import { describe, it, expect } from 'vitest'
import { calculateTripStats, formatDuration, formatDate } from '../utils/tripStats'
import type { GpsPoint } from '../types'

describe('tripStats', () => {
  describe('calculateTripStats', () => {
    it('should return zero stats for empty array', () => {
      const result = calculateTripStats([], 'test-ride')

      expect(result).toEqual({
        rideId: 'test-ride',
        distanceKm: 0,
        durationSeconds: 0,
        avgSpeedKmh: 0,
        maxSpeedKmh: 0,
        pointCount: 0,
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      })
    })

    it('should calculate stats for single point', () => {
      const points: GpsPoint[] = [{
        timestamp_ms: 1000,
        latitude: 14.58,
        longitude: -90.48,
        accuracy: 10,
        altitude: 1500,
        speed: 5.5,
      }]

      const result = calculateTripStats(points, 'test-ride')

      expect(result.pointCount).toBe(1)
      expect(result.distanceKm).toBe(0)
      expect(result.durationSeconds).toBe(0)
      expect(result.maxSpeedKmh).toBe(0)
    })

    it('should calculate distance between two points', () => {
      const points: GpsPoint[] = [
        { timestamp_ms: 1000, latitude: 14.58, longitude: -90.48, accuracy: 10, altitude: 1500, speed: 0 },
        { timestamp_ms: 2000, latitude: 14.59, longitude: -90.49, accuracy: 10, altitude: 1500, speed: 10 },
      ]

      const result = calculateTripStats(points, 'test-ride')

      expect(result.pointCount).toBe(2)
      expect(result.distanceKm).toBeGreaterThan(0)
      expect(result.durationSeconds).toBe(1)
    })
  })

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(30)).toBe('30s')
      expect(formatDuration(0)).toBe('0s')
    })

    it('should format minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1m 30s')
      expect(formatDuration(120)).toBe('2m 0s')
    })

    it('should format hours and minutes', () => {
      expect(formatDuration(3661)).toBe('1h 1m')
      expect(formatDuration(7200)).toBe('2h 0m')
    })
  })

  describe('formatDate', () => {
    it('should format date string', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDate(date)
      expect(result).toContain('Jan')
      expect(result).toContain('2024')
    })
  })
})
