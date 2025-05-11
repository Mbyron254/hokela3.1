'use client';

import React, { FC } from 'react';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { IPolygon } from 'src/lib/interface/area.interface';

export const GoogleMapArea: FC<{ polygons: IPolygon[] }> = ({ polygons }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCb7XdethBGrjQlPoAZMHCU-2KDF5JfvPI',
  });

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={{ lat: -1.2253188192154545, lng: 36.88560598934668 }}
          zoom={13}
          // onLoad={onLoad}
          // onUnmount={onUnmount}
        >
          {polygons.map((polygon: any, index: number) => (
            <Polygon
              key={`polygon-${index}`}
              paths={polygon.coords}
              editable={false}
              options={{
                strokeColor: polygon.color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: polygon.color,
                fillOpacity: 0.35,
              }}
            />
          ))}
        </GoogleMap>
      )}
    </>
  );
};

// const [map, setMap] = useState(null);

// const onLoad = useCallback(function callback(map: any) {
//   const bounds = new window.google.maps.LatLngBounds(centerPoint);
//   map.fitBounds(bounds);
//   setMap(map);
// }, []);
// const onUnmount = useCallback(function callback(map: any) {
//   setMap(null);
// }, []);
