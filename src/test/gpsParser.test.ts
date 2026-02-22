import { describe, it, expect } from 'vitest'
import { parseGpsCsv } from '../utils/gpsParser'

describe('gpsParser', () => {
  describe('parseGpsCsv', () => {
    it('should parse valid GPS CSV data', () => {
      const csv = `timestamp_ms,latitude,longitude,accuracy,altitude,speed
1000,14.58,-90.48,10,1500,5.5
2000,14.59,-90.49,12,1510,6.0`

      const result = parseGpsCsv(csv)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        timestamp_ms: 1000,
        latitude: 14.58,
        longitude: -90.48,
        accuracy: 10,
        altitude: 1500,
        speed: 5.5,
      })
      expect(result[1]).toEqual({
        timestamp_ms: 2000,
        latitude: 14.59,
        longitude: -90.49,
        accuracy: 12,
        altitude: 1510,
        speed: 6.0,
      })
    })

    it('should return empty array for empty string', () => {
      const result = parseGpsCsv('')
      expect(result).toHaveLength(0)
    })

    it('should skip empty lines', () => {
      const csv = `timestamp_ms,latitude,longitude,accuracy,altitude,speed
1000,14.58,-90.48,10,1500,5.5

2000,14.59,-90.49,12,1510,6.0`

      const result = parseGpsCsv(csv)
      expect(result).toHaveLength(2)
    })
  })
})
