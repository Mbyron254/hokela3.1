'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FC, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { DataTable } from '../DataTable';
import { sourceImage } from '@/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import { M_AGENTS_PERFORMANCE } from '@/lib/mutations/analytics.mutation';
import { commafy } from '@/lib/helpers';

export const AgentsPerformance: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getPerformances,
    loading: loadingPerformances,
    data: performances,
  } = GQLMutation({
    mutation: M_AGENTS_PERFORMANCE,
    resolver: 'agentsRunPerformances',
    toastmsg: false,
  });

  const [filters, setFilters] = useState<{ date?: Date }>({
    date: undefined,
  });

  const columns = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'AGENT',
      width: '250px',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.agent?.user?.name,
      cell: (row: any) => (
        <>
          <Image
            className="me-3 mt-1 mb-1 rounded-circle"
            src={sourceImage(row.agent?.user?.profile?.photo?.fileName)}
            loader={() => sourceImage(row.agent?.user?.profile?.photo?.fileName)}
            alt=""
            width={TABLE_IMAGE_WIDTH}
            height={TABLE_IMAGE_HEIGHT}
          />
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.agent?.user?.name}</h6>
            <span className="font-13 text-muted">{row.agent?.user?.accountNo}</span>
          </div>
        </>
      ),
    },
    {
      name: 'CHECK-IN',
      width: '110px',
      sortable: true,
      wrap: true,
      center: false,
      selector: (row: any) => row.clockedIn,
      cell: (row: any) => (
        <i className={`mdi mdi-check-decagram text-${row.clockedIn ? 'success' : 'danger'} font-16`} />
      ),
    },
    {
      name: 'CHECK-OUT',
      width: '122px',
      sortable: true,
      wrap: true,
      center: false,
      selector: (row: any) => row.clockedOut,
      cell: (row: any) => (
        <i className={`mdi mdi-check-decagram text-${row.clockedOut ? 'success' : 'danger'} font-16`} />
      ),
    },
    {
      name: 'SALES MADE',
      width: '127px',
      sortable: true,
      wrap: true,
      reorder: true,
      // center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="mt-1 mb-1 fw-normal">
            <span className="">{row.sales.achievedUnits}</span>
            <span className="text-muted" style={{ marginRight: '2px', marginLeft: '2px' }}>
              /
            </span>
            <span className="me-1">{row.sales.targetUnits}</span>
            <strong className="font-13 text-muted">({row.sales.achievedPercentage}%)</strong>
          </h6>
        </div>
      ),
    },
    {
      name: 'SURVEY REPORTS',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="mt-1 mb-1 fw-normal">
            <span className="">{row.surveyReports.achievedUnits}</span>
            <span className="text-muted" style={{ marginRight: '2px', marginLeft: '2px' }}>
              /
            </span>
            <span className="me-1">{row.surveyReports.targetUnits}</span>
            <strong className="font-13 text-muted">({row.surveyReports.achievedPercentage}%)</strong>
          </h6>
        </div>
      ),
    },
    {
      name: 'SALES GIVEAWAY',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="mt-1 mb-1 fw-normal">
            <span className="">{row.salesGiveawayReports.achievedUnits}</span>
            <span className="text-muted" style={{ marginRight: '2px', marginLeft: '2px' }}>
              /
            </span>
            <span className="me-1">{row.salesGiveawayReports.targetUnits}</span>
            <strong className="font-13 text-muted">
              ({row.salesGiveawayReports.achievedPercentage}%)
            </strong>
          </h6>
        </div>
      ),
    },
    {
      name: 'SAMPLING REPORTS',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="mt-1 mb-1 fw-normal">
            <span className="">{row.freeGiveawayReports.achievedUnits}</span>
            <span className="text-muted" style={{ marginRight: '2px', marginLeft: '2px' }}>
              /
            </span>
            <span className="me-1">{row.freeGiveawayReports.targetUnits}</span>
            <strong className="font-13 text-muted">
              ({row.freeGiveawayReports.achievedPercentage}%)
            </strong>
          </h6>
        </div>
      ),
    },
    {
      name: 'PERFORMANCE',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.overallPercentScore,
      cell: (row: any) => (
        <div className="row text-center py-2">
          <div className="col-12">
            <h5 className="fw-normal">
              <span>{row.overallPercentScore}%</span>
              <i
                className={`mdi mdi-trending-${row.overallPercentScore === 0 ? 'down' : 'up'} text-${
                  row.overallPercentScore === 0 ? 'danger' : 'success'
                } mt-3 ms-1`}
              />
            </h5>
          </div>
        </div>
      ),
    },
    {
      name: 'BASIC EARNED',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.totalBasicEarned,
      cell: (row: any) => (
        <h5>
          <span className="fw-normal text-muted me-1">ksh</span>
          <span
            className={`badge badge-outline-${
              row.totalBasicEarned === 0 ? 'warning' : 'info'
            } p-1 font-14 fw-normal`}
          >
            {commafy(row.totalBasicEarned.toFixed(2))}
          </span>
        </h5>
      ),
    },
    {
      name: 'BONUS EARNED',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.totalBonusEarned,
      cell: (row: any) => (
        <h5>
          <span className="fw-normal text-muted me-1">ksh</span>
          <span
            className={`badge badge-outline-${
              row.totalBonusEarned === 0 ? 'secondary' : 'success'
            } p-1 font-14 fw-normal`}
          >
            {commafy(row.totalBonusEarned.toFixed(2))}
          </span>
        </h5>
      ),
    },
    {
      name: 'ADJUSTMENTS',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.created,
      cell: (row: any) => (
        <h5>
          <span className="fw-normal text-muted me-1">ksh</span>
          <span
            className={`badge badge-outline-${
              row.totalBonusEarned === 0 ? 'secondary' : 'secondary'
            } p-1 font-14 fw-normal`}
          >
            0.00
            {/* {commafy(row.totalBonusEarned.toFixed(2))} */}
          </span>
        </h5>
      ),
    },
    {
      name: 'TOTAL PAYABLE',
      width: '160px',
      sortable: true,
      wrap: true,
      reorder: true,
      selector: (row: any) => row.totalGrossEarned,
      cell: (row: any) => (
        <h5>
          <span className="fw-normal text-muted me-1">ksh</span>
          <span
            className={`badge badge-outline-${
              row.totalGrossEarned === 0 ? 'warning' : 'success'
            } p-1 font-14 fw-normal`}
          >
            {commafy(row.totalGrossEarned.toFixed(2))}
          </span>
        </h5>
      ),
    },
    {
      name: 'MORE',
      width: '70px',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <Link
          href={`/c-marketing/runs/agent/${runId}/${row.agent?.id}`}
          className="btn btn-primary btn-sm"
        >
          <i className="mdi mdi-arrow-right"></i>
        </Link>
      ),
    },
  ];

  const loadPerformances = (page?: number, pageSize?: number) => {
    if (runId) {
      getPerformances({ variables: { input: { ...filters, runId, page, pageSize } } });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              id="dateFrom"
              defaultValue={filters.date?.toDateString()}
              onChange={(e) => setFilters({ ...filters, date: new Date(e.target.value) })}
            />
          </div>
        </div>
        <div className="col-md-9"></div>
      </div>

      <DataTable
        selectable={false}
        expanded={false}
        columns={columns}
        loading={loadingPerformances}
        totalRows={performances?.count}
        data={performances?.rows}
        handleReloadMutation={loadPerformances}
        reloadTriggers={[filters.date]}
      />
    </>
  );
};
