'use client';

import React, { useEffect, useCallback } from 'react';
// import { useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { M_OPEN_JOBS } from 'src/lib/mutations/run.mutation';
import { formatDate } from 'src/lib/helpers';
import { sourceImage } from 'src/lib/server';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const JobListView = () => {
  const { action: getJobs, data: runs } = GQLMutation({
    mutation: M_OPEN_JOBS,
    resolver: 'openJobs',
    toastmsg: false,
  });

  const loadRunsActive = useCallback((page?: number, pageSize?: number) => {
    getJobs({ variables: { input: { page, pageSize } } });
  }, [getJobs]);

  useEffect(() => {
    loadRunsActive();
  }, [loadRunsActive]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Janta"
        links={[
          { name: 'Agent', href: paths.v2.agent.root },
          { name: 'Janta', href: paths.v2.agent.janta.root },
        ]}
      />

      <Grid container spacing={3}>
        {runs?.rows?.map((run: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={sourceImage(run.poster?.fileName)}
                alt={run.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  <a href={`/agent/janta/${run.id}`}>{run.name}</a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <i className="mdi mdi-google-my-business text-muted me-2"/>
                  <b>{run?.campaign?.project?.clientTier2?.clientTier1?.name}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{
                  __html: `${(run.campaign?.jobDescription || '').substr(0, 100)}...`,
                }} />
                <Typography variant="body2" color="text.secondary">
                  <i className="mdi mdi-calendar-remove-outline text-muted me-2"/>
                  <b>Deadline:</b> <span className="text-warning">{formatDate(run.closeAdvertOn)}</span>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={`/agent/janta/${run.id}`}
                >
                  Read and Apply
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
};

export default JobListView;
