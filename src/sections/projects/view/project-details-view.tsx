'use client';

import type { IOrderItem } from 'src/types/project';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { STATUS_OPTION } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { ProjectDetailsInfo } from '../project-details-info';
import { ProjectDetailsItems } from '../project-details-item';
import { ProjectDetailsHistory } from '../project-details-history';
import { ProjectDetailsToolbar } from '../project-details-toolbar';

// ----------------------------------------------------------------------

type Props = {
  order?: IOrderItem;
};

export function ProjectDetailsView({ order }: Props) {
  const [status, setStatus] = useState(order?.status);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  return (
    <DashboardContent>
      <ProjectDetailsToolbar
        backLink={paths.v2.marketing.root}
        orderNumber={order?.orderNumber}
        createdAt={order?.createdAt}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={STATUS_OPTION}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <ProjectDetailsItems
              items={order?.items}
              taxes={order?.taxes}
              shipping={order?.shipping}
              discount={order?.discount}
              subtotal={order?.subtotal}
              totalAmount={order?.totalAmount}
            />

            <ProjectDetailsHistory history={order?.history} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <ProjectDetailsInfo
            customer={order?.customer}
            delivery={order?.delivery}
            payment={order?.payment}
            shippingAddress={order?.shippingAddress}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
