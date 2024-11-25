'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { useEffect, useState } from 'react';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import { alpha } from '@mui/material/styles';
import { Card, Grid, LinearProgress, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { ERole } from 'src/types/client';
import { Iconify } from 'src/components/iconify';

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
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
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

  useEffect(() => loadOffers(), [session?.user?.agent?.id]);

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
      color: 'primary'
    },
    {
      title: 'Active Runs',
      total:  offers?.count,
      icon: 'mdi:play-circle-outline',
      color: 'info'
    },
    {
      title: 'Active Applications',
      total: 0, // Replace with actual data
      icon: 'mdi:send',
      color: 'warning'
    },
    {
      title: 'Approved Applications',
      total: 0, // Replace with actual data
      icon: 'mdi:check-circle-outline',
      color: 'success'
    },
  ];

  const activeCampaigns = offers?.rows?.filter((campaign: any) => campaign.status === 'active');
  const completedCampaigns = offers?.rows?.filter((campaign: any) => campaign.status === 'completed');

  const renderActiveOffers = () => {
    if (!offers?.rows?.length) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No active campaign runs found
        </Typography>
      );
    }

    return offers.rows.map((offer: any) => (
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
            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          mb: 3
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '1.1rem',
            lineHeight: 1.2
          }}
        >
          {offer.campaignRun.campaign.name}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          gap: 1
        }}>
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
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Ksh{offer.potentialPay?.toLocaleString() || '0'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Unlocked
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 600 }}>
              Ksh{offer.unlockedAmount?.toLocaleString() || '0'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Paid
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'info.main', fontWeight: 600 }}>
              Ksh{offer.paidAmount?.toLocaleString() || '0'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Campaign Progress
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
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
                background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            KPIs Achieved
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {offer.kpisAchieved || 0}/{offer.totalKpis || 0}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Profile Completion
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {offer.profileCompletion || 0}%
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 'auto'
        }}>
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
            mt: 2
          }}
        >
          <Box component="span" sx={{ width: 16, height: 16 }}>⏳</Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {offer.daysRemaining || 0} Days Remaining
          </Typography>
        </Box>
      </Box>
    ));
  };

  // const renderCampaignCard = (campaign: Campaign) => (
  //   <Box
  //     key={campaign.id}
  //     onClick={() => handleCampaignClick(campaign.id)}
  //     sx={{
  //       p: 3,
  //       borderRadius: 2,
  //       bgcolor: 'background.paper',
  //       boxShadow: (theme) => theme.customShadows.z8,
  //       transition: 'all 0.3s ease',
  //       ':hover': {
  //         transform: 'translateY(-4px)',
  //         boxShadow: (theme) => theme.customShadows.z16,
  //         cursor: 'pointer',
  //       },
  //       position: 'relative',
  //       overflow: 'hidden',
  //       '&::before': {
  //         content: '""',
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         width: '100%',
  //         height: '4px',
  //         background: (theme) => campaign.status === 'completed' 
  //           ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
  //           : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  //       },
  //       display: 'flex',
  //       flexDirection: 'column',
  //       height: '100%',
  //       mb: 3
  //     }}
  //   >
  //     <Typography 
  //       variant="h6" 
  //       sx={{ 
  //         mb: 2,
  //         color: campaign.status === 'completed' ? 'success.main' : 'primary.main',
  //         fontWeight: 700,
  //         fontSize: '1.1rem',
  //         lineHeight: 1.2
  //       }}
  //     >
  //       {campaign.title}
  //     </Typography>

  //     <Box sx={{ 
  //       display: 'flex', 
  //       alignItems: 'center', 
  //       mb: 3,
  //       gap: 1
  //     }}>
  //       <Box
  //         sx={{
  //           width: 40,
  //           height: 40,
  //           borderRadius: '50%',
  //           bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           color: 'primary.main',
  //           fontWeight: 700,
  //         }}
  //       >
  //         {campaign.companyInitials}
  //       </Box>
  //       <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
  //         {campaign.company}
  //       </Typography>
  //     </Box>

  //     <Box 
  //       sx={{ 
  //         mb: 3,
  //         p: 2,
  //         borderRadius: 1.5,
  //         bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
  //       }}
  //     >
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Potential Pay
  //         </Typography>
  //         <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
  //           Ksh{campaign.potentialPay.toLocaleString()}
  //         </Typography>
  //       </Box>
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Unlocked
  //         </Typography>
  //         <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 600 }}>
  //           Ksh{campaign.unlockedAmount.toLocaleString()}
  //         </Typography>
  //       </Box>
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Paid
  //         </Typography>
  //         <Typography variant="subtitle2" sx={{ color: 'info.main', fontWeight: 600 }}>
  //           Ksh{campaign.paidAmount.toLocaleString()}
  //         </Typography>
  //       </Box>
  //     </Box>

  //     {campaign.status === 'active' ? (
  //       <>
  //         <Box sx={{ mb: 2 }}>
  //           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  //             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //               Campaign Progress
  //             </Typography>
  //             <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
  //               {campaign.campaignProgress}%
  //             </Typography>
  //           </Box>
  //           <LinearProgress
  //             variant="determinate"
  //             value={campaign.campaignProgress}
  //             sx={{
  //               height: 8,
  //               borderRadius: 2,
  //               bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
  //               '& .MuiLinearProgress-bar': {
  //                 borderRadius: 2,
  //                 background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  //               },
  //             }}
  //           />
  //         </Box>

  //         <Box
  //           sx={{
  //             display: 'flex',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             gap: 0.5,
  //             color: 'warning.main',
  //             bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
  //             borderRadius: 1.5,
  //             p: 1,
  //             mt: 'auto'
  //           }}
  //         >
  //           <Box component="span" sx={{ width: 16, height: 16 }}>⏳</Box>
  //           <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
  //             {campaign.daysRemaining} Days Remaining
  //           </Typography>
  //         </Box>
  //       </>
  //     ) : (
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           gap: 0.5,
  //           color: 'success.main',
  //           bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
  //           borderRadius: 1.5,
  //           p: 1,
  //           mt: 'auto'
  //         }}
  //       >
  //         <Box component="span" sx={{ width: 16, height: 16 }}>✓</Box>
  //         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
  //           Completed on {new Date(campaign.completedDate!).toLocaleDateString()}
  //         </Typography>
  //       </Box>
  //     )}
  //   </Box>
  // );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      {/* Overview Section */}
      <Box sx={{ my: 5 }}>
        <Grid container spacing={3}>
          {statsCards.map((card) => (
            <Grid key={card.title} item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  boxShadow: (theme) => theme.customShadows.z8,
                }}
              >
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
      </Box>

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

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              px: 2,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: (theme) => tabValue === 0 
                  ? `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`
                  : `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
              },
              '& .MuiTab-root': {
                minHeight: 48,
                fontWeight: 600,
                transition: 'all 0.2s',
                color: (theme) => tabValue === 0 ? 'info.main' : 'success.main',
                '&:hover': {
                  color: (theme) => tabValue === 0 ? theme.palette.info.dark : theme.palette.success.dark,
                  opacity: 1,
                },
                '&.Mui-selected': {
                  color: (theme) => tabValue === 0 ? theme.palette.info.dark : theme.palette.success.dark,
                },
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  py: 0.5,
                }}>
                  <span>My Campaign Runs</span>
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      lineHeight: '24px',
                      textAlign: 'center',
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {offers?.rows?.length || 0}
                  </Box>
                </Box>
              }
            />
            <Tab 
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  py: 0.5,
                }}>
                  <span>My Campaign Applications</span>
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      lineHeight: '24px',
                      textAlign: 'center',
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    0
                  </Box>
                </Box>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                }
              }}
            >
              {renderActiveOffers()}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* <MyApplicationsView /> */}
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            No campaign applications found
          </Typography>
        </TabPanel>
      </Box>
    </DashboardContent>
  );
}
