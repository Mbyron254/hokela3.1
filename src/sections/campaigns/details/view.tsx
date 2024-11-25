'use client';

import type { IGeoLocation } from 'src/lib/interface/general.interface';
import type { IAgentAllocation } from 'src/lib/interface/campaign.interface';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { TabPanel, TabContext } from '@mui/lab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Tab , Tabs, FormControl } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { GQLMutation } from 'src/lib/client';
import { sourceImage } from 'src/lib/server';
import { formatDate, formatTimeTo12Hr } from 'src/lib/helpers';
import { M_CAMPAIGN_RUN_OFFER } from 'src/lib/mutations/campaign-run-offer.mutation';
import {
  M_UPDATE_SALE,
  M_AGENT_ALLOCATIONS,
} from 'src/lib/mutations/inventory-allocation.mutation';

import SurveyReports from './survey-reports';
import SalesGiveAwayView from './sales-give-aways-view';
import { PosWidgetSummary } from './pos-widget-summary';

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
  dateStart: string;
  dateStop: string;
  checkInAt: string;
  checkOutAt: string;
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
  id: string;
  created: string;
  agent: TAgent;
  campaignRun: TCampaignRun;
  __typename: 'TCampaignRunOffer';
};

type Props = {
  title?: string;
  campaignId?: string;
};

