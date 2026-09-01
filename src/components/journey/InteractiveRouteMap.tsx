'use client';

import { useEffect, useRef, useState } from 'react';
import { NormalizedHazard, RouteData, CommunityReportData, RiskLevel } from '@/types';

interface InteractiveRouteMapProps {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  routes: RouteData[];
  hazards: NormalizedHazard[];
  communityReports: CommunityReportData[];
  primaryRisk: RiskLevel;
  className?: string;
}

const ROUTE_COLORS: Record<RiskLevel, string> = {
  LOW: '#2d5a3f', // Forest green
  MODERATE: '#d97706',
  HIGH: '#dc2626',
  CRITICAL: '#991b1b',
};

export default function InteractiveRouteMap({
  origin,
  destination,
  routes,
  hazards,
  communityReports,
  primaryRisk,
  className = '',
}: InteractiveRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      if (isMounted) setError('Map Visualization Disabled. Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
      return;
    }

    async function initMap() {
      try {
        if (!window.google?.maps) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,geometry&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
          });
        }
        
        if (!isMounted || !mapRef.current) return;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const google = (window as any).google;
        const { Map, Marker, Polyline, LatLngBounds } = google.maps;

        const centerLat = (origin.lat + destination.lat) / 2;
        const centerLng = (origin.lng + destination.lng) / 2;

        const map = new Map(mapRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 8,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: '#f8f9fa',
        });

        const bounds = new LatLngBounds();
        bounds.extend(origin);
        bounds.extend(destination);

        // Draw Routes
        if (Array.isArray(routes)) {
          routes.forEach((route) => {
            const isPrimary = route.isPrimary;
            const riskColor = isPrimary ? ROUTE_COLORS[primaryRisk] : '#94a3b8'; // gray for alternatives
            
            // Safe coordinates parsing
            let coords: number[][] = [];
            if (route?.geometry?.coordinates && Array.isArray(route.geometry.coordinates)) {
              coords = route.geometry.coordinates;
            } else if (typeof route?.geometry === 'string') {
              try {
                const parsed = JSON.parse(route.geometry);
                coords = parsed.coordinates || [];
              } catch (e) {}
            }

            if (coords.length > 0) {
              // GeoJSON is [lng, lat]
              const path = coords.map((c: number[]) => ({
                lat: c[1],
                lng: c[0],
              }));
              
              path.forEach((p: any) => bounds.extend(p));

              new Polyline({
                path,
                map,
                strokeColor: riskColor,
                strokeOpacity: isPrimary ? 0.9 : 0.4,
                strokeWeight: isPrimary ? 5 : 3,
                zIndex: isPrimary ? 10 : 1,
              });
            }
          });
        }

        // Origin Marker
        new Marker({
          map,
          position: origin,
          title: origin.name,
          label: 'A'
        });

        // Destination Marker
        new Marker({
          map,
          position: destination,
          title: destination.name,
          label: 'B'
        });

        // Hazard Markers
        if (Array.isArray(hazards)) {
          hazards.forEach((hazard) => {
            new Marker({
              map,
              position: hazard.coordinates,
              title: hazard.type.replace(/_/g, ' '),
              label: '⚠️'
            });
          });
        }

        map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });

      } catch (err: any) {
        console.error('Map initialization failed:', err);
        if (isMounted) setError(`Map Visualization Failed: ${err.message || 'Unknown error'}. Make sure Maps JavaScript API is enabled for your key.`);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [origin, destination, routes, hazards, communityReports, primaryRisk]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-surface-2 border border-border rounded-2xl p-6 text-center ${className}`}>
        <div>
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-900 font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Please add your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file to enable the real-time Google Maps experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-border ${className}`}>
      <div ref={mapRef} className="w-full h-full bg-[#f8f9fa]" />
    </div>
  );
}
