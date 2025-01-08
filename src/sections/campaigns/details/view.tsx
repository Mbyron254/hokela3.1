'use client';

import Link from 'next/link';
import { lazy, useState, Suspense, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TabPanel, TabContext } from '@mui/lab';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { varAlpha } from 'src/theme/styles';
import { GQLMutation } from 'src/lib/client';
import { formatDate, formatTimeTo12Hr } from 'src/lib/helpers';
import { M_CAMPAIGN_RUN_OFFER } from 'src/lib/mutations/campaign-run-offer.mutation';

import GiveAways from './give-aways';
import AreaOfOperation from './area-of-operation';
// Lazy load the components
const SalesReport = lazy(() => import('./sales-report'));
const SurveyReports = lazy(() => import('./survey-reports'));

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  campaignId?: string;
};

export function CampaignDetailsView({ title = 'Campaign Details', campaignId }: Props) {
  const [tabValue, setTabValue] = useState('0');
  const [viewMode, setViewMode] = useState('list');

  const { action: getOffer, data: offer } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFER,
    resolver: 'm_campaignRunOffer',
    toastmsg: false,
  });

  const loadOffer = useCallback(() => {
    if (campaignId) {
      getOffer({ variables: { input: { id: campaignId } } });
    }
  }, [campaignId, getOffer]);

  useEffect(() => {
    loadOffer();
  }, [loadOffer]);

  console.log('OFFER', offer);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box component="div">
      <Typography variant="h4"> {title} </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          sx={{
            p: 2.5,
            '& .MuiBreadcrumbs-separator': {
              color: 'text.disabled',
              fontSize: '1.2rem',
              margin: '0 8px',
            },
          }}
        >
          <Link
            href="/v2/agent/dashboard"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Dashboard
            </Box>
          </Link>
          <Link
            href="/v2/agent/dashboard/campaigns"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Campaigns
            </Box>
          </Link>
          <Typography
            color="text.primary"
            sx={{
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
            }}
          >
            Campaign Details
          </Typography>
        </Breadcrumbs>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.z16,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {offer?.campaignRun?.campaign?.name?.charAt(0) || 'C'}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {offer?.campaignRun?.campaign?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {offer?.campaignRun?.code}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  }}
                >
                  <Box sx={{ width: 20, height: 20, color: 'primary.main' }}>🏣</Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Organization
                  </Typography>
                  <Typography variant="subtitle2">
                    {offer?.campaignRun?.campaign?.clientTier2?.clientTier1?.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                  }}
                >
                  <Box sx={{ width: 20, height: 20, color: 'success.main' }}>📅</Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="subtitle2">
                    {formatDate(offer?.campaignRun?.dateStart, 'MMM dd, yyyy') || '2024 Nov 21'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                  }}
                >
                  <Box sx={{ width: 20, height: 20, color: 'error.main' }}>🎯</Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="subtitle2">
                    {formatDate(offer?.campaignRun?.dateStop, 'MMM dd, yyyy') || '2024 Dec 21'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                  }}
                >
                  <Box sx={{ width: 20, height: 20, color: 'warning.main' }}>⏰</Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Hours
                  </Typography>
                  <Typography variant="subtitle2">
                    {formatTimeTo12Hr(offer?.campaignRun?.checkInAt) || '08:00 AM'} -{' '}
                    {formatTimeTo12Hr(offer?.campaignRun?.checkOutAt) || '05:00 PM'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <TabContext value={tabValue}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  px: 3,
                  pt: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Tab label="Area of Operation" value="0" />
                <Tab label="Sales" value="1" />
                <Tab label="Giveaways" value="2" />
                <Tab label="Surveys" value="3" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                <TabPanel value="0">
                  <AreaOfOperation campaignRunId={campaignId} />
                </TabPanel>

                <TabPanel value="1">
                  <Suspense fallback={<div>Loading sales report...</div>}>
                    <SalesReport campaignRunId={offer?.campaignRun?.id} />
                  </Suspense>
                </TabPanel>

                <TabPanel value="2">
                  <GiveAways campaignRunId={campaignId} />
                </TabPanel>

                <TabPanel value="3">
                  <Suspense fallback={<div>Loading survey reports...</div>}>
                    <SurveyReports campaignRunId={offer?.campaignRun?.id} />
                  </Suspense>
                </TabPanel>
              </Box>
            </TabContext>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
