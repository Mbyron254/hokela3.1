'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { formatDate, formatTimeTo12Hr } from 'src/lib/helpers';
import { ICampaignRunCreate, ICampaignRunUpdate } from 'src/lib/interface/campaign.interface';
import { M_CAMPAIGN } from 'src/lib/mutations/campaign.mutation';
import { useBoolean } from 'src/hooks/use-boolean';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';

export default function Page({ params: { id } }: any) {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const { action: getCampaign, data: campaign } = GQLMutation({
    mutation: M_CAMPAIGN,
    resolver: 'm_campaign',
    toastmsg: false,
  });

  const dialog = useBoolean();
  const [inputCreate, setInputCreate] = useState<ICampaignRunCreate>({
    managerId: undefined,
    runTypeId: undefined,
    dateStart: undefined,
    dateStop: undefined,
    closeAdvertOn: undefined,
  });

  useEffect(() => {
    if (id) getCampaign({ variables: { input: { id } } });
  }, [id]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {campaign?.name}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Created:</Typography>
          <Typography variant="body2">{campaign?.created}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Runs:</Typography>
          <Typography variant="body2">{campaign?.runs?.length}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Job Description:</Typography>
          <Typography variant="body2">{campaign?.jobDescription}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Job Qualifications:</Typography>
          <Typography variant="body2">{campaign?.jobQualification}</Typography>
        </Grid>
      </Grid>
      <Button
        onClick={() => dialog.onTrue()}
        variant="contained"
        sx={{ mt: 3 }}
      >
        New Run
      </Button>
    </Box>
  );
}
