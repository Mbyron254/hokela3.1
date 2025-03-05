'use client';

import { useEffect } from 'react';

import Typography from '@mui/material/Typography';

import { GQLMutation } from 'src/lib/client';
import { SALES_GIVEAWAY_SURVEY } from 'src/lib/mutations/sales-giveaway.mutation';

// ----------------------------------------------------------------------

type Props = {
  campaignRunId?: string;
};

export default function SalesReport({ campaignRunId }: Props) {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY,
    resolver: 'salesGiveawaySurvey',
    toastmsg: false,
  });

  const loadSurvey = () => {
    if (campaignRunId) {
      getSurvey({ variables: { input: { campaignRunId } } });
    }
  };
  useEffect(() => {
    loadSurvey();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignRunId]);

  console.log('SURVEY', survey);
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
        Product Sales Dashboard
      </Typography>

      {/* Copy the rest of the JSX from TabPanel value="1" */}
    </>
  );
}
