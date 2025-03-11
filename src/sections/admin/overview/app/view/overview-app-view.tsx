'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { AppTopInstalledCountries } from '../app-top-installed-countries';
import { Q_SESSIONS } from 'src/lib/queries/session.query';
import { GQLMutation } from 'src/lib/client';
import { GQLQuery } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';
import { M_OPEN_JOBS } from 'src/lib/mutations/campaign-run.mutation';
import { Q_CLIENTS_T1 } from 'src/lib/queries/client-t1.query';
import { Q_CLIENTS_T2_ACTIVE } from 'src/lib/queries/client-t2.query';
import { Q_SHOPS_ACTIVE } from 'src/lib/queries/shop.query';
import { Q_SHOPS_RECYCLED } from 'src/lib/queries/shop.query';
import { useState } from 'react';
import { ShopLocationsMap } from '../shop-locations-map';

// Add these dummy data constants after imports
const DUMMY_SHOPS = [
  {
    id: '1',
    name: 'Nairobi Central Market',
    lat: -1.2921,
    lng: 36.8219,
    approved: true,
    user: { name: 'John Kamau' },
    category: { name: 'Market' }
  },
  {
    id: '2',
    name: 'Mombasa Beach Shop',
    lat: -4.0435,
    lng: 39.6682,
    approved: true,
    user: { name: 'Sarah Omar' },
    category: { name: 'Retail' }
  },
  {
    id: '3',
    name: 'Kisumu Lake Market',
    lat: -0.1022,
    lng: 34.7617,
    approved: true,
    user: { name: 'Michael Ochieng' },
    category: { name: 'Market' }
  },
  {
    id: '4',
    name: 'Dar es Salaam Central',
    lat: -6.7924,
    lng: 39.2083,
    approved: true,
    user: { name: 'Hassan Mohamed' },
    category: { name: 'Retail' }
  },
  {
    id: '5',
    name: 'Kampala City Mall',
    lat: 0.3476,
    lng: 32.5825,
    approved: true,
    user: { name: 'David Mukasa' },
    category: { name: 'Mall' }
  },
  {
    id: '6',
    name: 'Addis Merkato',
    lat: 9.0342,
    lng: 38.7497,
    approved: true,
    user: { name: 'Abebe Bekele' },
    category: { name: 'Market' }
  },
  {
    id: '7',
    name: 'Kigali Heights',
    lat: -1.9437,
    lng: 30.0594,
    approved: true,
    user: { name: 'Marie Uwase' },
    category: { name: 'Mall' }
  },
  {
    id: '8',
    name: 'Arusha Craft Market',
    lat: -3.3869,
    lng: 36.6830,
    approved: false,
    user: { name: 'James Mollel' },
    category: { name: 'Craft' }
  }
];

// Add dummy session data
const DUMMY_SESSIONS = {
  total: 156,
  items: [
    { count: 45, locked: false, expires: '2024-04-10' },
    { count: 38, locked: true, expires: '2024-04-09' },
    { count: 52, locked: false, expires: '2024-04-11' },
    { count: 21, locked: true, expires: '2024-04-08' },
    { count: 35, locked: false, expires: '2024-04-12' },
    { count: 42, locked: true, expires: '2024-04-13' },
    { count: 28, locked: false, expires: '2024-04-14' },
    { count: 31, locked: true, expires: '2024-04-15' },
  ]
};

// Add dummy client data
const DUMMY_CLIENTS = {
  t1: Array.from({ length: 25 }, (_, i) => ({
    id: `t1-${i + 1}`,
    name: `T1 Client ${i + 1}`,
    status: i % 3 === 0 ? 'active' : 'inactive'
  })),
  t2: Array.from({ length: 18 }, (_, i) => ({
    id: `t2-${i + 1}`,
    name: `T2 Client ${i + 1}`,
    status: 'active'
  }))
};

// ----------------------------------------------------------------------

