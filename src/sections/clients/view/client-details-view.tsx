'use client';

import { useEffect, useState } from 'react';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Tab, Tabs, Typography } from '@mui/material';
import { Paper } from '@mui/material';
import { Fragment } from 'react';
import { Iconify } from 'src/components/iconify';

import { ProductGroupList } from './product-group-list-view';

import { GQLMutation, GQLQuery } from 'src/lib/client';

import { M_CLIENT_T2 } from 'src/lib/mutations/client-t2.mutation';

import {
  M_PRODUCT_GROUPS,
  M_PRODUCT_GROUPS_RECYCLED,
  PRODUCT_GROUP,
} from 'src/lib/mutations/product-group.mutation';
import { ProductList } from './product-list-view';
import { GrnList } from './grn-list-view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'overview', icon: <Iconify icon="solar:phone-bold" width={24} />, label: 'Overview' },
  {
    value: 'groups',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
    label: 'Product Groups',
  },
  {
    value: 'products',
    icon: <Iconify icon="eva:headphones-fill" width={24} />,
    label: 'Products',
    disabled: true,
  },
  { value: 'grn', icon: <Iconify icon="eva:headphones-fill" width={24} />, label: 'GRN' },
];

export function ClientDetailsView({ id }: { id: string }) {
  const [currentTab, setCurrentTab] = useState('overview');

  const { action: getClient, data: client } = GQLMutation({
    mutation: M_CLIENT_T2,
    resolver: 'tier2Client',
    toastmsg: false,
  });

  const clientTier2Id = client?.tier2Id;

  const loadClient = () => {
    getClient({ variables: { input: { id } } });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    loadClient();
  }, []);

  console.log('client', client);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Client Details"
        links={[
          { name: 'Dashboard', href: paths.v2.marketing.root },
          { name: 'Clients', href: paths.v2.marketing.products.overview },
          { name: 'Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleTabChange}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      <Paper variant="outlined" sx={{ p: 2.5, typography: 'body2', borderRadius: 1.5 }}>
        {currentTab === 'overview' && (
          <Fragment>
            <Typography variant="h6" gutterBottom>
              TEIBNM
            </Typography>
            Overview Content
          </Fragment>
        )}
        {currentTab === 'groups' && (
          <Fragment>
            <ProductGroupList data={[]} clientTier2Id={clientTier2Id} />
          </Fragment>
        )}
        {currentTab === 'products' && (
          <Fragment>
            <ProductList data={[]} />
          </Fragment>
        )}
        {currentTab === 'grn' && (
          <Fragment>
            <GrnList data={[]} />
          </Fragment>
        )}
      </Paper>
    </DashboardContent>
  );
}
