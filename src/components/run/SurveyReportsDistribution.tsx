'use client';

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { M_AGENTS_REPORTS_DISTRIBUTION } from 'src/lib/mutations/analytics.mutation';
import { IPoint } from 'src/lib/interface/point.interface';
import { GoogleMapPoint } from '../GoogleMapPoint';
import { LoadingDiv } from '../LoadingDiv';

export const SurveyReportsDistribution: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getDistribution,
    loading: loadingDistribution,
    data: distribution,
  } = GQLMutation({
    mutation: M_AGENTS_REPORTS_DISTRIBUTION,
    resolver: 'surveyReportsDistribution',
    toastmsg: false,
  });

  const [distributions, setDistributions] = useState<IPoint[]>([]);


  useEffect(() => {
    if (runId) {
      getDistribution({ variables: { input: { runId } } });
    }
  }, [runId, getDistribution]);
  useEffect(() => {
    if (distribution) {
      const _distribution: IPoint[] = [];

      for (let i = 0; i < distribution.length; i+=1) {
        _distribution.push({ lat: distribution[i].lat, lng: distribution[i].lng });
      }
      setDistributions(_distribution);
    }
  }, [distribution]);

  return (
    <>
      {loadingDistribution && <LoadingDiv />}
      <GoogleMapPoint locations={distributions} />
    </>
  );
};
