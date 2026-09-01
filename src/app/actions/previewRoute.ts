'use server';

import { GoogleRouteProvider } from '@/lib/providers/RouteProvider';
import { RouteData, Coordinates } from '@/types';

export async function getRoutePreview(originStr: string, destStr: string) {
  if (!originStr || !destStr) return null;

  try {
    const provider = new GoogleRouteProvider();
    
    // 1. Geocode locations
    const originCoords = await provider.geocode(originStr);
    const destCoords = await provider.geocode(destStr);
    
    // 2. Fetch routes
    const routes = await provider.getRoutes(originCoords, destCoords);
    
    // Return payload
    return {
      origin: { lat: originCoords.lat, lng: originCoords.lng, name: originCoords.formattedAddress || originStr },
      destination: { lat: destCoords.lat, lng: destCoords.lng, name: destCoords.formattedAddress || destStr },
      routes
    };
  } catch (error) {
    console.error('Failed to fetch route preview:', error);
    return null;
  }
}
