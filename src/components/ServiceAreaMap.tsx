import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3RlcGhlbmhmaXNoYnVybiIsImEiOiJjbWppenpwZm8xdjMxM2hwc2szaHY4NGM4In0.wQOiDt0ksVfZqEirVEw1jw';

// Center: 2101 174th Street NE, Marysville, WA 98271
const CENTER_LNG = -122.1505;
const CENTER_LAT = 48.0519;
const RADIUS_MILES = 50;

// Convert miles to meters for the circle
const RADIUS_METERS = RADIUS_MILES * 1609.34;

// Generate circle coordinates for GeoJSON
function createCircleCoordinates(centerLng: number, centerLat: number, radiusMeters: number, points = 64) {
  const coords = [];
  const earthRadius = 6371000; // meters
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const latOffset = (radiusMeters / earthRadius) * Math.cos(angle) * (180 / Math.PI);
    const lngOffset = (radiusMeters / earthRadius) * Math.sin(angle) * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);
    coords.push([centerLng + lngOffset, centerLat + latOffset]);
  }
  
  return coords;
}

const ServiceAreaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [CENTER_LNG, CENTER_LAT],
      zoom: 7.5,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Disable scroll zoom for better UX while scrolling page
    map.current.scrollZoom.disable();

    // Add marker at center location
    new mapboxgl.Marker({ color: '#16a34a' })
      .setLngLat([CENTER_LNG, CENTER_LAT])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<strong>Skagit Junk Removal</strong><br/>2101 174th St NE<br/>Marysville, WA 98271'
        )
      )
      .addTo(map.current);

    // Add service area circle when map loads
    map.current.on('load', () => {
      if (!map.current) return;

      const circleCoordinates = createCircleCoordinates(CENTER_LNG, CENTER_LAT, RADIUS_METERS);

      map.current.addSource('service-area', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [circleCoordinates],
          },
        },
      });

      // Add fill layer
      map.current.addLayer({
        id: 'service-area-fill',
        type: 'fill',
        source: 'service-area',
        paint: {
          'fill-color': '#16a34a',
          'fill-opacity': 0.15,
        },
      });

      // Add border layer
      map.current.addLayer({
        id: 'service-area-border',
        type: 'line',
        source: 'service-area',
        paint: {
          'line-color': '#16a34a',
          'line-width': 2,
          'line-opacity': 0.8,
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden shadow-lg border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default ServiceAreaMap;
