'use client';

import React, { useEffect, useCallback } from 'react';
// import { useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { M_OPEN_JOBS } from 'src/lib/mutations/run.mutation';
import { formatDate } from 'src/lib/helpers';
import { sourceImage } from 'src/lib/server';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const JobListView = () => {
  const { action: getJobs, data: runs } = GQLMutation({
    mutation: M_OPEN_JOBS,
    resolver: 'openJobs',
    toastmsg: false,
  });

  const loadRunsActive = useCallback((page?: number, pageSize?: number) => {
    getJobs({ variables: { input: { page, pageSize } } });
  }, [getJobs]);

  useEffect(() => {
    loadRunsActive();
  }, [loadRunsActive]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Janta"
        links={[
          { name: 'Agent', href: paths.v2.agent.root },
          { name: 'Janta', href: paths.v2.agent.janta.root },
        ]}
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Name</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {runs?.rows?.map((run: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <a href={`/v2/agent/dashboard/janta/${run.id}`}>{run.name}</a>
                  </TableCell>
                  <TableCell>
                    {run?.campaign?.project?.clientTier2?.clientTier1?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span dangerouslySetInnerHTML={{
                      __html: `${(run.campaign?.jobDescription || '').substr(0, 100)}...`,
                    }} />
                  </TableCell>
                  <TableCell>
                    {formatDate(run.closeAdvertOn)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      href={`/v2/agent/dashboard/janta/${run.id}`}
                    >
                      Read and Apply
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
};

export default JobListView;
