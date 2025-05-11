'use client';

import Image from 'next/image';
import { GQLMutation } from 'src/lib/client';
import { M_RUN_PAYROLL } from 'src/lib/mutations/payroll.mutation';
import { FC, useEffect } from 'react';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { parseRunOfferType, parseUserState } from 'src/lib/helpers';

// Import Material-UI components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const RunPayroll: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getPayroll,
    loading: loadingPayroll,
    data: payroll,
  } = GQLMutation({
    mutation: M_RUN_PAYROLL,
    resolver: 'runPayroll',
    toastmsg: false,
  });


  useEffect(() => {
    if (runId) {
      getPayroll({ variables: { input: { runId } } });
    }
  }, [runId, getPayroll]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>NAME</TableCell>
            <TableCell>TEAM</TableCell>
            <TableCell>CHECK-IN</TableCell>
            <TableCell>SALES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payroll?.rows.map((row: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Image
                  className="me-2 mt-1 mb-1 rounded-circle"
                  alt=""
                  src={sourceImage(row.agent?.user?.profile?.photo?.fileName)}
                  loader={() => sourceImage(row.agent?.user?.profile?.photo?.fileName)}
                  width={TABLE_IMAGE_WIDTH}
                  height={TABLE_IMAGE_HEIGHT}
                />
                <div className="w-100 overflow-hidden">
                  <h6 className="mt-1 mb-1">{row.agent.user.name}</h6>
                  <span className={`badge badge-outline-${parseUserState(row.agent.user.state).theme}`}>
                    {parseUserState(row.agent.user.state).label}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="w-100 overflow-hidden">
                  <h6 className="mt-1 mb-1">{row.team?.name}</h6>
                  <span className={`badge badge-outline-${row.agent.user.id === row.team?.leader?.user?.id ? 'success' : 'primary'} me-2`}>
                    {row.agent.user.id === row.team?.leader?.user?.id ? 'Team Leader' : parseRunOfferType(row.offerType)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span>
                  {row.checkedInDates.length}
                  <span className="text-muted ms-1">Days</span>
                </span>
              </TableCell>
              <TableCell>
                <span>
                  -<span className="text-muted ms-1">Days</span>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
