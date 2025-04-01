'use client';

import Image from 'next/image';

import { useState, useEffect } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { M_CAMPAIGN_RUN_OFFERS } from 'src/lib/mutations/campaign-run-offer.mutation';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
    action: getOffers,
    loading: loadingOffers,
    data: offers,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_OFFERS,
    resolver: 'm_campaignRunOffers',
    toastmsg: false,
  });

  const [columns] = useState([
    { id: 'index', label: '#', minWidth: 60 },
    { id: 'project', label: 'PROJECT', minWidth: 100 },
    { id: 'campaign', label: 'CAMPAIGN', minWidth: 100 },
    { id: 'agent', label: 'AGENT', minWidth: 100 },
    { id: 'joined', label: 'JOINED RUN ON', minWidth: 100 },
  ]);

  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      getOffers({
        variables: {
          input: { clientTier1Id: session.user.role.clientTier1.id },
        },
      });
    }
  }, [session, getOffers]);

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

      <Card>
        <TableContainer>
          <Table stickyHeader aria-label="offers table">
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
              {loadingOffers ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                offers?.rows.map((row: any, index: number) => (
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
    </DashboardContent>
  );
}
