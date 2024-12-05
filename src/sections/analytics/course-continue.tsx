import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import { fPercent } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

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

export function CourseContinue({ title, subheader, runs, list, ...other }: Props) {
  return (
    <Card {...other} style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3 }}>
        {runs?.length ? (
          <Item run={runs[0]} />
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 10,
              typography: 'h6',
            }}
          >
            No active runs available
          </Box>
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
  const campaignProgress = 65;
  const profileComplete = 80;
  const kpisAchieved = 75;
  const potentialPay = 5000;
  const unlockedPay = 3250;
  const paidAmount = 2000;

  return (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        bgcolor: 'background.neutral',
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          alt={run.agent.user.name}
          src={run.agent.user.profile.photo || ''}
          variant="rounded"
          sx={{ width: 72, height: 72 }}
        />

        <Box sx={{ flex: 1 }}>
          <Link
            href={paths.v2.agent.campaigns.details(run.id)}
            color="inherit"
            sx={{ typography: 'h6' }}
          >
            {run.campaignRun.campaign.name}
          </Link>

          <Box sx={{ typography: 'body1', color: 'text.secondary', mt: 0.5 }}>
            Client: {run.campaignRun.campaign.clientTier2.clientTier1.name}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        <ProgressItem label="Campaign Progress" value={campaignProgress} color="primary" />
        <ProgressItem label="Profile Complete" value={profileComplete} color="info" />
        <ProgressItem label="KPIs Achieved" value={kpisAchieved} color="success" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 3,
          mt: 1,
          pt: 3,
          borderTop: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <PaymentItem label="Potential Pay" amount={potentialPay} color="text.secondary" />
        <PaymentItem label="Unlocked Pay" amount={unlockedPay} color="warning.main" />
        <PaymentItem label="Paid Amount" amount={paidAmount} color="success.main" />
      </Box>
    </Box>
  );
}

type ProgressItemProps = {
  label: string;
  value: number;
  color: 'primary' | 'info' | 'success' | 'warning';
};

function ProgressItem({ label, value, color }: ProgressItemProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fPercent(value)}
        </Typography>
      </Box>
      <LinearProgress
        color={color}
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
          [` .${linearProgressClasses.bar}`]: { opacity: 0.8 },
        }}
      />
    </Box>
  );
}

type PaymentItemProps = {
  label: string;
  amount: number;
  color: string;
};

function PaymentItem({ label, amount, color }: PaymentItemProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle2" color={color}>
        ${amount.toLocaleString()}
      </Typography>
    </Box>
  );
}
