'use client';

import { useState, useEffect } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/campaign-run-application.mutation';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AppAreaInstalled } from 'src/sections/admin/overview/app/app-area-installed';
import { AppWidgetSummary } from 'src/sections/admin/overview/app/app-widget-summary';
import { AppCurrentDownload } from 'src/sections/admin/overview/app/app-current-download';
import { paths } from 'src/routes/paths';
import { CircularProgress, Grid } from '@mui/material';

export default function JobsDashboardPage() {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const {
    action: getApplications,
    loading: loadingApplications,
    data: applicationsData,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_APPLICATIONS,
    resolver: 'm_campaignRunApplications',
    toastmsg: false,
  });

  const {
    action: getOffers,
    loading: loadingOffers,
    data: offersData,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFERS,
    resolver: 'm_campaignRunOffers',
    toastmsg: false,
  });

  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      getApplications({
        variables: {
          input: { clientTier1Id: session.user.role.clientTier1.id },
        },
      });
      getOffers({
        variables: {
          input: { clientTier1Id: session.user.role.clientTier1.id },
        },
      });
    }
  }, [session, getApplications, getOffers]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Jobs Dashboard"
        links={[
          { name: 'Dashboard', href: paths.v2.marketing.root },
          { name: 'Jobs' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {loadingApplications || loadingOffers ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total Applications"
              percent={0} // Placeholder for percentage change
              total={applicationsData?.count}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: applicationsData?.rows.map((row: any) => row.index), // Example series data
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total Offers"
              percent={0} // Placeholder for percentage change
              total={offersData?.count}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: offersData?.rows.map((row: any) => row.index), // Example series data
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Current Job Openings"
              subheader="Openings by department"
              chart={{
                series: applicationsData?.rows.map((row: any) => ({
                  label: row.campaignRun.project.name,
                  value: row.index,
                })),
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Job Applications by Region"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                series: applicationsData?.rows.map((row: any) => ({
                  name: row.campaignRun.campaign.clientTier2.name,
                  data: [row.index], // Example data
                })),
              }}
            />
          </Grid>
        </Grid>
      )}
    </DashboardContent>
  );
} 