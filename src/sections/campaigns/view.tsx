'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { LinearProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { paths } from 'src/routes/paths';

import { varAlpha } from 'src/theme/styles';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';

import { ERole } from 'src/types/client';

// ----------------------------------------------------------------------

type Campaign = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  potentialPay: number;
  unlockedAmount: number;
  paidAmount: number;
  kpisAchieved: number;
  totalKpis: number;
  profileCompletion: number;
  campaignProgress: number;
  daysRemaining: number;
  status: 'active' | 'completed';
  completedDate?: string;
};

type OfferData = {
  count: number;
  rows: Array<{
    index: number;
    id: string;
    created: string;
    agent: {
      user: {
        name: string;
        profile: {
          photo: string | null;
        };
      };
    };
    campaignRun: {
      id: string;
      code: string;
      project: {
        name: string;
      };
      campaign: {
        name: string;
        clientTier2: {
          name: string;
          clientTier1: {
            name: string;
          };
        };
      };
    };
    potentialPay: number;
    unlockedAmount: number;
    paidAmount: number;
    kpisAchieved: number;
    totalKpis: number;
    profileCompletion: number;
    campaignProgress: number;
    daysRemaining: number;
    status: 'active' | 'completed';
    completedDate?: string;
  }>;
};

type Props = {
  title?: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`campaign-tabpanel-${index}`}
      aria-labelledby={`campaign-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function CampaignsView({ title = 'Blank' }: Props) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const { action: getOffers, data: offers } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFERS,
    resolver: 'm_campaignRunOffers',
    toastmsg: false,
  });

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

  // Remove debug log in production
  // console.log(offers, 'offers');

  const handleCampaignClick = (campaignId: string): void => {
    router.push(paths.v2[ERole.AGENT].campaigns.details(campaignId));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  const statsCards = [
    {
      title: 'Total Campaigns',
      total: offers?.count || 0,
      icon: 'mdi:bullhorn',
      color: 'primary',
    },
    {
      title: 'Active Runs',
      total: offers?.count,
      icon: 'mdi:play-circle-outline',
      color: 'info',
    },
    {
      title: 'Active Applications',
      total: 0, // Replace with actual data
      icon: 'mdi:send',
      color: 'warning',
    },
    {
      title: 'Approved Applications',
      total: 0, // Replace with actual data
      icon: 'mdi:check-circle-outline',
      color: 'success',
    },
  ];

  const activeCampaigns = offers?.rows?.filter((campaign: any) => campaign.status === 'active');
  const completedCampaigns = offers?.rows?.filter(
    (campaign: any) => campaign.status === 'completed'
  );

  return (
    <DashboardContent maxWidth="xl">
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
          <Typography
            color="text.primary"
            sx={{
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
            }}
          >
            Campaigns
          </Typography>
        </Breadcrumbs>

        <Box sx={{ p: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Tab label={`Active Runs (${activeCampaigns?.length || 0})`} />
            <Tab label={`Completed Runs (${completedCampaigns?.length || 0})`} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
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
              {activeCampaigns?.length ? (
                activeCampaigns.map((offer: any) => (
                  <Box
                    key={offer.id}
                    onClick={() => handleCampaignClick(offer.id)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: (theme) => theme.customShadows.z8,
                      transition: 'all 0.3s ease',
                      ':hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.customShadows.z16,
                        cursor: 'pointer',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: (theme) =>
                          `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {offer.campaignRun.campaign.name}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                          fontWeight: 700,
                        }}
                      >
                        {offer.campaignRun.campaign.clientTier2.clientTier1.name.substring(0, 2)}
                      </Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {offer.campaignRun.campaign.clientTier2.name}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Potential Pay
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'primary.main', fontWeight: 600 }}
                        >
                          Ksh{offer.potentialPay?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Unlocked
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'success.main', fontWeight: 600 }}
                        >
                          Ksh{offer.unlockedAmount?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Paid
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'info.main', fontWeight: 600 }}
                        >
                          Ksh{offer.paidAmount?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Campaign Progress
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'primary.main', fontWeight: 600 }}
                        >
                          {offer.campaignProgress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={offer.campaignProgress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 2,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            background: (theme) =>
                              `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        KPIs Achieved
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        {offer.kpisAchieved || 0}/{offer.totalKpis || 0}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Profile Completion
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        {offer.profileCompletion || 0}%
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Project: {offer.campaignRun.project.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Code: {offer.campaignRun.code}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        color: 'warning.main',
                        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                        borderRadius: 1.5,
                        p: 1,
                        mt: 2,
                      }}
                    >
                      <Box component="span" sx={{ width: 16, height: 16 }}>
                        ⏳
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {offer.daysRemaining || 0} Days Remaining
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4, gridColumn: '1/-1' }}>
                  No active campaign runs found
                </Typography>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
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
              {completedCampaigns?.length ? (
                completedCampaigns.map((offer: any) => (
                  <Box
                    key={offer.id}
                    onClick={() => handleCampaignClick(offer.id)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: (theme) => theme.customShadows.z8,
                      transition: 'all 0.3s ease',
                      ':hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.customShadows.z16,
                        cursor: 'pointer',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: (theme) =>
                          `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {offer.campaignRun.campaign.name}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.main',
                          fontWeight: 700,
                        }}
                      >
                        {offer.campaignRun.campaign.clientTier2.clientTier1.name.substring(0, 2)}
                      </Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {offer.campaignRun.campaign.clientTier2.name}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Potential Pay
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'primary.main', fontWeight: 600 }}
                        >
                          Ksh{offer.potentialPay?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Unlocked
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'success.main', fontWeight: 600 }}
                        >
                          Ksh{offer.unlockedAmount?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Paid
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'info.main', fontWeight: 600 }}
                        >
                          Ksh{offer.paidAmount?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Campaign Progress
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: 'primary.main', fontWeight: 600 }}
                        >
                          {offer.campaignProgress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={offer.campaignProgress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 2,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            background: (theme) =>
                              `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        KPIs Achieved
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        {offer.kpisAchieved || 0}/{offer.totalKpis || 0}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Profile Completion
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        {offer.profileCompletion || 0}%
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Project: {offer.campaignRun.project.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Code: {offer.campaignRun.code}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        color: 'warning.main',
                        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                        borderRadius: 1.5,
                        p: 1,
                        mt: 2,
                      }}
                    >
                      <Box component="span" sx={{ width: 16, height: 16 }}>
                        ⏳
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {offer.daysRemaining || 0} Days Remaining
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4, gridColumn: '1/-1' }}>
                  No completed campaign runs found
                </Typography>
              )}
            </Box>
          </TabPanel>
        </Box>
      </Box>
    </DashboardContent>
  );
}
