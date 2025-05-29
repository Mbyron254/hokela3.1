'use client';

import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { GQLQuery } from 'src/lib/client';
import { M_DASHBOARD_AGENCY_ENTITIES } from 'src/lib/queries/dashboard-agency.query';
import { Card, CardContent, Grid, Typography } from '@mui/material';

export default function Page() {
  const { loading: loadingAnalytics, data: analytics } = GQLQuery({
    query: M_DASHBOARD_AGENCY_ENTITIES,
    queryAction: 'dashboardAgencyEntities',
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="Marketing Dashboard"
        links={[
          { name: 'Marketing', href: '/marketing' },
          { name: 'Dashboard' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" color="text.secondary" gutterBottom>
                Clients
              </Typography>
              <Typography variant="h3" component="div">
                {analytics?.clients?.total}
              </Typography>
              <Typography color="text.secondary">
                <span
                  style={{
                    color:
                      analytics?.clients?.percentageGrowth === 0
                        ? 'info'
                        : analytics?.clients?.percentageGrowth > 0
                        ? 'green'
                        : 'red',
                  }}
                >
                  {analytics?.clients?.percentageGrowth}%
                </span>
                <span> This month</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" color="text.secondary" gutterBottom>
                Projects
              </Typography>
              <Typography variant="h3" component="div">
                {analytics?.projects?.total}
              </Typography>
              <Typography color="text.secondary">
                <span
                  style={{
                    color:
                      analytics?.projects?.percentageGrowth === 0
                        ? 'info'
                        : analytics?.projects?.percentageGrowth > 0
                        ? 'green'
                        : 'red',
                  }}
                >
                  {analytics?.projects?.percentageGrowth}%
                </span>
                <span> This month</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" color="text.secondary" gutterBottom>
                Campaigns
              </Typography>
              <Typography variant="h3" component="div">
                {analytics?.campaigns?.total}
              </Typography>
              <Typography color="text.secondary">
                <span
                  style={{
                    color:
                      analytics?.campaigns?.percentageGrowth === 0
                        ? 'info'
                        : analytics?.campaigns?.percentageGrowth > 0
                        ? 'green'
                        : 'red',
                  }}
                >
                  {analytics?.campaigns?.percentageGrowth}%
                </span>
                <span> This month</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" color="text.secondary" gutterBottom>
                Users
              </Typography>
              <Typography variant="h3" component="div">
                {analytics?.users?.total}
              </Typography>
              <Typography color="text.secondary">
                <span
                  style={{
                    color:
                      analytics?.users?.percentageGrowth === 0
                        ? 'info'
                        : analytics?.users?.percentageGrowth > 0
                        ? 'green'
                        : 'red',
                  }}
                >
                  {analytics?.users?.percentageGrowth}%
                </span>
                <span> This month</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
