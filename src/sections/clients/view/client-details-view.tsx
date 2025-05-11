'use client';

import { Fragment, useState, useEffect } from 'react';

import { Tab, Tabs, Paper, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { M_CLIENT_T2 } from 'src/lib/mutations/client-t2.mutation';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GrnList } from './grn-list-view';
import { ProductList } from './product-list-view';
import { ProductGroupList } from './product-group-list-view';

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

  

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (id) {
      getClient({ variables: { input: { id } } });
    }
  }, [getClient, id]);

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

      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-12 text-muted">Name</dt>
                <dd className="col-sm-12">{client?.name}</dd>
                <dt className="col-sm-12 text-muted">Client No.</dt>
                <dd className="col-sm-12">{client?.clientNo}</dd>
                <dt className="col-sm-12 text-muted">Client Type</dt>
                <dd className="col-sm-12">{client?.clientType?.name}</dd>
                <dt className="col-sm-12 text-muted">Projects</dt>
                <dd className="col-sm-12">
                  {client?.projects?.length} project{client?.projects?.length > 1 ? 's' : ''}
                </dd>
                <dt className="col-sm-12 text-muted">Registered</dt>
                <dd className="col-sm-12">{client?.created}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <Tabs value={currentTab} onChange={handleTabChange}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Paper variant="outlined" sx={{ p: 2.5, typography: 'body2', borderRadius: 1.5 }}>
            {currentTab === 'overview' && (
              <div className="card">
                <div className="card-body">Overview Content</div>
              </div>
            )}
            {currentTab === 'groups' && client?.id && <ProductGroupList clientTier2Id={client.id} />}
            {currentTab === 'products' && client?.id && <ProductList clientTier2Id={client.id} />}
            {currentTab === 'grn' && client?.id && <GrnList clientTier2Id={client.id} />}
          </Paper>
        </div>
      </div>
    </DashboardContent>
  );
}
