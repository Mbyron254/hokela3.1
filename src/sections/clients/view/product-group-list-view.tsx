import type { IDateValue } from 'src/types/common';
import type { GridColDef } from '@mui/x-data-grid';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { TextField } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { useState } from 'react';
import { Grid } from '@mui/material';
import { GQLMutation } from 'src/lib/client';

import {
  M_PRODUCT_GROUPS,
  M_PRODUCT_GROUPS_RECYCLED,
  PRODUCT_GROUP,
  PRODUCT_GROUP_CREATE,
  PRODUCT_GROUP_RECYCLE,
  PRODUCT_GROUP_RESTORE,
  PRODUCT_GROUP_UPDATE,
} from 'src/lib/mutations/product-group.mutation';

// ----------------------------------------------------------------------

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First name',
    width: 160,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 160,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    flex: 1,
    renderCell: (params) => `${params.row.firstName} ${params.row.lastName}`,
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    align: 'right',
    headerAlign: 'right',
    width: 80,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    getActions: (params) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:eye-bold" />}
        label="View"
        onClick={() => console.info('VIEW', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Edit"
        onClick={() => console.info('EDIT', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Delete"
        onClick={() => console.info('DELETE', params.row.id)}
        sx={{ color: 'error.main' }}
      />,
    ],
  },
];

type Props = {
  clientTier2Id: string;
  data: {
    id: string;
    age: number;
    name: string;
    email: string;
    rating: number;
    status: string;
    isAdmin: boolean;
    lastName: string;
    firstName: string;
    performance: number;
    lastLogin: IDateValue;
  }[];
};

export function ProductGroupList({ clientTier2Id, data }: Props) {
  const dialog = useBoolean();
  const isEdit = useBoolean();

  const {
    action: getGroupsActive,
    loading: loadingGroupsActive,
    data: groupsActive,
  } = GQLMutation({
    mutation: M_PRODUCT_GROUPS,
    resolver: 'productGroups',
    toastmsg: false,
  });

  const {
    action: getGroupsRecycled,
    loading: loadingGroupsRecycled,
    data: groupsRecycled,
  } = GQLMutation({
    mutation: M_PRODUCT_GROUPS_RECYCLED,
    resolver: 'productGroupsRecycled',
    toastmsg: false,
  });

  const {
    action: getGroup,
    loading: loadingGroup,
    data: group,
  } = GQLMutation({
    mutation: PRODUCT_GROUP,
    resolver: 'productGroup',
    toastmsg: false,
  });

  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_CREATE,
    resolver: 'productGroupCreate',
    toastmsg: true,
  });

  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_UPDATE,
    resolver: 'productGroupUpdate',
    toastmsg: true,
  });

  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_RECYCLE,
    resolver: 'productGroupRecycle',
    toastmsg: true,
  });

  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_RESTORE,
    resolver: 'productGroupRestore',
    toastmsg: true,
  });

  const loadGroupsActive = () => {
    if (clientTier2Id) {
      getGroupsActive({ variables: { input: { clientTier2Id } } });
    }
  };

  useState(
    () => {
      loadGroupsActive();
    },
    // @ts-ignore
    []
  );

  console.log('groupsActive', groupsActive);

  const handleDialogClose = () => {
    dialog.onFalse();
    isEdit.onFalse();
  };
  const [formData, setFormData] = useState({
    name: '',
    markUp: '',
    description: '',
  });

  const handleNewRow = () => {
    dialog.onTrue();
    isEdit.onFalse();
  };

  const handleEditRow = (row: any) => {
    console.log('Edit Row', row);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('Submit', formData);
  };
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Product Groups"
          links={[{ name: 'List', href: '/dashboard' }]}
          action={
            <Button
              // component={RouterLink}
              // href={paths.v2.marketing.clients.new}
              onClick={handleNewRow}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product Group
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>{isEdit.value ? 'Edit Product Group' : 'New Product Group'}</DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  fullWidth
                  name="name"
                  margin="dense"
                  variant="outlined"
                  label="Group Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  fullWidth
                  name="markUp"
                  margin="dense"
                  variant="outlined"
                  label="Mark Up"
                  value={formData.markUp}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ my: 2 }} />
            <TextField
              variant="outlined"
              rows={4}
              fullWidth
              multiline
              label="Descrption"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleDialogClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {isEdit.value ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
        <DataGrid columns={columns} rows={data} checkboxSelection disableRowSelectionOnClick />;
      </DashboardContent>
    </>
  );
}
