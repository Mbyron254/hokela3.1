import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/campaign-run-application.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { formatDate } from 'src/lib/helpers';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

export default function MyApplicationsView() {
  const router = useRouter();

  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
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

  const columns = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'ORGANIZATION',
      sortable: true,
      wrap: true,
      selector: (row: any) =>
        row.campaignRun?.campaign?.clientTier2?.clientTier1?.name,
      cell: (row: any) =>
        row.campaignRun?.campaign?.clientTier2?.clientTier1?.name,
    },
    {
      name: 'CAMPAIGN',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.campaignRun?.campaign?.name,
      cell: (row: any) => (
        <div className='w-100 overflow-hidden'>
          <h6 className='mt-1 mb-1'>{row.campaignRun?.campaign?.name}</h6>
          <span className='font-11'>
            RID:
            <strong className='text-muted ms-1'>{row.campaignRun?.code}</strong>
          </span>
        </div>
      ),
    },
    {
      name: 'APPLIED ON',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
    {
      name: 'DEADLINE',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.campaignRun?.closeAdvertOn,
      cell: (row: any) => formatDate(row.campaignRun?.closeAdvertOn),
    },
    {
      name: 'STATUS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.id,
      cell: (row: any) => '---',
    },
  ];

  const loadApplications = () => {
    if (session?.user?.agent?.id) {
      getApplications({
        variables: {
          input: { agentId: session.user.agent.id },
        },
      });
    }
  };
  const statsCards = [
    {
      title: 'Total Applications',
      total: applications.length || 0,
      color: 'primary',
      icon: 'solar:documents-bold',
    },
    {
      title: 'Pending Review',
      total: applications.filter((app: any) => app.status === 'pending').length || 0,
      color: 'warning',
      icon: 'solar:hourglass-bold',
    },
    {
      title: 'Approved',
      total: applications.filter((app: any) => app.status === 'approved').length || 0,
      color: 'success', 
      icon: 'solar:check-circle-bold',
    },
    {
      title: 'Rejected',
      total: applications.filter((app: any) => app.status === 'rejected').length || 0,
      color: 'error',
      icon: 'solar:close-circle-bold',
    },
  ];

  const renderApplications = () => {
    if (!applications.length) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No campaign applications found
        </Typography>
      );
    }

    return applications.map((application: any) => (
      <Card
        key={application.id}
        sx={{
          p: 3,
          boxShadow: (theme) => theme.customShadows.z8,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: (theme) => theme.customShadows.z16,
          },
        }}
        onClick={() => router.push(`/campaigns/applications/${application.id}`)}
      >
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {application.campaignRun?.campaign?.name}
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: (theme) => {
                  switch (application.status) {
                    case 'approved':
                      return alpha(theme.palette.success.main, 0.1);
                    case 'rejected':
                      return alpha(theme.palette.error.main, 0.1);
                    default:
                      return alpha(theme.palette.warning.main, 0.1);
                  }
                },
                color: (theme) => {
                  switch (application.status) {
                    case 'approved':
                      return theme.palette.success.main;
                    case 'rejected':
                      return theme.palette.error.main;
                    default:
                      return theme.palette.warning.main;
                  }
                },
              }}
            >
              <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                {application.status}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Application Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={application.progress || 0}
              sx={{
                height: 6,
                borderRadius: 1,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Submitted on: {new Date(application.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Code: {application.campaignRun?.code}
            </Typography>
          </Box>
        </Stack>
      </Card>
    ));
  };

  return (
    <Box maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        My Campaign Applications
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statsCards.map((card) => (
          <Grid key={card.title} item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, boxShadow: (theme) => theme.customShadows.z8 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    borderRadius: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${card.color}.lighter`,
                    color: `${card.color}.main`,
                  }}
                >
                  <Iconify icon={card.icon} width={24} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4">{card.total}</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        {renderApplications()}
      </Box>
    </Box>
  );
}
