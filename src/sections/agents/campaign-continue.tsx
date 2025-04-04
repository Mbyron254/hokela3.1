import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
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
  title?: string;
  subheader?: string;
  runs: TCampaignRunOffer[];
  list: {
    id: string;
    title: string;
    coverUrl: string;
    totalLesson: number;
    currentLesson: number;
  }[];
};

export function CampaignContinue({ title, subheader, runs, list, ...other }: Props) {
  return (
    <Card {...other} style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        {runs?.length ? (
          runs.map((run) => <Item key={run.id} run={run} />)
        ) : (
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>No active runs available</Box>
        )}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  run: TCampaignRunOffer;
};

function Item({ run, sx, ...other }: ItemProps) {
  const totalTasks = 100;
  const completedTasks = 65;
  const percent = (completedTasks / totalTasks) * 100;

  return (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'flex-start', ...sx }} {...other}>
      <Avatar
        alt={run.agent.user.name}
        src={run.agent.user.profile.photo || 'assets/icons/components/ic_extra_image.svg'}
        variant="rounded"
        sx={{ width: 56, height: 56 }}
      />

      <Box sx={{ minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Link
          href={paths.v2.agent.campaigns.details(run.id)}
          color="inherit"
          noWrap
          sx={{ mb: 0.5, typography: 'subtitle2' }}
        >
          {run.campaignRun.campaign.name}
        </Link>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
          Project: {run.campaignRun.project?.name ?? ''}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
          Client: {run.campaignRun.campaign.clientTier2.clientTier1.name} -{' '}
          {run.campaignRun.campaign.clientTier2.name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1 }}>
          Started: {fDateTime(run.created)}
        </Typography>

        <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
          Tasks: {completedTasks}/{totalTasks}
        </Box>

        <Box sx={{ width: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress
            color="warning"
            variant="determinate"
            value={percent}
            sx={{
              width: 1,
              height: 6,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
              [` .${linearProgressClasses.bar}`]: { opacity: 0.8 },
            }}
          />
          <Box
            component="span"
            sx={{
              width: 40,
              typography: 'caption',
              color: 'text.secondary',
              fontWeight: 'fontWeightMedium',
            }}
          >
            {fPercent(percent)}
          </Box>
        </Box>
        {/* <Button
          onClick={() => {}}
          variant="contained"
          color="info"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Join New Campaign
        </Button> */}
        {/* <Button
          onClick={() => {}}
          variant="contained"
          color="success"
          startIcon={<Iconify icon="mingcute:arrow-right-fill" />}
        >
          Continue With Campaign
        </Button> */}
        <Button
          onClick={() => {}}
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:clock-2-line" />}
        >
          Check Into Campaign
        </Button>
      </Box>
    </Box>
  );
}
