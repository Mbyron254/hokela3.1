'use client';

import { useEffect } from 'react';

import { paths } from 'src/routes/paths';

import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_ACCOUNT_MANAGERS } from 'src/lib/queries/client.query';
import { M_CLIENT_T1 } from 'src/lib/mutations/client-t1.mutation';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

type Props = {
  id: string;
};
export default function EnterpriseDetailsView({ id }: Props) {
  // ------------------------------------------------------------------------
  const { action: getClient, data: client } = GQLMutation({
    mutation: M_CLIENT_T1,
    resolver: 'tier1Client',
    toastmsg: false,
  });
  const { data: managers } = GQLQuery({
    query: Q_ACCOUNT_MANAGERS,
    queryAction: 'clientAccountManagers',
    variables: {
      input: {
        clientTier1Id: id,
      },
    },
  });

  const loadClient = () => {
    if (id) {
      getClient({ variables: { input: { id } } });
    }
  };

  useEffect(
    () => {
      loadClient();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  console.log(client, 'CLIENT');
  console.log(managers, 'Managers');

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
