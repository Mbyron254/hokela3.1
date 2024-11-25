'use client';

import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function DashboardView({ title = 'Agent Dashboard' }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:account-edit" />}
        >
          Update Portfolio
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        <Card sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon icon="mdi:briefcase-check" style={{ color: 'var(--mui-palette-primary-main)', marginRight: 8 }} />
            <Typography variant="h6">My Campaigns</Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 1 }}>2</Typography>
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Product Training - In Progress
            </Typography>
            <LinearProgress variant="determinate" value={60} sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Active Tasks - 3 Pending
            </Typography>
            <LinearProgress variant="determinate" value={75} color="success" />
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon icon="mdi:star" style={{ color: 'var(--mui-palette-warning-main)', marginRight: 8 }} />
            <Typography variant="h6">Performance Rating</Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 1 }}>4.8/5.0</Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Task Completion Rate
              </Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                95%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Client Feedback Score
              </Typography>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                4.9/5.0
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon icon="mdi:gift" style={{ color: 'var(--mui-palette-info-main)', marginRight: 8 }} />
            <Typography variant="h6">Campaign Opportunities</Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 1 }}>8</Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                New Campaign Offers
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                5
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Product Sampling Available
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                3
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            sx={{ flex: 1 }}
            startIcon={<Icon icon="mdi:clipboard-list" />}
          >
            View Active Tasks
          </Button>
          <Button
            variant="contained"
            color="info"
            size="large" 
            sx={{ flex: 1 }}
            startIcon={<Icon icon="mdi:gift-outline" />}
          >
            Browse Campaign Offers
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ flex: 1 }}
            startIcon={<Icon icon="mdi:school" />}
          >
            Training Materials
          </Button>
        </Stack>
      </Box>
    </DashboardContent>
  );
}
