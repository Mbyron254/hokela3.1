'use client';

import Image from 'next/image';

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function Page() {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  useEffect(() => {
    console.log('SESSION:',session);
  }, []);

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

  const [columns] = useState([
    { id: 'index', label: '#', minWidth: 60 },
    { id: 'project', label: 'PROJECT', minWidth: 100 },
    { id: 'campaign', label: 'CAMPAIGN', minWidth: 100 },
    { id: 'agent', label: 'AGENT', minWidth: 100 },
    { id: 'joined', label: 'JOINED RUN ON', minWidth: 100 },
  ]);

  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      if (session?.user?.role?.clientTier1?.id) {
        getOffersActive({
          variables: {
            input: {
              search: searchActive,
              clientTier1Id: session.user.role.clientTier1.id
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
    }
  }, [session,  getOffersActive, getOffersRecycled, searchActive, searchRecycled]);

  const loadOffersActive = () => {
    getOffersActive({
      variables: { input: { search: searchActive, clientTier1Id: session.user.role.clientTier1.id } },
    });
  };

  const loadOffersRecycled = () => {
    getOffersRecycled({
      variables: { input: { search: searchRecycled, clientTier1Id: session.user.role.clientTier1.id } },
    });
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

      <ul className="nav nav-tabs nav-bordered mb-2">
        <li className="nav-item">
          <a href="#active-offers" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
            Active Offers
          </a>
        </li>
        <li className="nav-item">
          <a href="#recalled-offers" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
            Recalled Offers
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="active-offers">
          <div className="btn-group btn-group-sm mb-2">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRecall}
              disabled={recalling}
            >
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

        <div className="tab-pane" id="recalled-offers">
          <div className="btn-group btn-group-sm mb-2">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReinstate}
              disabled={reinstating}
            >
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
      </div>
    </DashboardContent>
  );
}
