'use client';

import { useEffect } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation } from 'src/lib/client';
import { M_CLIENT_T1 } from 'src/lib/mutations/client-t1.mutation';
import { paths } from 'src/routes/paths';

type Props = {
  clientId: string;
};
export default function EnterpriseDetailsView({ clientId }: Props) {
  // ------------------------------------------------------------------------
  const { action: getClient, data: client } = GQLMutation({
    mutation: M_CLIENT_T1,
    resolver: 'tier1Client',
    toastmsg: false,
  });

  const loadClient = () => {
    if (clientId) {
      getClient({ variables: { input: { clientId } } });
    }
  };

  useEffect(() => {
    loadClient();
  }, []);

  console.log(client, 'CLIENT');

  // ------------------------------------------------------------------------

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Clients Details"
        links={[
          { name: 'Dashboard', href: paths.v2.admin.root },
          { name: 'Enterprise Clients', href: paths.v2.admin.clients.enterprise.root },
          { name: 'Details' },
        ]}
      />
    </DashboardContent>
  );
}
