/**
 * Location Service - Haversine Distance Calculation
 * 
 * GREEN CODING:
 * - Pure JavaScript calculation (no external API calls)
 * - Server-side verification ensures data integrity
 * 
 * VIVA EXPLANATION:
 * This service validates that a student is within the allowed radius
 * of the classroom before marking attendance. Uses the Haversine formula
 * to calculate great-circle distance between GPS coordinates.
 */

/**
 * Calculate distance between two GPS coordinates
 * @returns Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters

    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
}

/**
 * Verify if student is within allowed range
 */
export function verifyLocation(studentLat, studentLon, classLat, classLon, maxDistance) {
    const distance = calculateDistance(studentLat, studentLon, classLat, classLon);

    return {
        valid: distance <= maxDistance,
        distance: distance,
        maxDistance: maxDistance
    };
}

export default {
    calculateDistance,
    verifyLocation
};
