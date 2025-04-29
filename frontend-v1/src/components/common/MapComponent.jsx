import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { loadLeafletCSS } from '../../services/mapService';

/**
 * A reusable map component using Leaflet and OpenStreetMap
 */
const MapComponent = ({
  center = [51.505, -0.09], // Default center (London)
  zoom = 13,
  markers = [],
  polyline = null,
  height = '400px',
  width = '100%',
  className = '',
  onMapClick = null,
  onMarkerClick = null
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Load Leaflet CSS
    loadLeafletCSS();

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Add click handler if provided
      if (onMapClick) {
        mapInstanceRef.current.on('click', (e) => {
          onMapClick(e.latlng);
        });
      }
    }

    // Clean up function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Update center and zoom when props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const { position, icon, title, popup } = marker;
      
      let markerIcon = null;
      
      if (icon) {
        markerIcon = L.icon({
          iconUrl: icon.url || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: icon.size || [25, 41],
          iconAnchor: icon.anchor || [12, 41],
          popupAnchor: icon.popupAnchor || [1, -34],
          shadowUrl: icon.shadowUrl || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          shadowSize: icon.shadowSize || [41, 41]
        });
      }
      
      const leafletMarker = L.marker(position, { title, icon: markerIcon })
        .addTo(mapInstanceRef.current);
      
      if (popup) {
        leafletMarker.bindPopup(popup);
      }
      
      if (onMarkerClick) {
        leafletMarker.on('click', () => {
          onMarkerClick(marker);
        });
      }
      
      markersRef.current.push(leafletMarker);
    });
  }, [markers, onMarkerClick]);

  // Update polyline when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing polylines
    mapInstanceRef.current.eachLayer(layer => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Marker)) {
        layer.remove();
      }
    });

    // Add new polyline if provided
    if (polyline && polyline.path && polyline.path.length > 0) {
      const { path, color = 'blue', weight = 3, opacity = 0.7 } = polyline;
      
      L.polyline(path, {
        color,
        weight,
        opacity
      }).addTo(mapInstanceRef.current);
      
      // Fit bounds to show the entire polyline
      mapInstanceRef.current.fitBounds(path);
    }
  }, [polyline]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width }} 
      className={`leaflet-map ${className}`}
    />
  );
};

export default MapComponent;
