'use client';

import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_SESSION_SELF, Q_SESSIONS } from 'src/lib/queries/session.query';
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

import { Q_CLIENTS_T1 } from 'src/lib/queries/client-t1.query';
import { Q_CLIENTS_T2_ACTIVE } from 'src/lib/queries/client-t2.query';
import { Q_SHOPS_ACTIVE } from 'src/lib/queries/shop.query';

import { dummySessions } from '../_mock/dashboard-data';
import { dummyShops } from '../_mock/dashboard-data';

// ----------------------------------------------------------------------

export function DashboardAnalyticsView() {
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

  const { data: allClients, loading: loadingClients } = GQLQuery({
    query: Q_CLIENTS_T1,
    queryAction: 'tier1Clients',
    variables: {
      input: {
        page: 0,
        pageSize: 1000  // Set this to a number larger than total clients
      }
    },
  });

  const { data: clientsActive, loading: loadingClientsActive } = GQLQuery({
    query: Q_CLIENTS_T2_ACTIVE,
    queryAction: 'tier2Clients',
    variables: { input: { page: 0, pageSize: 1000 } },
  });

  console.log('clientsActive:', clientsActive);
  console.log('allClients:', allClients);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: sessions } = GQLQuery({
    query: Q_SESSIONS,
    queryAction: 'sessions',
    variables: {
      input: {
        page,
        pageSize
      }
    }
  });

  console.log('sessions:', sessions);

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
        Hello, {session?.user?.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Active Sessions"
            percent={(dummySessions.rows.filter((session: any) => !session.locked).length / dummySessions.rows.length) * 100}
            total={dummySessions.rows.filter((session: any) => !session.locked).length}
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_buy.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tier 1 Clients"
            percent={(() => {
              if (!allClients?.rows?.length) return 0;
              const now = new Date();
              const thisMonth = now.getMonth();
              const thisYear = now.getFullYear();

              const clientsThisMonth = allClients.rows.filter((client: any) => {
                const createdDate = new Date(client.created);
                return createdDate.getMonth() === thisMonth &&
                  createdDate.getFullYear() === thisYear;
              });

              return (clientsThisMonth.length / allClients.rows.length) * 100;
            })()}
            total={allClients?.rows?.length}
            color="warning"
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_users.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>



        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tier 2 Clients"
            percent={(() => {
              if (!clientsActive?.rows?.length) return 0;
              const now = new Date();
              const thisMonth = now.getMonth();
              const thisYear = now.getFullYear();

              const clientsThisMonth = clientsActive.rows.filter((client: any) => {
                const createdDate = new Date(client.created);
                return createdDate.getMonth() === thisMonth &&
                  createdDate.getFullYear() === thisYear;
              });

              return (clientsThisMonth.length / clientsActive.rows.length) * 100;
            })()}
            total={clientsActive?.rows?.length}
            color="error"
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_users.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>


        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Shops"
            percent={(() => {
              if (!dummyShops?.rows?.length) return 0;
              const now = new Date();
              const thisMonth = now.getMonth();
              const thisYear = now.getFullYear();

              const shopsThisMonth = dummyShops.rows.filter((shop: any) => {
                const createdDate = new Date(shop.created);
                return createdDate.getMonth() === thisMonth &&
                  createdDate.getFullYear() === thisYear;
              });

              return (shopsThisMonth.length / dummyShops.rows.length) * 100;
            })()}
            total={dummyShops.rows.length}
            color="secondary"
            icon={<img alt="icon" src="\assets\icons\glass\ic_glass_buy.png" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
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
            title="Active Runs"
            runs={offers?.rows || []}
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
