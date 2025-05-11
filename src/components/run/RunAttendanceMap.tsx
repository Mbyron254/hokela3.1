'use client';

import { GQLMutation } from 'src/lib/client';
import { ICoordinate, IPolygon } from 'src/lib/interface/area.interface';
import { IPoint } from 'src/lib/interface/point.interface';
import { AREAS } from 'src/lib/mutations/area.mutation';
import { AGENTS_LATEST_CLOCK } from 'src/lib/mutations/clock.mutation';
import { POINTS } from 'src/lib/mutations/point.mutation';
import { Circle, GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { FC, useEffect, useState } from 'react';
import GoogleMarker from '../GoogleMarker';

export const RunAttendanceMap: FC<{
  run: any;
}> = ({ run }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyCb7XdethBGrjQlPoAZMHCU-2KDF5JfvPI',
  });
  const {
    action: getLatestClocks,
    loading: loadingLatestClocks,
    data: clocks,
  } = GQLMutation({
    mutation: AGENTS_LATEST_CLOCK,
    resolver: 'agentsLatestClocks',
    toastmsg: false,
  });
  const {
    action: getPoints,
    loading: loadingPoints,
    data: points,
  } = GQLMutation({
    mutation: POINTS,
    resolver: 'points',
    toastmsg: false,
  });
  const {
    action: getAreas,
    loading: loadingAreas,
    data: areas,
  } = GQLMutation({
    mutation: AREAS,
    resolver: 'areas',
    toastmsg: false,
  });

  const [filters, setFilters] = useState<{ dateStart?: Date; dateStop?: Date }>({
    dateStart: undefined,
    dateStop: undefined,
  });
  const [_locations, _setLocations] = useState<IPoint[]>([]);
  const [_points, _setPoints] = useState<{ lat: number; lng: number; radius: number }[]>([]);
  const [_polygons, _setPolygons] = useState<IPolygon[]>([]);

  useEffect(() => {
    if (run.id) {
      getAreas({ variables: { input: { runId: run.id } } });
      getPoints({ variables: { input: { runId: run.id } } });
    }
  }, [run.id, getAreas, getPoints]);
  useEffect(() => {
    if (run.id) {
      getLatestClocks({ variables: { input: { ...filters, runId: run.id } } });
    }
  }, [run.id, filters, getLatestClocks]);
  useEffect(() => {
    if (points) {
      points.rows.forEach((point: any) => {
        _setPoints((curr) => [...curr, { lat: point.shop.lat, lng: point.shop.lng, radius: point.radius }]);
      });
    }
  }, [points]);
  useEffect(() => {
    if (areas) {
      areas.rows.forEach((area: any) => {
        const coords: ICoordinate[] = [];

        for (let i = 0; i < area.coordinates.length; i+=1) {
          coords.push({
            lat: area.coordinates[i].lat,
            lng: area.coordinates[i].lng,
          });
        }

        _setPolygons((curr) => [...curr, { color: area.color, coords }]);
      });
    }
  }, [areas]);
  useEffect(() => {
    if (clocks) {
      const _locs: IPoint[] = [];

      for (let i = 0; i < clocks.length; i+=1) {
        _locs.push({ lat: clocks[i].lat, lng: clocks[i].lng });
      }

      _setLocations(_locs);
    }
  }, [clocks]);

  // Replace AdvancedMarkerElement with a valid Marker component
  const marker = <Marker position={{ lat: 37.42, lng: -122.1 }} label="Price Tag" />;

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-2">
            <p>From</p>
            <input
              className="form-control"
              id="dateStart"
              type="date"
              name="dateStart"
              defaultValue={filters.dateStart?.toString()}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateStart: e.target.value === '' ? undefined : new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-2">
            <p>To</p>
            <input
              className="form-control"
              id="dateStop"
              type="date"
              name="dateStop"
              defaultValue={filters.dateStop?.toString()}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateStop: e.target.value === '' ? undefined : new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={{ lat: -1.2679966483358556, lng: 36.778462836409915 }}
          zoom={5}
        >
          {_points.map((point, index) => (
            <Circle
              key={`point-${index}`}
              center={point}
              radius={point.radius}
              options={{
                strokeColor: '#4405ad',
                strokeWeight: 2,
                fillColor: '#6107f7',
                fillOpacity: 0.35,
              }}
            />
          ))}

          {_polygons.map((polygon, index) => (
            <Polygon
              key={`polygon-${index}`}
              path={polygon.coords}
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

          {_locations.map((location, index) => (
            <GoogleMarker key={`marker-${index}`} position={location}>
              <div className="row">
                <div className="col-12">Hello</div>
              </div>
            </GoogleMarker>
          ))}
        </GoogleMap>
      )}
    </>
  );
};
