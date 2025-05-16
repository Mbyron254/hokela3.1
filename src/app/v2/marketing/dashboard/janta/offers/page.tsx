'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import {
  M_RECALL_JANTA_OFFERS,
  M_REINSTATE_JANTA_OFFERS,
  M_RUN_OFFERS,
  M_RUN_OFFERS_RECYCLED,
} from 'src/lib/mutations/run-offer.mutation';

import { MutationButton } from 'src/components/MutationButton';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';

export default function Page() {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const {
    action: getOffersActive,
    loading: loadingOffersActive,
    data: offersActive,
  } = GQLMutation({
    mutation: M_RUN_OFFERS,
    resolver: 'runOffers',
    toastmsg: false,
  });

  const {
    action: getOffersRecycled,
    loading: loadingOffersRecycled,
    data: offersRecycled,
  } = GQLMutation({
    mutation: M_RUN_OFFERS_RECYCLED,
    resolver: 'runOffersRecycled',
    toastmsg: false,
  });

  const {
    action: recall,
    loading: recalling,
  } = GQLMutation({
    mutation: M_RECALL_JANTA_OFFERS,
    resolver: 'recallJantaOffers',
    toastmsg: true,
  });

  const {
    action: reinstate,
    loading: reinstating,
  } = GQLMutation({
    mutation: M_REINSTATE_JANTA_OFFERS,
    resolver: 'reinstateJantaOffers',
    toastmsg: true,
  });

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [searchActive, setSearchActive] = useState<string>();
  const [searchRecycled, setSearchRecycled] = useState<string>();
  const [tabIndex, setTabIndex] = useState(0);

  const columns = [
    { id: 'index', label: '#', minWidth: 60 },
    { id: 'project', label: 'PROJECT', minWidth: 100 },
    { id: 'campaign', label: 'CAMPAIGN', minWidth: 100 },
    { id: 'agent', label: 'AGENT', minWidth: 100 },
    { id: 'joined', label: 'JOINED RUN ON', minWidth: 100 },
  ];

  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      getOffersActive({
        variables: {
          input: {
            search: searchActive,
            clientTier1Id: session.user.role.clientTier1.id,
          },
        },
      });

      getOffersRecycled({
        variables: {
          input: {
            search: searchRecycled,
            clientTier1Id: session.user.role.clientTier1.id,
          },
        },
      });
    }
  }, [session?.user?.role?.clientTier1?.id, getOffersActive, getOffersRecycled]);

  const loadOffersActive = () => {
    if (session?.user?.role?.clientTier1?.id) {
      getOffersActive({
        variables: {
          input: {
            search: searchActive,
            clientTier1Id: session.user.role.clientTier1.id,
          },
        },
      });
    }
  };

  const loadOffersRecycled = () => {
    if (session?.user?.role?.clientTier1?.id) {
      getOffersRecycled({
        variables: {
          input: {
            search: searchRecycled,
            clientTier1Id: session.user.role.clientTier1.id,
          },
        },
      });
    }
  };

  const handleRecall = () => {
    if (selectedActive.length) {
      recall({ variables: { input: { offerIds: selectedActive } } });
    }
  };

  const handleReinstate = () => {
    if (selectedRecycled.length) {
      reinstate({ variables: { input: { offerIds: selectedRecycled } } });
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.v2.marketing.root },
          { name: 'Janta', href: paths.v2.marketing.janta.offers },
          { name: 'Offers' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="offers tabs" className='mb-3' sx={{ marginBottom: '10px' }}>
        <Tab label="Active Offers" />
        <Tab label="Recalled Offers" />
      </Tabs>

      <div className="tab-content mt-3 pt-5">
        {tabIndex === 0 && (
          <div className="tab-pane mt-3 show active" id="active-offers">
            <div className="btn-group btn-group-sm mb-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleRecall}
                disabled={recalling}
                sx={{ mb: 2 }}>
                Recall
              </Button>
              
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search agent..."
                value={searchActive || ''}
                onChange={(e) => setSearchActive(e.target.value === '' ? undefined : e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => loadOffersActive()}
                disabled={loadingOffersActive}
              >
                {loadingOffersActive ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <Card>
              <TableContainer>
                <Table stickyHeader aria-label="active offers table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingOffersActive ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      offersActive?.rows.map((row: any, index: number) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.campaignRun?.project?.name}</TableCell>
                          <TableCell>
                            <div className='w-100 overflow-hidden'>
                              <h6 className='mt-1 mb-1'>{row.campaignRun?.campaign?.name}</h6>
                              <span className='font-13'>
                                RID:
                                <strong className='text-muted ms-1'>{row.campaignRun?.code}</strong>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Image
                              className='me-3 mt-1 mb-1 rounded-circle'
                              src={sourceImage(row.agent?.user?.photo?.fileName)}
                              loader={() => sourceImage(row.agent?.user?.photo?.fileName)}
                              alt=''
                              width={TABLE_IMAGE_WIDTH}
                              height={TABLE_IMAGE_HEIGHT}
                            />
                            <div className='w-100 overflow-hidden'>
                              <h6 className='mt-1 mb-1'>{row.agent?.user?.name}</h6>
                            </div>
                          </TableCell>
                          <TableCell>{row.created}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        )}

        {tabIndex === 1 && (
          <div className="tab-pane mt-3" id="recalled-offers">
            <div className="btn-group btn-group-sm mb-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleReinstate}
                disabled={reinstating}
                sx={{ mb: 2 }}>
                Reinstate
              </Button>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search agent..."
                value={searchRecycled || ''}
                onChange={(e) => setSearchRecycled(e.target.value === '' ? undefined : e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => loadOffersRecycled()}
                disabled={loadingOffersRecycled}
              >
                {loadingOffersRecycled ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <Card>
              <TableContainer>
                <Table stickyHeader aria-label="recalled offers table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingOffersRecycled ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      offersRecycled?.rows.map((row: any, index: number) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.campaignRun?.project?.name}</TableCell>
                          <TableCell>
                            <div className='w-100 overflow-hidden'>
                              <h6 className='mt-1 mb-1'>{row.campaignRun?.campaign?.name}</h6>
                              <span className='font-13'>
                                RID:
                                <strong className='text-muted ms-1'>{row.campaignRun?.code}</strong>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Image
                              className='me-3 mt-1 mb-1 rounded-circle'
                              src={sourceImage(row.agent?.user?.photo?.fileName)}
                              loader={() => sourceImage(row.agent?.user?.photo?.fileName)}
                              alt=''
                              width={TABLE_IMAGE_WIDTH}
                              height={TABLE_IMAGE_HEIGHT}
                            />
                            <div className='w-100 overflow-hidden'>
                              <h6 className='mt-1 mb-1'>{row.agent?.user?.name}</h6>
                            </div>
                          </TableCell>
                          <TableCell>{row.created}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        )}
      </div>
    </DashboardContent>
  );
}
