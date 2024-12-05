'use client';

import { useEffect } from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_OPEN_JOBS } from 'src/lib/mutations/campaign-run.mutation';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _coursesContinue,
  _bookingsOverview,
  _analyticOrderTimeline,
} from 'src/_mock';

import { CourseContinue } from 'src/sections/course/course-continue';

import { AnalyticsNews } from '../analytics-news';
import { BookingBooked } from '../booking-booked';
import { AnalyticsTasks } from '../analytics-tasks';
import { BookingTotalIncomes } from '../booking-total-incomes';
import { BookingCheckInWidgets } from '../booking-check-in-widgets';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const { action: getOffers, data: offers } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFERS,
    resolver: 'm_campaignRunOffers',
    toastmsg: false,
  });
  const { action: getJobs, data: jobs } = GQLMutation({
    mutation: M_OPEN_JOBS,
    resolver: 'openJobs',
    toastmsg: false,
  });

  const loadRunsActive = (page?: number, pageSize?: number) => {
    getJobs({ variables: { input: { page, pageSize } } });
  };

  const loadOffers = () => {
    if (session?.user?.agent?.id) {
      getOffers({
        variables: {
          input: { agentId: session.user.agent.id },
        },
      });
    }
  };

  useEffect(
    () => loadOffers(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.user?.agent?.id]
  );
  useEffect(
    () => loadRunsActive(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  console.log(offers, 'offers');
  console.log(session, 'session');
  console.log('JOBS  ', jobs);
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Weekly sales"
            percent={2.6}
            total={714000}
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_buy.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_users.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Purchase orders"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_buy.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_message.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {/* <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          /> */}
          <CourseContinue
            title="Continue With Active Runs"
            runs={[
              {
                id: '1',
                index: 1,
                created: '2024-01-15',
                agent: {
                  user: {
                    name: 'John Doe',
                    profile: {
                      photo: null,
                      __typename: 'TUserProfile',
                    },
                    __typename: 'TUser',
                  },
                  __typename: 'TAgent',
                },
                campaignRun: {
                  id: 'cr1',
                  code: 'CR001',
                  project: {
                    name: 'Project Alpha',
                    __typename: 'TProject',
                  },
                  campaign: {
                    name: 'Sales Campaign 2024',
                    clientTier2: {
                      name: 'Tier 2 Client',
                      clientTier1: {
                        name: 'Tier 1 Client',
                        __typename: 'TClientTier1',
                      },
                      __typename: 'TClientTier2',
                    },
                    __typename: 'TCampaign',
                  },
                  __typename: 'TCampaignRun',
                },
                __typename: 'TCampaignRunOffer',
              },
            ]}
            list={_coursesContinue}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Acitivities"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Sales', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Reports', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {/* <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          /> */}
          <Box
            sx={{
              mb: 3,
              p: { md: 1 },
              display: 'flex',
              gap: { xs: 3, md: 1 },
              borderRadius: { md: 2 },
              flexDirection: 'column',
              bgcolor: { md: 'background.neutral' },
            }}
          >
            <Box
              sx={{
                p: { md: 1 },
                display: 'grid',
                gap: { xs: 3, md: 0 },
                borderRadius: { md: 2 },
                bgcolor: { md: 'background.paper' },
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
              }}
            >
              <BookingTotalIncomes
                title="Total incomes"
                total={18765}
                percent={2.6}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  series: [{ data: [10, 41, 80, 100, 60, 120, 69, 91, 160] }],
                }}
              />

              <BookingBooked
                title="Campaign"
                data={_bookingsOverview}
                sx={{ boxShadow: { md: 'none' } }}
              />
            </Box>

            <BookingCheckInWidgets
              chart={{
                series: [
                  { label: 'Sold', percent: 73.9, total: 38566 },
                  { label: 'Pending for payment', percent: 45.6, total: 18472 },
                ],
              }}
              sx={{ boxShadow: { md: 'none' } }}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_analyticOrderTimeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_analyticTraffic} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
