'use client';

import { useEffect } from 'react';

import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';

// import { useEffect, useState } from 'react';
import { useTabs } from 'src/hooks/use-tabs';

import { GQLQuery, GQLMutation } from 'src/lib/client';
// import { agentContext } from 'src/lib/helpers';
import { M_AGENT } from 'src/lib/mutations/agent.mutation';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';

import {Iconify} from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {AccountGeneral} from '../account-general';
import AccountVerification from '../account-verify';
import { AccountNotifications } from '../account-notifications';




const TABS = [
    {
      value: 'general',
      label: 'General',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'notifications',
      label: 'Notifications',
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
    {
      value: 'verification',
      label: 'Verification',
      icon: <Iconify icon="bitcoin-icons:verify-filled" width={24} />,
    },
 
   
   
  ];
export default function AccountView() {
  const settings = useSettingsContext();

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

  const loadAgent = () => {
    if (session?.user?.agent?.id) {
      getAgent({ variables: { input: { id: session.user.agent.id } } });
    }
  };
  useEffect(() => loadAgent(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [session?.user?.agent?.id]);
  console.log(agent, 'AGENT');
  console.log(session?.user, 'USER');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.v2.agent.root },
          { name: 'User', href: paths.v2.agent.profile },
          { name: 'Account' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && <AccountGeneral  agent={session?.user} />}

     

      {tabs.value === 'notifications' && <AccountNotifications />}

      {tabs.value === 'verification' && <AccountVerification agent={agent} />}

    </DashboardContent>
  );
//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
//       <Tabs
//         value={currentTab}
//         onChange={(e, newValue) => setCurrentTab(newValue)}
//         sx={{
//           mb: 5,
//           bgcolor: 'background.neutral',
//           borderRadius: 1,
//         }}
//       >
//         {TABS.map((tab) => (
//           <Tab
//             key={tab.value}
//             label={tab.label}
//             icon={tab.icon}
//             value={tab.value}
//             iconPosition="start"
//           />
//         ))}
//       </Tabs>

//       {currentTab === 'general' &&  <Typography>General</Typography>    }

//       {currentTab === 'security' && <Typography>Security</Typography>}

//       {currentTab === 'notifications' && <Typography>Notifications</Typography>}
//     </Container>
//   );
}