export function OverviewAppView() {
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

  const queryFilters = { page: 0, pageSize: 10 };

  // Fetch active shops
  const {
    refetch: refetchShopsActive,
    data: shopsActive,
    loading: loadingShopsActive,
  } = GQLQuery({
    query: Q_SHOPS_ACTIVE,
    queryAction: 'shops',
    variables: { input: queryFilters },
  });

  // Fetch recycled shops
  const {
    refetch: refetchShopsRecycled,
    data: shopsRecycled,
    loading: loadingShopsRecycled,
  } = GQLQuery({
    query: Q_SHOPS_RECYCLED,
    queryAction: 'shopsRecycled',
    variables: { input: queryFilters },
  });

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

  const theme = useTheme();

  // Calculate some useful metrics
  const totalT1Clients = allClients?.length || DUMMY_CLIENTS.t1.length;
  const totalActiveT2 = clientsActive?.length || DUMMY_CLIENTS.t2.length;
  const totalSessions = sessions?.total || DUMMY_SESSIONS.total;
  const totalOffers = offers?.length || 45; // Example dummy value
  const totalJobs = jobs?.length || 23; // Example dummy value

  // Calculate percentage changes (example calculation - adjust as needed)
  const calculatePercentChange = (current: number, previous: number) =>
    previous ? ((current - previous) / previous) * 100 : 0;

  // Calculate session statistics
  const sessionStats = {
    active: 0,
    expired: 0,
    locked: 0,
    unlocked: 0
  };

  const sessionsToProcess = sessions?.items || DUMMY_SESSIONS.items;
  
  sessionsToProcess.forEach((session: any) => {
    const isExpired = new Date(session.expires) < new Date();
    if (isExpired) {
      sessionStats.expired++;
    } else {
      sessionStats.active++;
    }

    if (session.locked) {
      sessionStats.locked++;
    } else {
      sessionStats.unlocked++;
    }
  });

  // Modify the allShops combination to include dummy data when real data is not available
  const allShops = [
    ...(shopsActive?.rows || []),
    ...(shopsRecycled?.rows || []),
    ...((!shopsActive?.rows && !shopsRecycled?.rows) ? DUMMY_SHOPS : [])
  ];

  if (loadingClients || loadingClientsActive) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total T1 Clients"
            percent={calculatePercentChange(totalT1Clients, totalT1Clients - 2)} // Example change
            total={totalT1Clients}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: sessions?.items?.slice(0, 8)?.map((s: any) => s.count) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Active T2 Clients"
            percent={calculatePercentChange(totalActiveT2, totalActiveT2 - 1)}
            total={totalActiveT2}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: sessions?.items?.slice(0, 8)?.map((s: any) => s.count) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Sessions"
            percent={calculatePercentChange(totalSessions, totalSessions - 5)}
            total={totalSessions}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: sessions?.items?.slice(0, 8)?.map((s: any) => s.count) || [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Session Statistics"
            subheader="Active vs Expired & Locked vs Unlocked"
            chart={{
              series: [
                { label: 'Active Sessions', value: sessionStats.active },
                { label: 'Expired Sessions', value: sessionStats.expired },
                { label: 'Locked Sessions', value: sessionStats.locked },
                { label: 'Unlocked Sessions', value: sessionStats.unlocked },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <ShopLocationsMap
            title="Selected Shop Locations"
            subheader={`Total Shops: ${allShops.length}`}
            shops={allShops}
          />
        </Grid>

        {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New invoice"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Related applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top installed countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Total Offers"
              total={totalOffers}
              icon="solar:user-rounded-bold"
              chart={{ series: (totalOffers / 100) * 100 }} // Adjust calculation as needed
            />

            <AppWidget
              title="Open Jobs"
              total={totalJobs}
              icon="fluent:mail-24-filled"
              chart={{
                series: (totalJobs / 100) * 100, // Adjust calculation as needed
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
