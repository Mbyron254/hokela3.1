'use client';

import { Box, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { _mock } from 'src/_mock';
import { GQLQuery } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_SESSIONS } from 'src/lib/queries/session.query';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from '../data-grid-custom';

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

type TClientType = {
  __typename: 'TClientType';
  id: string;
  name: string;
};

type TClientTier1 = {
  __typename: 'TClientTier1';
  clientType: TClientType;
};

type TRole = {
  __typename: 'TRole';
  name: string;
  clientTier1: TClientTier1 | null;
  clientTier2: null;
};

type TUserProfile = {
  __typename: 'TUserProfile';
  darkTheme: boolean;
  photo: string | null;
};

type TUser = {
  __typename: 'TUser';
  id: string;
  name: string;
  accountNo: string;
  profile: TUserProfile;
  role: TRole;
};

type TSession = {
  __typename: 'TSession';
  index: number;
  id: string;
  locked: boolean;
  expireString: string;
  created: string;
  user: TUser;
};

type TSessions = {
  __typename: 'TSessions';
  count: number;
  rows: TSession[];
};

export function SessionsListView() {
  const usersQueryFilters = { page: 0, pageSize: 10 };

  const { refetch, data, loading } = GQLQuery({
    query: Q_SESSIONS,
    queryAction: 'sessions',
    variables: { input: usersQueryFilters },
  });

  console.log(data, 'DATA');

  return (
    <DashboardContent>
      <Card sx={{ p: 5 }}>
        <Box sx={{ height: 600 }}>
          <CustomBreadcrumbs
            heading="User Sessions"
            links={[
              { name: 'Dashboard', href: paths.v2.admin.root },
              { name: 'Sessions', href: paths.v2.admin.session },
              { name: 'List' },
            ]}
          />
          <DataGridCustom data={_dataGrid} />
        </Box>
      </Card>
    </DashboardContent>
  );
}
