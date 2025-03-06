'use client';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

export default function EnterpriseDetailsView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Clients Details"
        links={[
          { name: 'Dashboard', href: paths.v2.admin.root },
          { name: 'Enterprise Clients', href: paths.v2.admin.clients.enterprise },
          { name: 'Details' },
        ]}
      />
    </DashboardContent>
  );
}
