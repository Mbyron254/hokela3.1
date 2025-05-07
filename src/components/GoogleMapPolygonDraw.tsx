'use client';

import { IPoint } from '@/lib/interface/point.interface';
import { GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { Dispatch, FC, SetStateAction } from 'react';

export const GoogleMapPolygonDraw: FC<{
  color: string;
  polygonPaths: IPoint[];
  setPolygonPaths: Dispatch<SetStateAction<IPoint[]>>;
}> = ({ color, polygonPaths, setPolygonPaths }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCb7XdethBGrjQlPoAZMHCU-2KDF5JfvPI',
  });

  const handlePointSelect = (clickEvent: any) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();

    setPolygonPaths((_paths) => [..._paths, { lat, lng }]);
  };

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '300px' }}
          center={{ lat: -1.2679966483358556, lng: 36.778462836409915 }}
          zoom={10}
          onClick={handlePointSelect}
        >
          <Polygon
            path={polygonPaths}
            key={1}
            editable={true}
            options={{
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.35,
            }}
          />
        </GoogleMap>
      )}
    </>
  );
};
