import { RouteData, Coordinates } from '@/types';

export interface RouteProvider {
  getRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteData[]>;
  geocode(address: string): Promise<Coordinates & { formattedAddress: string }>;
  reverseGeocode(coords: Coordinates): Promise<string>;
}

export class GoogleRouteProvider implements RouteProvider {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  private offlineCoordinate(address: string): Coordinates & { formattedAddress: string } {
    const known: Record<string, Coordinates & { formattedAddress: string }> = {
      ahmedabad: { lat: 23.0225, lng: 72.5714, formattedAddress: 'Ahmedabad, Gujarat, India' },
      delhi: { lat: 28.6139, lng: 77.209, formattedAddress: 'New Delhi, India' },
      chandigarh: { lat: 30.7333, lng: 76.7794, formattedAddress: 'Chandigarh, India' },
      mandi: { lat: 31.708, lng: 76.932, formattedAddress: 'Mandi, Himachal Pradesh, India' },
      manali: { lat: 32.2396, lng: 77.1887, formattedAddress: 'Manali, Himachal Pradesh, India' },
      kullu: { lat: 31.9579, lng: 77.1095, formattedAddress: 'Kullu, Himachal Pradesh, India' },
      shimla: { lat: 31.1048, lng: 77.1734, formattedAddress: 'Shimla, Himachal Pradesh, India' },
      udaipur: { lat: 24.5854, lng: 73.7125, formattedAddress: 'Udaipur, Rajasthan, India' },
    };
    const key = Object.keys(known).find((name) => address.toLowerCase().includes(name));
    if (key) return known[key];

    const hash = Array.from(address).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return {
      lat: 20 + (hash % 1500) / 100,
      lng: 72 + ((hash * 7) % 1800) / 100,
      formattedAddress: address.trim(),
    };
  }

  async geocode(address: string): Promise<Coordinates & { formattedAddress: string }> {
    if (!this.apiKey) return this.offlineCoordinate(address);
    const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
        };
      }
      console.warn(`Geocoding API failed (${data.status}). Using offline estimate for "${address}".`);
    } catch {
      console.warn(`Geocoding fetch failed. Using offline estimate for "${address}".`);
    }
    return this.offlineCoordinate(address);
  }

  async reverseGeocode(coords: Coordinates): Promise<string> {
    if (!this.apiKey) return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    const url = `${this.baseUrl}/geocode/json?latlng=${coords.lat},${coords.lng}&key=${this.apiKey}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  }

  async getRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteData[]> {
    if (!this.apiKey) return this.getOfflineRoutes(origin, destination);
    const url = `${this.baseUrl}/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=true&key=${this.apiKey}`;
    
    let data;
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch (e) {
      data = { status: 'FETCH_ERROR', routes: [] };
    }

    if (data.status !== 'OK' || !data.routes || !data.routes.length) {
      console.warn(`Routing API failed (${data.status}). Using an offline route estimate.`);
      return this.getOfflineRoutes(origin, destination);
    }

    return data.routes.map((route: { overview_polyline: { points: string }; legs: Array<{ distance: { value: number }; duration: { value: number } }>; summary?: string }, index: number): RouteData => {
      // Decode Google's overview_polyline
      const coordinates = this.decodePolyline(route.overview_polyline.points);
      
      const distance = route.legs[0].distance.value; // meters
      const duration = route.legs[0].duration.value; // seconds

      // Sample 5 waypoints from the coordinates
      const waypoints = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const idx = Math.min(Math.floor(pct * coordinates.length), coordinates.length - 1);
        return { coordinates: { lat: coordinates[idx][1], lng: coordinates[idx][0] } };
      });

      return {
        id: `google_route_${index}_${Date.now()}`,
        isPrimary: index === 0,
        distance,
        duration,
        summary: route.summary || (index === 0 ? 'Primary Route' : `Alternative Route ${index}`),
        geometry: {
          type: 'LineString',
          coordinates,
        },
        waypoints,
      };
    });
  }

  private getOfflineRoutes(origin: Coordinates, destination: Coordinates): RouteData[] {
    const midpoint: [number, number] = [
      (origin.lng + destination.lng) / 2,
      (origin.lat + destination.lat) / 2,
    ];
    const latOffset = Math.max(0.35, Math.abs(destination.lat - origin.lat) * 0.12);
    const lngOffset = Math.max(0.25, Math.abs(destination.lng - origin.lng) * 0.08);
    const direct: [number, number][] = [
      [origin.lng, origin.lat],
      [midpoint[0] - lngOffset, midpoint[1] - latOffset],
      [midpoint[0] + lngOffset, midpoint[1] + latOffset],
      [destination.lng, destination.lat],
    ];
    const detour: [number, number][] = [
      [origin.lng, origin.lat],
      [midpoint[0] + lngOffset, midpoint[1] - latOffset],
      [midpoint[0] - lngOffset, midpoint[1] + latOffset],
      [destination.lng, destination.lat],
    ];
    const distance = Math.max(1000, this.haversineKm(origin, destination) * 1000 * 1.12);
    const makeRoute = (id: string, geometry: [number, number][], multiplier: number, isPrimary: boolean, summary: string): RouteData => ({
      id,
      isPrimary,
      distance: distance * multiplier,
      duration: Math.round((distance * multiplier / 1000 / 55) * 3600),
      summary,
      geometry: { type: 'LineString', coordinates: geometry },
      waypoints: geometry.slice(1, -1).map(([lng, lat]) => ({ coordinates: { lat, lng } })),
      warnings: ['Route estimated locally because a live routing provider is not configured.'],
    });
    return [
      makeRoute('offline-primary', direct, 1, true, 'Estimated direct route'),
      makeRoute('offline-alternative', detour, 1.08, false, 'Estimated alternative route'),
    ];
  }

  private haversineKm(a: Coordinates, b: Coordinates) {
    const rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad;
    const dLng = (b.lng - a.lng) * rad;
    const lat1 = a.lat * rad;
    const lat2 = b.lat * rad;
    const value = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  // Decodes Google's encoded polyline format to GeoJSON [lng, lat]
  private decodePolyline(encoded: string): [number, number][] {
    const poly: [number, number][] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      // GeoJSON format is [longitude, latitude]
      poly.push([lng / 1e5, lat / 1e5]);
    }
    return poly;
  }
}
