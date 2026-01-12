/**
 * Haversine Formula Utility
 * 
 * PURPOSE:
 * Calculates the distance between two GPS coordinates (latitude/longitude)
 * using the Haversine formula for great-circle distance.
 * 
 * GREEN CODING:
 * - Pure JavaScript calculation (no external API calls)
 * - Efficient mathematical computation
 * - No network overhead
 * 
 * VIVA EXPLANATION:
 * The Haversine formula determines the shortest distance between two points
 * on a sphere (Earth) given their latitude and longitude. This is used to
 * verify if a student is within the allowed radius of the classroom when
 * marking attendance.
 * 
 * @param {number} lat1 - Latitude of first point (in degrees)
 * @param {number} lon1 - Longitude of first point (in degrees)
 * @param {number} lat2 - Latitude of second point (in degrees)
 * @param {number} lon2 - Longitude of second point (in degrees)
 * @returns {number} Distance between the two points in meters
 */

export function calculateDistance(lat1, lon1, lat2, lon2) {
    // Earth's radius in meters
    const R = 6371000;

    // Convert degrees to radians
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    // Haversine formula
    // a = sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)
    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    // c = 2 * atan2(√a, √(1−a))
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance = R * c
    const distance = R * c;

    return Math.round(distance); // Return distance in meters
}

/**
 * Check if student is within allowed range
 * 
 * @param {number} studentLat - Student's current latitude
 * @param {number} studentLon - Student's current longitude
 * @param {number} classLat - Classroom's latitude
 * @param {number} classLon - Classroom's longitude
 * @param {number} maxDistance - Maximum allowed distance in meters (default: 50m)
 * @returns {boolean} True if within range, false otherwise
 */
export function isWithinRange(studentLat, studentLon, classLat, classLon, maxDistance = 50) {
    const distance = calculateDistance(studentLat, studentLon, classLat, classLon);
    return distance <= maxDistance;
}

export default {
    calculateDistance,
    isWithinRange
};
