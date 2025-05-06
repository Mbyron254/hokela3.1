'use client';

import { FC, useEffect, useState } from 'react';
import { GoogleMapPoint } from '../GoogleMapPoint';
import { GQLMutation } from '@/lib/client';
import { M_AGENTS_REPORTS_DISTRIBUTION } from '@/lib/mutations/analytics.mutation';
import { IPoint } from '@/lib/interface/point.interface';
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

  const loadReportsDistribution = () => {
    if (runId) {
      getDistribution({ variables: { input: { runId } } });
    }
  };

  useEffect(() => loadReportsDistribution(), []);
  useEffect(() => {
    if (distribution) {
      const _distribution: IPoint[] = [];

      for (let i = 0; i < distribution.length; i++) {
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
