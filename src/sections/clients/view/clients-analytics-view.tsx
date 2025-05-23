'use client';

import type { IGeoLocation } from 'src/lib/interface/general.interface';

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _coursesContinue } from 'src/_mock';
import { getGeoLocation } from 'src/lib/helpers';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { LOCATION_PING_INTERVAL_MS } from 'src/lib/constant';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_JANTAS } from 'src/lib/mutations/run-offer.mutation';
// import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';

import { Iconify } from 'src/components/iconify';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// import { CampaignContinue } from '../campaign-continue';
// import { AnalyticsWebsiteVisits } from '../analytics-website-visits';

// ----------------------------------------------------------------------

export function ClientsAnalyticsView() {
  //  get session data

  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  //  load offers
  const {
    action: getOffers,
    loading: loadingJanta,
    data: offers,
  } = GQLMutation({
    mutation: M_JANTAS,
    resolver: 'jantas',
    toastmsg: false,
  });

  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();

  const loadJantas = () => {
    if (session?.user?.agent?.id) {
      getOffers({
        variables: {
          input: { agentId: session.user.agent.id },
        },
      });
    }
  };

  useEffect(
    () => loadJantas(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.user?.agent?.id]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      getGeoLocation(setGeoLocation);
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  console.log(offers, 'offers');
  console.log(geoLocation, 'geoLocation');
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>
      {(!offers?.rows?.length || !geoLocation?.lat || !geoLocation?.lng) && (
        <div className="alert alert-secondary pb-0" role="alert">
          <ol className="font-12">
            <li>
              <i
                className={`mdi me-2 mdi-${
                  geoLocation?.lat && geoLocation?.lng
                    ? 'check-decagram text-success'
                    : 'cancel text-danger'
                }`}
              />
              {geoLocation?.lat && geoLocation?.lng
                ? 'Confirmed your location.'
                : 'Confirming your location. Please wait...'}
            </li>
            <li>
              <i
                className={`mdi me-2 mdi-${
                  offers?.rows?.length ? 'check-decagram text-success' : 'cancel text-danger'
                }`}
              />
              {loadingJanta
                ? 'Loading my campaigns...'
                : !offers?.rows?.length
                  ? 'You have not been offered any campaigns to participate in. Apply with Janta or check back later'
                  : 'Loaded your campaigns.'}
            </li>
          </ol>
        </div>
      )}
      <Grid container spacing={2}>
        <Grid xs={3} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Campaigns"
            percent={-0.1}
            total={offers?.rows?.length ?? 0}
            color="secondary"
            icon={<Iconify icon="fluent-color:megaphone-loud-32" width="48px" height="48px" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={3} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Active Campaigns"
            percent={2.6}
            total={offers?.rows?.length ?? 0}
            icon={<Iconify icon="fluent-color:data-pie-24" width="48px" height="48px" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={3} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Completed Runs"
            percent={2.8}
            total={offers?.rows?.length ?? 0}
            color="warning"
            icon={<Iconify icon="fluent-color:clipboard-text-edit-24" width="48px" height="48px" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={3} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Run Length (Days)"
            percent={3.6}
            total={offers?.rows?.length ?? 0}
            color="error"
            icon={<Iconify icon="fluent-color:gift-card-24" width="48px" height="48px" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* <Grid xs={12}>
          <CampaignContinue
            title="Continue With Active Runs"
            runs={offers?.rows || []}
            list={_coursesContinue}
          />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
