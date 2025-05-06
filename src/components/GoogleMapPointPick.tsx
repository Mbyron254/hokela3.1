'use client';

import React, { Dispatch, FC, SetStateAction } from 'react';

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { IPoint } from '@/lib/interface/point.interface';

export const GoogleMapPointPick: FC<{ setMarker: Dispatch<SetStateAction<IPoint | undefined>> }> = ({
  setMarker,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCb7XdethBGrjQlPoAZMHCU-2KDF5JfvPI',
  });

  const handleOnClick = (clickEvent: any) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();

    setMarker({ lat, lng });
  };

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '250px' }}
          center={{ lat: -1.2679966483358556, lng: 36.778462836409915 }}
          zoom={6}
          onClick={handleOnClick}
        ></GoogleMap>
      )}
    </>
  );
};
