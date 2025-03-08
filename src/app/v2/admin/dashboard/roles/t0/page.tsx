'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { DashboardContent } from 'src/layouts/dashboard';
import Link from 'next/link';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_ROLES_ACTIVE, Q_ROLES_RECYCLED } from 'src/lib/queries/role.query';
import {
  ROLE,
  ROLE_CREATE,
  ROLE_RECYCLE,
  ROLE_RESTORE,
  ROLE_UPDATE,
} from 'src/lib/mutations/role.mutation';
import { isSystemRole } from 'src/lib/helpers';
import { IRoleCreate, IRoleUpdate } from 'src/lib/interface/role.interface';

const recycledColumns = [
  { field: 'index', headerName: '#', width: 60 },
  { field: 'name', headerName: 'Name', width: 180 },
  {
    field: 'usersCount', headerName: 'Users', width: 100,
    //valueGetter: (params: any) => params.row.users?.length
  },
  {
    field: 'permissionsCount', headerName: 'Permissions', width: 120,
    //valueGetter: (params: any) => params.row.permissions?.length
  },
  { field: 'recycled', headerName: 'Date Recycled', width: 180 }
];

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);


  const usersQueryFilters = { agentAndAdmins: true, page: 0, pageSize: 10 };

  const {
    refetch: reloadRolesActive,
    data: rolesActive,
    loading: loadingRolesActive,
  } = GQLQuery({
    query: Q_ROLES_ACTIVE,
    queryAction: 'roles',
    variables: { input: usersQueryFilters },
  });
  const {
    refetch: reloadRolesRecycled,
    data: rolesRecycled,
    loading: loadingRolesRecycled,
  } = GQLQuery({
    query: Q_ROLES_RECYCLED,
    queryAction: 'rolesRecycled',
    variables: { input: usersQueryFilters },
  });
  const {
    action: getRole,
    loading: loadingRole,
    data: role,
  } = GQLMutation({
    mutation: ROLE,
    resolver: 'role',
    toastmsg: false,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: ROLE_RECYCLE,
    resolver: 'roleRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: ROLE_RESTORE,
    resolver: 'roleRestore',
    toastmsg: true,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: ROLE_CREATE,
    resolver: 'roleCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: ROLE_UPDATE,
    resolver: 'roleUpdate',
    toastmsg: true,
  });
  const _inputUpdate: IRoleUpdate = {
    id: undefined,
    name: undefined,
  };

  const [inputCreate, setInputCreate] = useState<IRoleCreate>({
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
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
  const handleCreate = () => {
    create({ variables: { input: inputCreate } });
  };
  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } });
  };
  const loadRole = (roleId: string) => {
    getRole({ variables: { input: { id: roleId } } });
  };

  // Column definitions
  const activeColumns = [
    { field: 'index', headerName: '#', width: 60 },
    { field: 'name', headerName: 'Name', width: 180 },
    {
      field: 'usersCount', headerName: 'Users', width: 100,
      //valueGetter: (params: any) => params.row.users?.length
    },
    {
      field: 'permissionsCount', headerName: 'Permissions', width: 120,
      //valueGetter: (params: any) => params.row.permissions?.length
    },
    { field: 'created', headerName: 'Date Created', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: any) => {
        if (isSystemRole(params.row.name)) return null;
        return (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => {
                setInputUpdate(_inputUpdate);
                loadRole(params.row.id);
                setUpdateModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Link href={`/admin/roles/t0/${params.row.id}`}>
              <Button size="small">
                View
              </Button>
            </Link>
          </Stack>
        );
      }
    }
  ];

  useEffect(() => {
    if (role) {
      setInputUpdate({
        id: role.id,
        name: role.name,
      });
    }
  }, [role]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Agent & Admin Roles
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
                variant="contained"
                color="primary"
                onClick={() => setCreateModalOpen(true)}
              >
                New Admin Role
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
            <Button
              variant="outlined"
              color="primary"
              disabled={selectedRows.length === 0}
              onClick={handleRestore}
            >
              Restore
            </Button>
          )}
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={currentTab === 'active' ? rolesActive?.rows || [] : rolesRecycled?.rows || []}
            columns={currentTab === 'active' ? activeColumns : recycledColumns}
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
        </div>

        <Dialog 
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          aria-labelledby="create-role-dialog"
        >
          <DialogTitle id="create-role-dialog">
            New Admin Role
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Role Name"
              type="text"
              fullWidth
              variant="outlined"
              value={inputCreate.name || ''}
              onChange={(e) => setInputCreate({
                ...inputCreate,
                name: e.target.value,
              })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              loading={creating}
              onClick={() => {
                handleCreate();
                setCreateModalOpen(false);
              }}
            >
              Create
            </LoadingButton>
          </DialogActions>
        </Dialog>

      </Paper>
    </DashboardContent>
  );
}
