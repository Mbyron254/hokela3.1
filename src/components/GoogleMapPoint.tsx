'use client';

import React, { useCallback, useState } from 'react';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { IPoint } from '@/lib/interface/point.interface';

export const GoogleMapPoint = ({ locations }: { locations: IPoint[] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCb7XdethBGrjQlPoAZMHCU-2KDF5JfvPI',
  });

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={{ lat: -1.2679966483358556, lng: 36.778462836409915 }}
          zoom={6}
          // onLoad={onLoad}
          // onUnmount={onUnmount}
        >
          {locations.map((location, index) => (
            <Marker key={`location-${index}`} position={location} />
          ))}
        </GoogleMap>
      )}
    </>
  );
};

/*

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(centerPoint);
    map.fitBounds(bounds);
    setMap(map);
  }, []);
  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

*/
