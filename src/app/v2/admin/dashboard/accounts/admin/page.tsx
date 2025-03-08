'use client';

import { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Chip } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { NewAdminForm } from './components/NewAdminForm';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_USERS_ACTIVE, Q_USERS_RECYCLED } from 'src/lib/queries/user.query';
import {
  USER_ACTVATE,
  USER_RECYCLE,
  USER_RESTORE,
  USER_SUSPEND,
} from 'src/lib/mutations/user.mutation';
import { parseUserState } from 'src/lib/helpers';

// Column definitions
const activeColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 180 },
  { 
    field: 'state', 
    headerName: 'State', 
    width: 180, 
    renderCell: (params: any) => {
      const { theme, label } = parseUserState(params.row.state);
      return <Chip label={label} color={theme === 'success' ? 'success' : 'error'} />;
    }
  },
  { field: 'accountNo', headerName: 'Account No', width: 130 },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'created', headerName: 'Date Created', width: 180 },
];

const recycledColumns = [
  ...activeColumns.filter(col => col.field !== 'created'),
  { field: 'recycled', headerName: 'Date Recycled', width: 180 },
];

export default function Admins() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const usersQueryFilters = { admins: true, page: 0, pageSize: 10 };

  // GraphQL Queries
  const {
    refetch: reloadAdminsActive,
    data: adminsActive,
    loading: loadingAdminsActive,
  } = GQLQuery({
    query: Q_USERS_ACTIVE,
    queryAction: 'usersActive',
    variables: { input: usersQueryFilters },
  });

  const {
    refetch: reloadAdminsRecycled,
    data: adminsRecycled,
    loading: loadingAdminsRecycled,
  } = GQLQuery({
    query: Q_USERS_RECYCLED,
    queryAction: 'usersRecycled',
    variables: { input: usersQueryFilters },
  });

  // GraphQL Mutations
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
  };

  // User management handlers
  const handleNewAdmin = () => {
    setOpen(true);
  };

  const handleActivate = () => {
    if (selectedRows.length) {
      activate({ variables: { input: { ids: selectedRows } } });
    }
  };

  const handleSuspend = () => {
    if (selectedRows.length) {
      suspend({ variables: { input: { ids: selectedRows } } });
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
        Administrators
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab value="active" label="Active Records" />
          <Tab value="recycled" label="Recycled Records" />
        </Tabs>

        <NewAdminForm open={open} setOpen={setOpen} />

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
                variant="contained"
                color="primary"
                onClick={handleNewAdmin}
              >
                New Admin
              </Button>
              <Button
                variant="outlined"
                color="success"
                disabled={selectedRows.length === 0}
                onClick={handleActivate}
              >
                Activate
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={selectedRows.length === 0}
                onClick={handleSuspend}
              >
                Suspend
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={selectedRows.length === 0}
                onClick={handleRecycle}
              >
                Recycle
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                disabled={selectedRows.length === 0}
                onClick={handleRestore}
              >
                Restore
              </Button>
            </>
          )}
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          {currentTab === 'active' ? (
            <DataGrid
              rows={adminsActive?.usersActive?.users || []}
              columns={activeColumns}
              checkboxSelection
              disableRowSelectionOnClick
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
              rows={adminsRecycled?.usersRecycled?.users || []}
              columns={recycledColumns}
              checkboxSelection
              disableRowSelectionOnClick
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