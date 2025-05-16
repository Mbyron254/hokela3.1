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
  Checkbox,
  InputAdornment,
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
    { id: 'select', label: '', minWidth: 50 },
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
  }, [session?.user?.role?.clientTier1?.id, getOffersActive, getOffersRecycled, searchActive, searchRecycled]);

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
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Search agent..."
                value={searchActive || ''}
                onChange={(e) => setSearchActive(e.target.value === '' ? undefined : e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loadingOffersActive}
                        onClick={() => loadOffersActive()}
                      >
                        {loadingOffersActive ? (
                          <CircularProgress size={20} />
                        ) : (
                          'Search'
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, marginRight: 2 }}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={handleRecall}
              disabled={recalling}
              sx={{ mb: 2 }}
            >
              Recall
            </Button>

            <Card>
              <TableContainer>
                <Table stickyHeader aria-label="active offers table">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedActive.length > 0 && selectedActive.length < offersActive?.rows.length}
                          checked={offersActive?.rows.length > 0 && selectedActive.length === offersActive?.rows.length}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedActive(offersActive?.rows.map((row: any) => row.id) || []);
                            } else {
                              setSelectedActive([]);
                            }
                          }}
                        />
                      </TableCell>
                      {columns.slice(1).map((column) => (
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
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id} selected={selectedActive.includes(row.id)}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedActive.includes(row.id)}
                              onChange={() => {
                                const selectedIndex = selectedActive.indexOf(row.id);
                                let newSelected: string[] = [];

                                if (selectedIndex === -1) {
                                  newSelected = newSelected.concat(selectedActive, row.id);
                                } else if (selectedIndex === 0) {
                                  newSelected = newSelected.concat(selectedActive.slice(1));
                                } else if (selectedIndex === selectedActive.length - 1) {
                                  newSelected = newSelected.concat(selectedActive.slice(0, -1));
                                } else if (selectedIndex > 0) {
                                  newSelected = newSelected.concat(
                                    selectedActive.slice(0, selectedIndex),
                                    selectedActive.slice(selectedIndex + 1),
                                  );
                                }

                                setSelectedActive(newSelected);
                              }}
                            />
                          </TableCell>
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
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Search agent..."
                value={searchRecycled || ''}
                onChange={(e) => setSearchRecycled(e.target.value === '' ? undefined : e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loadingOffersRecycled}
                        onClick={() => loadOffersRecycled()}
                      >
                        {loadingOffersRecycled ? (
                          <CircularProgress size={20} />
                        ) : (
                          'Search'
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, marginRight: 2 }}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={handleReinstate}
              disabled={reinstating}
              sx={{ mb: 2 }}
            >
              Reinstate
            </Button>

            <Card>
              <TableContainer>
                <Table stickyHeader aria-label="recalled offers table">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedRecycled.length > 0 && selectedRecycled.length < offersRecycled?.rows.length}
                          checked={offersRecycled?.rows.length > 0 && selectedRecycled.length === offersRecycled?.rows.length}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedRecycled(offersRecycled?.rows.map((row: any) => row.id) || []);
                            } else {
                              setSelectedRecycled([]);
                            }
                          }}
                        />
                      </TableCell>
                      {columns.slice(1).map((column) => (
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
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id} selected={selectedRecycled.includes(row.id)}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRecycled.includes(row.id)}
                              onChange={() => {
                                const selectedIndex = selectedRecycled.indexOf(row.id);
                                let newSelected: string[] = [];

                                if (selectedIndex === -1) {
                                  newSelected = newSelected.concat(selectedRecycled, row.id);
                                } else if (selectedIndex === 0) {
                                  newSelected = newSelected.concat(selectedRecycled.slice(1));
                                } else if (selectedIndex === selectedRecycled.length - 1) {
                                  newSelected = newSelected.concat(selectedRecycled.slice(0, -1));
                                } else if (selectedIndex > 0) {
                                  newSelected = newSelected.concat(
                                    selectedRecycled.slice(0, selectedIndex),
                                    selectedRecycled.slice(selectedIndex + 1),
                                  );
                                }

                                setSelectedRecycled(newSelected);
                              }}
                            />
                          </TableCell>
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
