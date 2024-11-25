'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import { cardClasses } from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { _coursesContinue, _coursesReminder } from 'src/_mock';
import { M_OPEN_JOBS } from 'src/lib/mutations/campaign-run.mutation';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/campaign-run-application.mutation';

import { CourseProgress } from '../course-progress';
import { CourseContinue } from '../course-continue';
import { CourseFeatured } from '../course-featured';
import { CourseReminders } from '../course-reminders';
import { CourseMyAccount } from '../course-my-account';
import { CourseHoursSpent } from '../course-hours-spent';
import { CourseMyStrength } from '../course-my-strength';
import { CourseWidgetSummary } from '../course-widget-summary';

// ----------------------------------------------------------------------

interface TCampaignRun {
  index: number;
  id: string;
  closeAdvertOn: string;
  campaign: {
    id: string;
    name: string;
    jobDescription: string;
    jobQualification: string;
    clientTier2: {
      name: string;
      clientTier1: {
        name: string;
        __typename: 'TClientTier1';
      };
      __typename: 'TClientTier2';
    };
    __typename: 'TCampaign';
  };
  __typename: 'TCampaignRun';
}

interface TCampaignRuns {
  count: number;
  rows: TCampaignRun[];
  __typename: 'TCampaignRuns';
}

export function OverviewCourseView() {

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
  const {
    action: getApplications,
    loading: loadingApplications,
    data: applications,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_APPLICATIONS,
    resolver: 'm_campaignRunApplications',
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
  const loadApplications = () => {
    if (session?.user?.agent?.id) {
      getApplications({
        variables: {
          input: { agentId: session.user.agent.id },
        },
      });
    }
  };

  useEffect(() =>
     loadOffers(), 
// eslint-disable-next-line react-hooks/exhaustive-deps
  [session?.user?.agent?.id]);
  useEffect(() => loadRunsActive(), 
// eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  useEffect(() => loadApplications(), 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [session?.user?.agent?.id]);
  console.log(offers, 'offers');
  console.log(session, 'session');
  console.log('JOBS  ', jobs);
  console.log('APPLICATIONS  ', applications);

  return (
    <DashboardContent
      maxWidth={false}
      disablePadding
      sx={{
        borderTop: (theme) => ({
          lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            minWidth: { lg: 0 },
            py: { lg: 3, xl: 5 },
            flexDirection: 'column',
            flex: { lg: '1 1 auto' },
            px: { xs: 2, sm: 3, xl: 5 },
            borderRight: (theme) => ({
              lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
            }),
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Hi, {session?.user?.name || 'Agent'} 👋
            </Typography>
            <Typography
              sx={{ color: 'text.secondary' }}
            >Welcome back to Hokela 3.1!</Typography>
          </Box>

          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            <CourseWidgetSummary
              title="Running Campaigns"
              total={offers?.count || 0}
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
            />

            <CourseWidgetSummary
              title="Active Applications"
              total={applications?.count || 0}
              color="success"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
            />

            <CourseWidgetSummary
              title="Approved Applications"
              total={applications?.count || 0}
              color="secondary"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-certificates.svg`}
            />
          </Box>

          <CourseHoursSpent
            title="Hours spent"
            chart={{
              series: [
                {
                  name: 'Weekly',
                  categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                  data: [{ data: [10, 41, 35, 151, 49] }],
                },
                {
                  name: 'Monthly',
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  data: [{ data: [83, 112, 119, 88, 103, 112, 114, 108, 93] }],
                },
                {
                  name: 'Yearly',
                  categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                  data: [{ data: [24, 72, 64, 96, 76, 41] }],
                },
              ],
            }}
          />

          <Box
            sx={{
              gap: 3,
              display: 'grid',
              alignItems: 'flex-start',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <CourseProgress
              title="Campaign Run Progress"
              chart={{
                series: [
                  { label: 'To start', value: 45 },
                  { label: 'In progress', value: 25 },
                  { label: 'Completed', value: 20 },
                ],
              }}
            />

            <CourseContinue title="Continue With Active Runs" runs={offers?.rows} list={_coursesContinue} />
          </Box>

          <CourseFeatured title="Featured Campaign Offers" jobs={jobs?.rows}   />
        </Box>

        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 3, xl: 5 },
            pt: { lg: 8, xl: 10 },
            pb: { xs: 8, xl: 10 },
            flexShrink: { lg: 0 },
            gap: { xs: 3, lg: 5, xl: 8 },
            maxWidth: { lg: 320, xl: 360 },
            bgcolor: { lg: 'background.neutral' },
            [`& .${cardClasses.root}`]: {
              p: { xs: 3, lg: 0 },
              boxShadow: { lg: 'none' },
              bgcolor: { lg: 'transparent' },
            },
          }}
        >
          <CourseMyAccount session={session} />

          <CourseMyStrength
            title="Strength"
            chart={{
              categories: ['Research', 'Sales', 'English', 'Reporting', 'Research', 'Math'],
              series: [{ data: [80, 50, 30, 40, 100, 20] }],
            }}
          />

          <CourseReminders title="Reminders" runs={offers?.rows} list={_coursesReminder} />
        </Box>
      </Box>
    </DashboardContent>
  );
}