export function CampaignDetailsView({ title = 'Campaign Details', campaignId }: Props) {
  const [tabValue, setTabValue] = useState('0');
  const [viewMode, setViewMode] = useState('list');
  const [showMapNewShop, setShowMapNewShop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { action: getOffer, data: offer } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFER,
    resolver: 'm_campaignRunOffer',
    toastmsg: false,
  });

  const {
    action: getSalesAllocations,
    loading: loadingAllocationSales,
    data: allocationSales,
  } = GQLMutation({
    mutation: M_AGENT_ALLOCATIONS,
    resolver: 'agentAllocations',
    toastmsg: false,
  });

  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: M_UPDATE_SALE,
    resolver: 'updateSale',
    toastmsg: false,
  });

  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();
  const [allocations, setAllocations] = useState<IAgentAllocation[]>([]);

  const filteredAllocations = useMemo(() => allocations.filter(allocation => {
      const matchesSearch = allocation.product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      switch (filter) {
        case 'soldOut':
          return matchesSearch && allocation.quantitySold === allocation.quantityAllocated;
        case 'inStock':
          return matchesSearch && allocation.quantitySold < allocation.quantityAllocated;
        default:
          return matchesSearch;
      }
    }), [allocations, searchQuery, filter]);

  const loadOffer = useCallback(() => {
    if (campaignId) {
      getOffer({ variables: { input: { id: campaignId } } });
    }
  }, [campaignId, getOffer]);

  const loadSalesAllocations = useCallback(() => {
    if (offer?.campaignRun?.id) {
      getSalesAllocations({
        variables: { input: { campaignRunId: offer.campaignRun.id } },
      });
    }
  }, [offer?.campaignRun?.id, getSalesAllocations]);

  useEffect(() => {
    loadOffer();
  }, [loadOffer]);

  console.log('OFFER', offer);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleChange = (id: string, direction: string) => {
    const _curr: IAgentAllocation[] = [...allocations];

    for (let i = 0; i < _curr.length; i += 1) {
      if (_curr[i].id === id) {
        if (direction === 'up') {
          if (_curr[i].quantitySold < _curr[i].quantityAllocated) {
            update({
              variables: {
                input: {
                  allocationId: id,
                  quantitySold: _curr[i].quantitySold + 1,
                },
              },
            });
            alert(`Congratulations! You've made a sale of ${_curr[i].product.name}!`);
          }
        }
        if (direction === 'down') {
          if (_curr[i].quantitySold > 0) {
            update({
              variables: {
                input: {
                  allocationId: id,
                  quantitySold: _curr[i].quantitySold - 1,
                },
              },
            });
            alert(`Sale of ${_curr[i].product.name} has been removed.`);
          }
        }
      }
    }
    setAllocations(_curr);
  };
  console.log('ALLOCATIONS', allocations);
  useEffect(() => loadOffer(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  useEffect(() => {
    if (offer?.campaignRun?.id || updated) {
      loadSalesAllocations();
    }
  }, [offer?.campaignRun?.id, updated, loadSalesAllocations]);
  useEffect(() => {
    if (allocationSales) {
      const _allocations: IAgentAllocation[] = [];

      for (let i = 0; i < allocationSales.length; i += 1) {
        _allocations.push({
          index: allocationSales[i].index,
          id: allocationSales[i].id,
          quantityAllocated: allocationSales[i].quantityAllocated,
          quantitySold: allocationSales[i].quantitySold,
          product: {
            name: allocationSales[i].product?.name,
            photo: allocationSales[i].product?.photos[0]?.fileName,
            package: `${allocationSales[i].packaging?.unitQuantity} ${allocationSales[i].packaging?.unit?.name}`,
          },
        });
      }
      setAllocations(_allocations);
    }
  }, [allocationSales]);

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
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
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
                  <Box sx={{ width: 20, height: 20, color: 'primary.main' }}>
                  🏣
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Organization</Typography>
                  <Typography variant="subtitle2">{offer?.campaignRun?.campaign?.clientTier2?.clientTier1?.name}</Typography>
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
                  <Box sx={{ width: 20, height: 20, color: 'success.main' }}>
                    📅
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Start Date</Typography>
                  <Typography variant="subtitle2">{formatDate(offer?.campaignRun?.dateStart, 'MMM dd, yyyy') || '2024 Nov 21'}</Typography>
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
                  <Box sx={{ width: 20, height: 20, color: 'error.main' }}>
                    🎯
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">End Date</Typography>
                  <Typography variant="subtitle2">{formatDate(offer?.campaignRun?.dateStop, 'MMM dd, yyyy') || '2024 Dec 21'}</Typography>
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
                  <Box sx={{ width: 20, height: 20, color: 'warning.main' }}>
                    ⏰
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Hours</Typography>
                  <Typography variant="subtitle2">
                    {formatTimeTo12Hr(offer?.campaignRun?.checkInAt) || '08:00 AM'} - {formatTimeTo12Hr(offer?.campaignRun?.checkOutAt) || '05:00 PM'}
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
                <Tab label="Sales Giveaway" value="2" />
                <Tab label="Free Giveaway" value="3" />
                <Tab label="Surveys" value="4" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                <TabPanel value="0">
                  <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
                    Area of Operation Dashboard
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Quick Stats
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08), borderRadius: 2 }}>
                        <Typography variant="overline" sx={{ color: 'primary.main' }}>Total Shops Visited</Typography>
                        <Typography variant="h4">0</Typography>
                      </Box>
                     
                          
                      <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.success.main, 0.08), borderRadius: 2 }}>
                        <Typography variant="overline" sx={{ color: 'success.main' }}>Distance Covered</Typography>
                        <Typography variant="h4">0 km</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.info.main, 0.08), borderRadius: 2 }}>
                        <Typography variant="overline" sx={{ color: 'info.main' }}>Time in Field</Typography>
                        <Typography variant="h4">0 hrs</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Shops Visited Today
                    </Typography>
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center', 
                        mb: 3
                      }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box
                            onClick={() => setViewMode('map')}
                            sx={{
                              p: 1.5,
                              borderRadius: 1.5,
                              bgcolor: viewMode === 'map' ? 'primary.main' : 'background.paper',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: viewMode === 'map' ? 2 : 0,
                              '&:hover': { transform: 'translateY(-2px)', opacity: 0.9 }
                            }}
                          >
                            <Typography sx={{ 
                              color: viewMode === 'map' ? 'common.white' : 'text.primary',
                              px: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <Icon icon="mdi:map" fontSize={20} /> Map View
                            </Typography>
                          </Box>
                          <Box
                            onClick={() => setViewMode('list')}
                            sx={{
                              p: 1.5,
                              borderRadius: 1.5,
                              bgcolor: viewMode === 'list' ? 'primary.main' : 'background.paper',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: viewMode === 'list' ? 2 : 0,
                              '&:hover': { transform: 'translateY(-2px)', opacity: 0.9 }
                            }}
                          >
                            <Typography sx={{ 
                              color: viewMode === 'list' ? 'common.white' : 'text.primary',
                              px: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <Icon icon="mdi:format-list-bulleted" fontSize={20} /> List View
                            </Typography>
                          </Box>
                      
                        </Box>

                        <Box
                          onClick={() => {
                            setShowMapNewShop(true);
                            alert('You will be rewarded 10 points for mapping a new shop!');
                          }}
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: 'success.main',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: 2,
                            '&:hover': { 
                              transform: 'translateY(-2px)',
                              boxShadow: 4
                            }
                          }}
                        >
                          <Typography sx={{ 
                            color: 'common.white',
                            px: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Icon icon="mdi:map-marker-plus" fontSize={20} /> Map New Shop
                          </Typography>
                        </Box>
                      </Box>

                      {viewMode === 'list' ? (
                        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                          {[
                            { id: 1, name: "Joe's Corner Store", time: "9:30 AM", duration: "45 mins", location: "Downtown" },
                            { id: 2, name: "Mini Mart Express", time: "10:45 AM", duration: "30 mins", location: "Westside" },
                            { id: 3, name: "Fresh Foods Market", time: "1:15 PM", duration: "55 mins", location: "Eastside" },
                            { id: 4, name: "Quick Stop Shop", time: "2:30 PM", duration: "40 mins", location: "Northside" }
                          ].map((shop) => (
                            <Box
                              key={shop.id}
                              sx={{
                                p: 3,
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.08)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)'
                                }
                              }}
                            >
                              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                                {shop.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Icon icon="mdi:map-marker" fontSize={20} color="text.secondary" />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {shop.location}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Icon icon="mdi:clock" fontSize={20} color="text.secondary" />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Visited at {shop.time}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon="mdi:timer" fontSize={20} color="text.secondary" />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Duration: {shop.duration}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box 
                          sx={{ 
                            height: 400, 
                            bgcolor: 'background.paper', 
                            borderRadius: 2,
                            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.08)',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Map View Component Would Go Here */}
                          <Typography sx={{ 
                            p: 3, 
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 1
                          }}>
                            <Icon icon="mdi:map" fontSize={24} /> Map View Coming Soon
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TabPanel>

                <TabPanel value="1">
                  <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
                    Product Sales Dashboard
                  </Typography>

                  {!allocations?.length ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        You have not been allocated any products to sell yet.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                          Quick Stats
                        </Typography>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                          {/* <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08), borderRadius: 2 }}>
                            <Typography variant="overline" sx={{ color: 'primary.main' }}>Total Products</Typography>
                            <Typography variant="h4">{allocations.length}</Typography>
                          </Box> */}
                          <PosWidgetSummary
                           title="Product sold"
                           percent={2.6}
                           total={allocations.reduce((sum, a) => sum + a.quantitySold, 0)}
                           chart={{
                             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                             series: [22, 8, 35, 50, 82, 84, 77, 12],
                           }}
                          />
                           <PosWidgetSummary
                           title="Number of Products"
                           percent={2.6}
                           total= {allocations.length}
                           chart={{
                             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                             series: [22, 8, 35, 50, 82, 84, 77, 12],
                           }}
                          />
                          {/* <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.success.main, 0.08), borderRadius: 2 }}>
                            <Typography variant="overline" sx={{ color: 'success.main' }}>Total Sales</Typography>
                            <Typography variant="h4">
                              {allocations.reduce((sum, a) => sum + a.quantitySold, 0)}
                            </Typography>
                          </Box> */}
                           <PosWidgetSummary
                           title="Remaining Stock"
                           percent={2.6}
                           total= {allocations.reduce((sum, a) => sum + (a.quantityAllocated - a.quantitySold), 0)}
                           chart={{
                             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                             series: [22, 8, 35, 50, 82, 84, 77, 12],
                           }}
                          />
                          {/* <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.info.main, 0.08), borderRadius: 2 }}>
                            <Typography variant="overline" sx={{ color: 'info.main' }}>Remaining Stock</Typography>
                            <Typography variant="h4">
                              {allocations.reduce((sum, a) => sum + (a.quantityAllocated - a.quantitySold), 0)}
                            </Typography>
                          </Box> */}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          variant="outlined"
                          placeholder="Search products..."
                          onChange={(e) => setSearchQuery(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                          <InputLabel>Filter by</InputLabel>
                          <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            label="Filter by"
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="soldOut">Sold Out</MenuItem>
                            <MenuItem value="inStock">In Stock</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {filteredAllocations.map((allocation) => (
                          <Box
                            key={allocation.id}
                            sx={{
                              p: 2,
                              bgcolor: 'background.paper', 
                              borderRadius: 2,
                              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.grey[900], 0.08)}`,
                              border: '1px solid',
                              borderColor: 'divider',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette.grey[900], 0.12)}`,
                                borderColor: 'primary.main',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box
                                component="img"
                                src={allocation.product?.photo ? sourceImage(allocation.product.photo) : '/assets/placeholder.svg'}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: 2,
                                  objectFit: 'cover',
                                  boxShadow: (theme) => `0 2px 6px ${alpha(theme.palette.grey[900], 0.08)}`,
                                  border: '1px solid',
                                  borderColor: 'divider'
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ 
                                  mb: 0.5, 
                                  fontWeight: 700,
                                  fontSize: '0.875rem',
                                  color: 'text.primary',
                                  lineHeight: 1.4
                                }}>
                                  {allocation.product.name}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary',
                                  mb: 1,
                                  fontStyle: 'italic'
                                }}>
                                  {allocation.product.package}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                  <Box sx={{ 
                                    flex: 1,
                                    height: 4, 
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                    borderRadius: 2,
                                    overflow: 'hidden'
                                  }}>
                                    <Box sx={{ 
                                      width: `${(allocation.quantitySold / allocation.quantityAllocated) * 100}%`,
                                      height: '100%',
                                      bgcolor: 'primary.main',
                                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                      borderRadius: 2
                                    }} />
                                  </Box>
                                  <Typography variant="caption" sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    minWidth: 30,
                                    textAlign: 'right'
                                  }}>
                                    {Math.round((allocation.quantitySold / allocation.quantityAllocated) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Box sx={{ 
                              mt: 2,
                              pt: 2,
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              borderTop: '1px dashed',
                              borderColor: 'divider'
                            }}>
                              <Box>
                                <Typography variant="caption" sx={{ 
                                  color: 'text.secondary',
                                  display: 'block',
                                  mb: 0.5
                                }}>
                                  Sales Progress
                                </Typography>
                                <Typography variant="subtitle2" sx={{ 
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  fontSize: '0.875rem'
                                }}>
                                  {allocation.quantitySold} / {allocation.quantityAllocated}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box
                                  onClick={() => handleChange(allocation.id, 'down')}
                                  sx={{
                                    p: 1,
                                    borderRadius: '50%',
                                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                                    cursor: allocation.quantitySold > 0 ? 'pointer' : 'not-allowed',
                                    opacity: allocation.quantitySold > 0 ? 1 : 0.5,
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': allocation.quantitySold > 0 ? {
                                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                                      transform: 'scale(1.1)',
                                    } : {}
                                  }}
                                >
                                  <Typography variant="button" sx={{ color: 'error.main', fontWeight: 700 }}>-</Typography>
                                </Box>
                                <Box
                                  onClick={() => handleChange(allocation.id, 'up')}
                                  sx={{
                                    p: 1,
                                    borderRadius: '50%',
                                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                                    cursor: allocation.quantitySold < allocation.quantityAllocated ? 'pointer' : 'not-allowed',
                                    opacity: allocation.quantitySold < allocation.quantityAllocated ? 1 : 0.5,
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': allocation.quantitySold < allocation.quantityAllocated ? {
                                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
                                      transform: 'scale(1.1)',
                                    } : {}
                                  }}
                                >
                                  <Typography variant="button" sx={{ color: 'success.main', fontWeight: 700 }}>+</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </TabPanel>
                <TabPanel value="2">
                  <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
                    Sales Giveaway Dashboard
                  </Typography>

                  <SalesGiveAwayView campaignRunId={offer?.campaignRun?.id} />

                  {/* <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Product Giveaway Combos
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                      🛍️ Product Giveaway  Coming Soon
                      </Typography>
                    </Box>
                  </Box> */}
                </TabPanel>

                <TabPanel value="3">
                  <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
                    Free Giveaway
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Available Items
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        🎁 Free Giveaway Coming Soon
                      </Typography>
                    </Box>
                  </Box>
                </TabPanel>

                <TabPanel value="4">
                  <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
                    Available Surveys
                  </Typography>

               <SurveyReports campaignRunId={campaignId}/>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mt: 4,
                      p: 3,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'primary.main',
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      🎁
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
                      Complete surveys to earn points and unlock exciting rewards!
                    </Typography>
                  </Box>
                </TabPanel>
              </Box>
            </TabContext>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
