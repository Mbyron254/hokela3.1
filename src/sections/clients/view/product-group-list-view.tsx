import type { IDateValue } from 'src/types/common';
import type { GridColDef } from '@mui/x-data-grid';

import { useState, useEffect } from 'react';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Grid, Button, Dialog, TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  PRODUCT_GROUP,
  M_PRODUCT_GROUPS,
  PRODUCT_GROUP_CREATE,
  PRODUCT_GROUP_UPDATE,
  PRODUCT_GROUP_RECYCLE,
  PRODUCT_GROUP_RESTORE,
  M_PRODUCT_GROUPS_RECYCLED,
} from 'src/lib/mutations/product-group.mutation';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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
};

export function ProductGroupList({ clientTier2Id }: Props) {
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

  const [formData, setFormData] = useState({
    name: '',
    markup: '',
    description: '',
  });

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  useEffect(() => {
    if (clientTier2Id) {
      getGroupsActive({ variables: { input: { clientTier2Id } } });
    }
  }, [clientTier2Id,getGroupsActive]);

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        markup: group.markup,
        description: group.description,
      });
    }
  }, [group]);

  const handleDialogClose = () => {
    dialog.onFalse();
    isEdit.onFalse();
  };

  const handleNewRow = () => {
    dialog.onTrue();
    isEdit.onFalse();
    setFormData({ name: '', markup: '', description: '' });
  };

  const handleEditRow = (row: any) => {
    dialog.onTrue();
    isEdit.onTrue();
    getGroup({ variables: { input: { id: row.id } } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (isEdit.value) {
      update({ variables: { input: { ...formData, id: group.id } } });
    } else {
      create({ variables: { input: { ...formData, clientTier2Id } } });
    }
    handleDialogClose();
  };

  const handleRecycle = () => {
    if (selectedActive.length) {
      recycle({ variables: { input: { ids: selectedActive } } });
    }
  };

  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Product Groups"
        links={[{ name: 'List', href: '/dashboard' }]}
        action={
          <Button
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
                fullWidth
                name="markup"
                margin="dense"
                variant="outlined"
                label="Mark Up"
                value={formData.markup}
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
            label="Description"
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
      <DataGrid
        columns={columns}
        rows={groupsActive?.rows || []}
        checkboxSelection
        disableRowSelectionOnClick
        onRowClick={(params) => handleEditRow(params.row)}
      />
      <Button onClick={handleRecycle} variant="outlined" color="error" disabled={recycling}>
        Recycle
      </Button>
      <Button onClick={handleRestore} variant="outlined" color="primary" disabled={restoring}>
        Restore
      </Button>
    </DashboardContent>
  );
}
