'use client';

import { FC, useEffect, useState } from 'react';
import { GoogleMapPoint } from 'src/components/GoogleMapPoint';
import { GQLMutation } from 'src/lib/client';
import { M_AGENTS_LAST_LOCATION } from 'src/lib/mutations/analytics.mutation';
import { IPoint } from 'src/lib/interface/point.interface';
import { LoadingDiv } from 'src/components/LoadingDiv';

export const AgentsLocation: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getClocks,
    loading: loadingClocks,
    data: clocks,
  } = GQLMutation({
    mutation: M_AGENTS_LAST_LOCATION,
    resolver: 'agentsLastLocation',
    toastmsg: false,
  });

  const [locations, setLocations] = useState<IPoint[]>([]);

  useEffect(() => {
    if (runId) {
      getClocks({ variables: { input: { runId } } });
    }
  }, [runId, getClocks]);

  useEffect(() => {
    if (clocks) {
      const _locations: IPoint[] = [];

      for (let i = 0; i < clocks.length; i+=1) {
        _locations.push({ lat: clocks[i].lat, lng: clocks[i].lng });
      }
      setLocations(_locations);
    }
  }, [clocks]);

  return (
    <>
      {loadingClocks && <LoadingDiv />}
      <GoogleMapPoint locations={locations} />
    </>
  );
};
