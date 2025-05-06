'use client';

import type { TCampaignRunApplications } from 'src/types/application';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';

import { _mock } from 'src/_mock';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { M_CAMPAIGN_RUN_APPLICATIONS } from 'src/lib/mutations/campaign-run-application.mutation';
import { M_MAKE_JANTA_OFFERS } from 'src/lib/mutations/run-offer.mutation';

import { DataGridCustom } from './data-grid-custom';

// ----------------------------------------------------------------------

const _dataGrid = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'alway') || (index % 4 && 'busy') || 'offline';

  return {
    id: _mock.id(index),
    status,
    email: _mock.email(index),
    name: _mock.fullName(index),
    age: _mock.number.age(index),
    lastLogin: _mock.time(index),
    isAdmin: _mock.boolean(index),
    lastName: _mock.lastName(index),
    rating: _mock.number.rating(index),
    firstName: _mock.firstName(index),
    performance: _mock.number.percent(index),
  };
});

// ----------------------------------------------------------------------

export function ApplicationsGridView() {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const {
    action: getApplications,
    loading: loadingApplications,
    data: applications,
  }: {
    action: any;
    loading: boolean;
    data: TCampaignRunApplications | undefined;
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUN_APPLICATIONS,
    resolver: 'm_campaignRunApplications',
    toastmsg: false,
  });

  const {
    action: makeOffer,
    loading: offering,
    data: offered,
  } = GQLMutation({
    mutation: M_MAKE_JANTA_OFFERS,
    resolver: 'makeJantaOffers',
    toastmsg: true,
  });

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();

  const loadApplications = (page?: number, pageSize?: number) => {
    if (session?.user?.agent?.id) {
      getApplications({
        variables: {
          input: { search, agentId: session.user.agent.id, page, pageSize },
        },
      });
    }
  };

  const handleMakeOffer = () => {
    if (selected.length) {
      makeOffer({ variables: { input: { applicationIds: selected } } });
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.agent?.id, offered]);

  console.log(applications, 'APPLICATIONS');

  // Transform applications data for the grid
  const applicationRows =
    applications?.rows?.map((app) => ({
      id: app.id,
      index: app.index,
      created: app.created,
      agentName: app.agent.user.name,
      projectName: app.campaignRun.project.name,
      campaignName: app.campaignRun.campaign.name,
      clientName: app.campaignRun.campaign.clientTier2.name,
      code: app.campaignRun.code,
      closeAdvertOn: app.campaignRun.closeAdvertOn,
    })) || [];

  return (
    <Container sx={{ my: 10 }}>
      <Stack spacing={5}>
        <Card>
          <CardHeader title="Applications" sx={{ mb: 2 }} />
          <Box sx={{ height: 720 }}>
            <DataGridCustom
              data={applicationRows}
            />
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
