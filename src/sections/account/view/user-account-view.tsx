'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AccountGeneral } from '../account-general';
import { AccountBilling } from '../account-billing';
import { AccountSocialLinks } from '../account-social-links';
import { AccountNotifications } from '../account-notifications';
import { AccountChangePassword } from '../account-change-password';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { agentContext } from 'src/lib/helpers';
import { InputAccountUpdate } from 'src/lib/interface/auth.interface';
import { IDocumentWrapper } from 'src/lib/interface/dropzone.type';
import { IAgentOriginContext } from 'src/lib/interface/general.interface';
import { M_AGENT, M_AGENT_UPDATE_SELF } from 'src/lib/mutations/agent.mutation';
import { USER_UPDATE_SELF } from 'src/lib/mutations/user.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  { value: 'billing', label: 'Billing', icon: <Iconify icon="solar:bill-list-bold" width={24} /> },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  { value: 'social', label: 'Social links', icon: <Iconify icon="solar:share-bold" width={24} /> },
  { value: 'security', label: 'Security', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
];

// ----------------------------------------------------------------------

export function AccountView() {
  const tabs = useTabs('general');
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const { action: getAgent, data: agent } = GQLMutation({
    mutation: M_AGENT,
    resolver: 'agent',
    toastmsg: false,
  });
  
  // const {
  //   action: update,
  //   loading: updating,
  //   data: updated,
  // } = GQLMutation({
  //   mutation: M_AGENT_UPDATE_SELF,
  //   resolver: 'agentUpdateSelf',
  //   toastmsg: true,
  // });
  // const {
  //   action: updateAccount,
  //   loading: updatingAccount,
  //   data: updatedAccount,
  // } = GQLMutation({
  //   mutation: USER_UPDATE_SELF,
  //   resolver: 'userUpdateAccountSelf',
  //   toastmsg: true,
  // });
  // const [context, setContext] = useState<IAgentOriginContext>();
  // const [documentsNin, setDocumentsNin] = useState<IDocumentWrapper[]>([]);
  // const [documentsTin, setDocumentsTin] = useState<IDocumentWrapper[]>([]);
  // const [documentsHin, setDocumentsHin] = useState<IDocumentWrapper[]>([]);
  // const [documentsSsn, setDocumentsSsn] = useState<IDocumentWrapper[]>([]);

  
  const [input, setInput] = useState<InputAccountUpdate>({
    id: undefined,
    passwordCurrent: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    photoId: undefined,
    password: undefined,
    passwordConfirmartion: undefined,
  });

  const loadAgent = () => {
    if (session?.user?.agent?.id) {
      getAgent({ variables: { input: { id: session.user.agent.id } } });
    }
  };
  // const handleUpdate = (_key: string, _value: string) => {
  //   update({ variables: { input: { [_key]: _value } } });
  // };
  // const handleUpdateAccount = () => {
  //   updateAccount({ variables: { input } });
  // };

  useEffect(() => loadAgent(), [session?.user?.agent?.id]);
  // useEffect(() => {
  //   if (session?.user?.phone) {
  //     setContext(agentContext(session.user.phone.substring(0, 3)));
  //   }
  // }, [session?.user?.phone]);
  // useEffect(() => {
  //   if (documentsNin?.length) {
  //     handleUpdate('ninId', documentsNin[documentsNin.length - 1].meta?.id);
  //   }
  // }, [documentsNin]);
  // useEffect(() => {
  //   if (documentsTin?.length) {
  //     handleUpdate('tinId', documentsTin[documentsTin.length - 1].meta?.id);
  //   }
  // }, [documentsTin]);
  // useEffect(() => {
  //   if (documentsHin?.length) {
  //     handleUpdate('hinId', documentsHin[documentsHin.length - 1].meta?.id);
  //   }
  // }, [documentsHin]);
  // useEffect(() => {
  //   if (documentsSsn?.length) {
  //     handleUpdate('ssnId', documentsSsn[documentsSsn.length - 1].meta?.id);
  //   }
  // }, [documentsSsn]);
  
  useEffect(() => {
    if (session?.user) {
      setInput({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        photoId: session.user.profile?.photo?.id,
      });
    }
  }, [session?.user]);


  console.log('AGENT  ', input);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.v2.agent.root },
          { name: 'Account', href: paths.v2.agent.account },
          // { name: 'Account' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && <AccountGeneral />}

      {tabs.value === 'billing' && (
        <AccountBilling
          plans={_userPlans}
          cards={_userPayment}
          invoices={_userInvoices}
          addressBook={_userAddressBook}
        />
      )}

      {tabs.value === 'notifications' && <AccountNotifications />}

      {tabs.value === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />}

      {tabs.value === 'security' && <AccountChangePassword />}
    </DashboardContent>
  );
}
