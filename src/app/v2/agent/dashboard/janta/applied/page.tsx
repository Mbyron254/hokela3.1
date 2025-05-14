'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/run-application.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import {
  Box,
  Typography,
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

const Page = () => {
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

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (session?.user?.agent?.id) {
      getApplications({
        variables: {
          input: { agentId: session.user.agent.id },
        },
      });
    }
  }, [session, getApplications]);

  useEffect(() => {
    if (applications?.rows) {
      setTableData(applications.rows);
    }
  }, [applications]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Campaign</TableCell>
                <TableCell>Institution</TableCell>
                <TableCell>Applied On</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingApplications ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((row: any, index: number) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Image
                          src={sourceImage(row.run?.poster?.fileName)}
                          loader={() => sourceImage(row.run?.poster?.fileName)}
                          alt=""
                          width={TABLE_IMAGE_WIDTH}
                          height={TABLE_IMAGE_HEIGHT}
                        />
                        <Box ml={2}>
                          <Typography variant="subtitle1">{row.run?.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {row.run?.code}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{row.run?.campaign?.project?.clientTier2?.clientTier1?.name}</TableCell>
                    <TableCell>{row.created}</TableCell>
                    <TableCell>
                      <Badge
                        color={row.status === 'Accepted' ? 'success' : 'warning'}
                        badgeContent={row.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Page;