'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/run-application.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { M_MAKE_JANTA_OFFERS } from 'src/lib/mutations/run-offer.mutation';
import { formatDate } from 'src/lib/helpers';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function Page() {
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
    resolver: 'm_runApplications',
    toastmsg: false,
  });
  const {
    action: makeOffer,
    loading: offering,
  } = GQLMutation({
    mutation: M_MAKE_JANTA_OFFERS,
    resolver: 'makeJantaOffers',
    toastmsg: true,
  });

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();

  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      getApplications({
        variables: {
          input: { search, clientTier1Id: session.user.role.clientTier1.id },
        },
      });
    }
  }, [session, getApplications, search]);

  const handleMakeOffer = () => {
    if (selected.length) {
      makeOffer({ variables: { input: { applicationIds: selected } } });
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Applications"
        links={[
          { name: 'Marketing', href: paths.v2.marketing.root },
          { name: 'Janta', href: paths.v2.marketing.janta.applications },
          { name: 'Applications' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <div className="app-search" style={{ marginBottom: '16px' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search agent..."
              value={search || ''}
              onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="button"
              disabled={loadingApplications}
              onClick={() => getApplications({
                variables: {
                  input: { search, clientTier1Id: session.user.role.clientTier1.id },
                },
              })}
            >
              {loadingApplications ? (
                <>
                  <CircularProgress size={20} style={{ marginRight: '8px' }} />
                  Searching
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleMakeOffer}
          disabled={offering}
          sx={{ mb: 2 }}
        >
          Make Offer
        </Button>

        <TableContainer>
          <Table stickyHeader aria-label="applications table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>AGENT</TableCell>
                <TableCell>PROJECT</TableCell>
                <TableCell>CAMPAIGN</TableCell>
                <TableCell>APPLIED ON</TableCell>
                <TableCell>DEADLINE</TableCell>
                <TableCell>MORE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingApplications ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                applications?.rows.map((row: any, index: number) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{index + 1}</TableCell>
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
                    <TableCell>{row.campaignRun?.project?.name}</TableCell>
                    <TableCell>
                      <div className='w-100 overflow-hidden'>
                        <h6 className='mt-1 mb-1'>{row.campaignRun?.campaign?.name}</h6>
                        <span className='font-11'>
                          RID:
                          <strong className='text-muted ms-1'>{row.campaignRun?.code}</strong>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{row.created}</TableCell>
                    <TableCell>{formatDate(row.campaignRun?.closeAdvertOn)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        href={`/c-marketing/jobs/applications/${row.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
}
