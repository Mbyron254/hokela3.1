import type { IJobItem } from 'src/types/job';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

export function JobDetailsContent({ job }: Props) {
  const renderContent = (
    <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">{job?.campaign.name}</Typography>

      <Stack spacing={2}>
        <Typography variant="h6">Job Description</Typography>
        <Markdown children={job?.campaign.jobDescription} />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Job Qualification</Typography>
        <Markdown children={job?.campaign.jobQualification} />
      </Stack>
    </Card>
  );

  const renderOverview = (
    <Card sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
      {[
        {
          label: 'Client',
          value: job?.campaign.clientTier2.name,
          icon: <Iconify icon="solar:user-id-bold" />,
        },
        {
          label: 'Parent Company',
          value: job?.campaign.clientTier2.clientTier1.name,
          icon: <Iconify icon="solar:buildings-2-bold" />,
        },
        {
          label: 'Closing Date',
          value: fDate(job?.closeAdvertOn),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.primary',
              typography: 'subtitle2',
            }}
          />
        </Stack>
      ))}
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
      </Grid>
    </Grid>
  );
}
