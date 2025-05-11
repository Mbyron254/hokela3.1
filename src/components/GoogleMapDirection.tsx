'use client';

import React, { FC, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { IPoint } from 'src/lib/interface/point.interface';

const cssMapContainer = {
  width: '100%',
  height: '400px',
};
const centerPoint = {
  lat: -1.267449546541249,
  lng: 36.77878416655665,
};

export const GoogleMapDirection: FC<{
  routes: { origin: IPoint; destination: IPoint; travelMode: string }[];
}> = ({ routes }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCb7XdethBGrjQlPoAZMHCU-2KDF5JfvPI',
  });

  const [directions, setDirections] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);

        const route = response.routes[0].legs[0];

        setTravelTime(route.duration.text);
      } else {
        console.log('------------------ GErr -----------------');
        console.error(`Directions request failed due to ${response.status}`);
      }
    }
  };

  return (
    <>
      {isLoaded && (
        <>
          {travelTime && (
            <h5 className="">
              Estimated travel time: <span className="text-success">{travelTime}</span>
            </h5>
          )}
          <GoogleMap
            mapContainerStyle={cssMapContainer}
            center={centerPoint}
            zoom={5}>
            {routes?.map((route: any, index: number) => (
              <div key={`direction-${index}`}>
                <Marker position={route.origin} options={{ clickable: false, label: 'START' }} />
                <Marker position={route.destination} options={{ clickable: false, label: 'STOP' }} />

                <DirectionsService options={{ ...route }} callback={directionsCallback} />

                {directions && (
                  <DirectionsRenderer
                    options={{
                      directions,
                    }}
                  />
                )}
              </div>
            ))}
          </GoogleMap>
        </>
      )}
    </>
  );
};