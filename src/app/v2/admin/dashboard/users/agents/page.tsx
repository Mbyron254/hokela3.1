'use client';

import { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Chip } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import Image from 'next/image';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_USERS_ACTIVE, Q_USERS_RECYCLED } from 'src/lib/queries/user.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { parseUserState } from 'src/lib/helpers';
import {
  USER_ACTVATE,
  USER_RECYCLE,
  USER_RESTORE,
  USER_SUSPEND,
} from 'src/lib/mutations/user.mutation';

// Convert the existing columns to MUI DataGrid format
const activeColumns = [
  { field: 'index', headerName: '#', width: 60 },
  {
    field: 'name',
    headerName: 'NAME',
    width: 300,
    renderCell: (params: any) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          className='rounded-circle'
          src={sourceImage(params.row.profile?.photo?.fileName)}
          loader={() => sourceImage(params.row.profile?.photo?.fileName)}
          alt=''
          width={TABLE_IMAGE_WIDTH}
          height={TABLE_IMAGE_HEIGHT}
          style={{ marginRight: 12 }}
        />
        <div>
          <Typography variant="subtitle2">{params.row.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.email}
          </Typography>
        </div>
      </div>
    ),
  },
  { field: 'accountNo', headerName: 'A/C No', width: 130 },
  { field: 'phone', headerName: 'PHONE', width: 150 },
  {
    field: 'state',
    headerName: 'STATE',
    width: 130,
    renderCell: (params: any) => {
      const { theme, label } = parseUserState(params.row.state);
      return <Chip label={label} color={theme === 'success' ? 'success' : 'error'} />;
    },
  },
  { field: 'created', headerName: 'REGISTERED', width: 180 },
];

const recycledColumns = [
  { field: 'index', headerName: '#', width: 60 },
  {
    field: 'name',
    headerName: 'NAME',
    width: 300,
    renderCell: (params: any) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          className='rounded-circle'
          src={sourceImage(params.row.profile?.photo?.fileName)}
          loader={() => sourceImage(params.row.profile?.photo?.fileName)}
          alt=''
          width={TABLE_IMAGE_WIDTH}
          height={TABLE_IMAGE_HEIGHT}
          style={{ marginRight: 12 }}
        />
        <div>
          <Typography variant="subtitle2">{params.row.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.email}
          </Typography>
        </div>
      </div>
    ),
  },
  { field: 'accountNo', headerName: 'A/C No', width: 130 },
  { field: 'phone', headerName: 'PHONE', width: 150 },
  {
    field: 'state',
    headerName: 'STATE',
    width: 130,
    renderCell: (params: any) => {
      const { theme, label } = parseUserState(params.row.state);
      return <Chip label={label} color={theme === 'success' ? 'success' : 'error'} />;
    },
  },
  { field: 'recycled', headerName: 'RECYCLED', width: 180 },
];

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const usersQueryFilters = { agents: true, page: 0, pageSize: 10 };
  const {
    refetch: reloadAgentsActive,
    data: agentsActive,
    loading: loadingAgentsActive,
  } = GQLQuery({
    query: Q_USERS_ACTIVE,
    queryAction: 'usersActive',
    variables: { input: usersQueryFilters },
  });
  const {
    refetch: reloadAgentsRecycled,
    data: agentsRecycled,
    loading: loadingAgentsRecycled,
  } = GQLQuery({
    query: Q_USERS_RECYCLED,
    queryAction: 'usersRecycled',
    variables: { input: usersQueryFilters },
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: USER_RECYCLE,
    resolver: 'userRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: USER_RESTORE,
    resolver: 'userRestore',
    toastmsg: true,
  });
  const { action: suspend, loading: suspending } = GQLMutation({
    mutation: USER_SUSPEND,
    resolver: 'userSuspend',
    toastmsg: true,
  });
  const { action: activate, loading: activating } = GQLMutation({
    mutation: USER_ACTVATE,
    resolver: 'userActivate',
    toastmsg: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
  };

  const handleSuspend = () => {
    if (selectedRows.length) {
      suspend({ variables: { input: { ids: selectedRows } } });
    }
  };
  const handleActivate = () => {
    if (selectedRows.length) {
      activate({ variables: { input: { ids: selectedRows } } });
    }
  };
  const handleRecycle = () => {
    if (selectedRows.length) {
      recycle({ variables: { input: { ids: selectedRows } } });
    }
  };
  const handleRestore = () => {
    if (selectedRows.length) {
      restore({ variables: { input: { ids: selectedRows } } });
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Agents
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab value="active" label="Active Records" />
          <Tab value="recycled" label="Recycled Records" />
        </Tabs>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            my: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {currentTab === 'active' ? (
            <>
              <Button
                variant="outlined"
                color="warning"
                disabled={selectedRows.length === 0 || suspending}
                onClick={handleSuspend}
              >
                Suspend
              </Button>
              <Button
                variant="outlined"
                color="success"
                disabled={selectedRows.length === 0 || activating}
                onClick={handleActivate}
              >
                Activate
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={selectedRows.length === 0 || recycling}
                onClick={handleRecycle}
              >
                Recycle
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              disabled={selectedRows.length === 0 || restoring}
              onClick={handleRestore}
            >
              Restore
            </Button>
          )}
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          {currentTab === 'active' ? (
            <DataGrid
              rows={agentsActive?.rows || []}
              columns={activeColumns}
              checkboxSelection
              disableRowSelectionOnClick
              loading={loadingAgentsActive}
              slots={{
                noRowsOverlay: () => <div>No data available</div>,
              }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection as string[])}
            />
          ) : (
            <DataGrid
              rows={agentsRecycled?.rows || []}
              columns={recycledColumns}
              checkboxSelection
              disableRowSelectionOnClick
              loading={loadingAgentsRecycled}
              slots={{
                noRowsOverlay: () => <div>No data available</div>,
              }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection as string[])}
            />
          )}
        </div>
      </Paper>
    </DashboardContent>
  );
}
