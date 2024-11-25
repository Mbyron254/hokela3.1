import type { BoxProps } from '@mui/material/Box';
import type { IDateValue } from 'src/types/common';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import { fDateTime } from 'src/utils/format-time';
import { fPercent } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type TClientTier1 = {
  name: string;
  __typename: 'TClientTier1';
};

type TClientTier2 = {
  name: string;
  clientTier1: TClientTier1;
  __typename: 'TClientTier2';
};

type TCampaign = {
  name: string;
  clientTier2: TClientTier2;
  __typename: 'TCampaign';
};

type TProject = {
  name: string;
  __typename: 'TProject';
};

type TCampaignRun = {
  id: string;
  code: string;
  project: TProject;
  campaign: TCampaign;
  __typename: 'TCampaignRun';
};

type TUserProfile = {
  photo: string | null;
  __typename: 'TUserProfile';
};

type TUser = {
  name: string;
  profile: TUserProfile;
  __typename: 'TUser';
};

type TAgent = {
  user: TUser;
  __typename: 'TAgent';
};

type TCampaignRunOffer = {
  index: number;
  id: string;
  created: string;
  agent: TAgent;
  campaignRun: TCampaignRun;
  __typename: 'TCampaignRunOffer';
};


type Props = CardProps & {
  title: string;
  runs: TCampaignRunOffer[];
  list: {
    id: string;
    title: string;
    totalLesson: number;
    currentLesson: number;
    reminderAt: IDateValue;
  }[];
};

export function CourseReminders({ title, runs, list, ...other }: Props) {
  const theme = useTheme();

  const colors = [
    theme.vars.palette.info.main,
    theme.vars.palette.error.main,
    theme.vars.palette.secondary.main,
    theme.vars.palette.success.main,
  ];

  return (
    <Card {...other}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {runs?.length ? (
          runs.map((run, index) => (
            <Item key={run.id} run={run} sx={{ color: colors[index % colors.length] }} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No reminders available
          </Box>
        )}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CourseItemProps = BoxProps & {
  run: TCampaignRunOffer;
};

function Item({ run, sx, ...other }: CourseItemProps) {
  const percent = 75;

  return (
    <Box sx={{ gap: 1.5, display: 'flex', ...sx }} {...other}>
      <Box
        sx={{
          width: 6,
          my: '3px',
          height: 16,
          flexShrink: 0,
          opacity: 0.24,
          borderRadius: 1,
          bgcolor: 'currentColor',
        }}
      />

      <Box
        sx={{
          gap: 1,
          minWidth: 0,
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
        }}
      >
        <Link 
          href={paths.v2.agent.campaigns.details(run.id)}
          color="inherit" 
          noWrap 
          sx={{ color: 'text.primary' }}
        >
          {run.campaignRun.campaign.name}
        </Link>

        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'caption',
            color: 'text.secondary',
          }}
        >
          <Iconify width={16} icon="solar:calendar-date-bold" />
          {fDateTime(run.created)}
        </Box>

        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <LinearProgress
            color="warning"
            variant="determinate"
            value={percent}
            sx={{
              width: 1,
              height: 6,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
              [` .${linearProgressClasses.bar}`]: { bgcolor: 'currentColor' },
            }}
          />
          <Box
            component="span"
            sx={{
              width: 40,
              typography: 'caption',
              color: 'text.primary',
              fontWeight: 'fontWeightMedium',
            }}
          >
            {fPercent(percent)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
