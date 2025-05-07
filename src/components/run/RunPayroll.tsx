'use client';

import Image from 'next/image';

import { GQLMutation } from '@/lib/client';
import { M_RUN_PAYROLL } from '@/lib/mutations/payroll.mutation';
import { FC, useEffect } from 'react';
import { DataTable } from '../DataTable';
import { sourceImage } from '@/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import { parseRunOfferType, parseUserState } from '@/lib/helpers';
import { TERunPayroll } from '../table-extensions/TERunPayroll';

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

  const loadPayroll = (page?: number, pageSize?: number) => {
    if (runId) {
      getPayroll({ variables: { input: { runId, page, pageSize } } });
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
      cell: (row: any) => {
        const { theme, label } = parseUserState(row.agent.user.state);

        return (
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
              <span className={`badge badge-outline-${theme}`}>{label}</span>
            </div>
          </>
        );
      },
    },
    {
      name: 'TEAM',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.team?.name,
      cell: (row: any) => {
        const isTL = row.agent.user.id === row.team?.leader?.user?.id;

        return (
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.team?.name}</h6>
            <span className={`badge badge-outline-${isTL ? 'success' : 'primary'} me-2`}>
              {isTL ? 'Team Leader' : parseRunOfferType(row.offerType)}
            </span>
          </div>
        );
      },
    },
    {
      name: 'CHECK-IN',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.checkedInDates.length,
      cell: (row: any) => (
        <span>
          {row.checkedInDates.length}
          <span className="text-muted ms-1">Days</span>
        </span>
      ),
    },
    // {
    //   name: 'WORKED',
    //   sortable: true,
    //   wrap: true,
    //   selector: (row: any) => row.checkedInDates.length,
    //   cell: (row: any) => (
    //     <span>
    //       -<span className="text-muted ms-1">Days</span>
    //     </span>
    //   ),
    // },
    {
      name: 'SALES',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.checkedInDates.length,
      cell: (row: any) => (
        <span>
          -<span className="text-muted ms-1">Days</span>
        </span>
      ),
    },
    // {
    //   name: 'SAMPLING',
    //   sortable: true,
    //   wrap: true,
    //   selector: (row: any) => row.checkedInDates.length,
    //   cell: (row: any) => (
    //     <span>
    //       -<span className="text-muted ms-1">Days</span>
    //     </span>
    //   ),
    // },
    // {
    //   name: 'SALES GIVEAWAY',
    //   sortable: true,
    //   wrap: true,
    //   selector: (row: any) => row.checkedInDates.length,
    //   cell: (row: any) => (
    //     <span>
    //       -<span className="text-muted ms-1">Days</span>
    //     </span>
    //   ),
    // },
    // {
    //   name: 'REPORT QUALITY',
    //   sortable: true,
    //   wrap: true,
    //   selector: (row: any) => row.checkedInDates.length,
    //   cell: (row: any) => (
    //     <span>
    //       -<span className="text-muted ms-1">Days</span>
    //     </span>
    //   ),
    // },
  ];

  return (
    <DataTable
      expanded={false}
      selectable={false}
      columns={columns}
      loading={loadingPayroll}
      totalRows={payroll?.count}
      data={payroll?.rows}
      handleReloadMutation={loadPayroll}
      reloadTriggers={[runId]}
      tableExpansion={TERunPayroll}
    />
  );
};
