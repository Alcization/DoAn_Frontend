/**
 * Decodes an encoded polyline string into an array of [lng, lat] coordinates.
 * This implementation follows the standard Google Polyline algorithm (precision 5).
 * 
 * @param encoded - The encoded polyline string.
 * @param precision - The precision multiplier (default is 5, meaning 1e5).
 * @returns An array of [number, number] coordinates.
 */
export function decodePolyline(encoded: string, precision: number = 5): [number, number][] {
    const factor = Math.pow(10, precision);
    const coordinates: [number, number][] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
        let byte;
        let shift = 0;
        let result = 0;

        // Decode latitude
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += deltaLat;

        // Decode longitude
        shift = 0;
        result = 0;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += deltaLng;

        // Store [lng, lat] for GeoJSON compatibility
        coordinates.push([lng / factor, lat / factor]);
    }

    return coordinates;
}
