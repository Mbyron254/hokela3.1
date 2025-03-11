import { useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const StyledMapContainer = styled('div')({
  height: '400px',
  width: '100%',
  borderRadius: '8px',
});

interface Shop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  approved: boolean;
  user?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

interface ShopLocationsMapProps {
  title?: string;
  subheader?: string;
  shops: Shop[];
}

export function ShopLocationsMap({ title, subheader, shops }: ShopLocationsMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize map only if it hasn't been initialized yet
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Add markers for shops
    if (mapRef.current && shops?.length > 0) {
      // Clear existing markers
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      // Add new markers
      const bounds = L.latLngBounds([]);
      
      shops.forEach((shop) => {
        if (shop.lat && shop.lng) {
          const marker = L.marker([shop.lat, shop.lng])
            .addTo(mapRef.current!)
            .bindPopup(`
              <b>${shop.name}</b><br>
              Owner: ${shop.user?.name || 'N/A'}<br>
              Category: ${shop.category?.name || 'N/A'}<br>
              Status: ${shop.approved ? 'Approved' : 'Pending'}
            `);
          
          bounds.extend([shop.lat, shop.lng]);
        }
      });

      // Fit map to show all markers
      // if (!bounds.isEmpty()) {
      //   mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      // }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [shops]);

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <StyledMapContainer ref={mapContainerRef} />
    </Card>
  );
} 