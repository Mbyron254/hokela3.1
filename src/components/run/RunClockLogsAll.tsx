'use client';

import Image from 'next/image';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { GQLMutation } from 'src/lib/client';
import { CLOCKS_LOGS } from 'src/lib/mutations/clock.mutation';
import { FC, useState } from 'react';
import { formatDate } from 'src/lib/helpers';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';

export const RunClockLogsAll: FC<{
  run: any;
}> = ({ run }) => {
  const {
    action: getClockLogs,
    loading: loadingClockLogs,
    data: clockLogs,
  } = GQLMutation({
    mutation: CLOCKS_LOGS,
    resolver: 'clockLogs',
    toastmsg: false,
  });

  const [filters, setFilters] = useState<{ dateStart?: Date; dateStop?: Date }>({
    dateStart: undefined,
    dateStop: undefined,
  });

  const loadClockLogs = (page?: number, pageSize?: number) => {
    if (run.id) {
      getClockLogs({ variables: { input: { ...filters, runId: run.id, page, pageSize } } });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-2">
            <TextField
              label="From"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={filters.dateStart ? filters.dateStart.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateStart: e.target.value === '' ? undefined : new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-2">
            <TextField
              label="To"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={filters.dateStop ? filters.dateStop.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateStop: e.target.value === '' ? undefined : new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="col-md-4">
          <Button variant="contained" color="primary" onClick={() => loadClockLogs()}>
            Load Logs
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>MODE</TableCell>
              <TableCell>CLOCK-IN TIME</TableCell>
              <TableCell>CLOCK-OUT TIME</TableCell>
              <TableCell>PHOTO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clockLogs?.rows.map((row: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{row.index}</TableCell>
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
                    <span className="text-muted font-13">{row.agent.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{row.run?.clockType}</TableCell>
                <TableCell>{row.clockInAt ? formatDate(row.clockInAt, 'yyyy MMM dd, hh:mm b') : '---'}</TableCell>
                <TableCell>{row.clockOutAt ? formatDate(row.clockOutAt, 'yyyy MMM dd, hh:mm b') : '---'}</TableCell>
                <TableCell>
                  {(row.run?.clockInPhotoLabel || row.run?.clockOutPhotoLabel) && (
                    <Image
                      className="rounded mt-1 mb-1"
                      alt=""
                      src={sourceImage(row.clockPhoto?.fileName)}
                      loader={() => sourceImage(row.clockPhoto?.fileName)}
                      width={40}
                      height={30}
                      data-bs-toggle="modal"
                      data-bs-target={`#clock-image-${row.id}`}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
