'use client';

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';

import { GQLMutation } from 'src/lib/client';
import { AGENTS_LATEST_CLOCK } from 'src/lib/mutations/clock.mutation';
import { sourceImage } from 'src/lib/server';
import { FC, useState } from 'react';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { formatDate } from 'src/lib/helpers';

export const RunClockLogsLatest: FC<{
  run: any;
}> = ({ run }) => {
  const {
    action: getLatestClocks,
    loading: loadingLatestClocks,
    data: clocks,
  } = GQLMutation({
    mutation: AGENTS_LATEST_CLOCK,
    resolver: 'agentsLatestClocks',
    toastmsg: false,
  });

  const [filters, setFilters] = useState<{ dateStart?: Date; dateStop?: Date }>({
    dateStart: undefined,
    dateStop: undefined,
  });

  const loadLatestClocks = (page?: number, pageSize?: number) => {
    if (run.id) {
      getLatestClocks({ variables: { input: { ...filters, runId: run.id, page, pageSize } } });
    }
  };

  const columns = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'NAME',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.agent.user.name,
      cell: (row: any) => (
        <>
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
        </>
      ),
    },
    {
      name: 'MODE',
      width: '95px',
      sortable: true,
      selector: (row: any) => row.run?.clockType,
      cell: (row: any) => row.run?.clockType,
    },
    {
      name: 'CLOCK-IN TIME',
      width: '177px',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.clockInAt,
      cell: (row: any) => (row.clockInAt ? formatDate(row.clockInAt, 'yyyy MMM dd, hh:mm b') : '---'),
    },
    {
      name: 'CLOCK-OUT TIME',
      width: '177px',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.clockOutAt,
      cell: (row: any) => (row.clockOutAt ? formatDate(row.clockOutAt, 'yyyy MMM dd, hh:mm b') : '---'),
    },
    {
      name: 'PHOTO',
      width: '40',
      sortable: false,
      wrap: true,
      selector: (row: any) => row.clockMode,
      cell: (row: any) => (
        <>
          {(row.run?.clockInPhotoLabel || row.run?.clockOutPhotoLabel) && (
            <>
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

              <div
                id={`clock-image-${row.id}`}
                className="modal fade"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title" id="myCenterModalLabel">
                        {row.clockInAt ? 'Clock in ' : row.clockOutAt ? 'Clock out ' : ''}
                        {row.run.clockInPhotoLabel
                          ? row.run.clockInPhotoLabel.toLowerCase()
                          : row.run.clockOutPhotoLabel
                          ? row.run.clockOutPhotoLabel.toLowerCase()
                          : 'photo not found'}
                      </h4>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="modal-body text-center pt-0 p-2">
                      <img
                        src={sourceImage(row.clockPhoto?.fileName)}
                        alt=""
                        className=""
                        width="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-2">
            <p>From</p>
            <input
              className="form-control"
              id="dateStart"
              type="date"
              name="dateStart"
              defaultValue={filters.dateStart?.toString()}
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
            <p>To</p>
            <input
              className="form-control"
              id="dateStop"
              type="date"
              name="dateStop"
              defaultValue={filters.dateStop?.toString()}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateStop: e.target.value === '' ? undefined : new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.name}>{column.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingLatestClocks ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              clocks?.map((row: any, index: number) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.name}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
