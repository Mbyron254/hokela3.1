import type { IDateValue } from 'src/types/common';
import type { GridColDef } from '@mui/x-data-grid';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Button, Dialog, DialogActions, DialogTitle, Grid } from '@mui/material';
import { DialogContent } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { useState } from 'react';

// ----------------------------------------------------------------------

const columns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Code',
    width: 160,
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 160,
    editable: true,
  },
  {
    field: 'group',
    headerName: 'Group',
    type: 'number',
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    type: 'number',
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center',
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
        icon={<Iconify icon="solar:pen-bold" />}
        label="Edit"
        onClick={() => console.info('EDIT', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Add Package"
        onClick={() => console.info('EDIT', params.row.id)}
      />,
    ],
  },
];

type Props = {
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

export function ProductList({ data }: Props) {
  const dialog = useBoolean();
  const isEdit = useBoolean();

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
          heading="Products"
          links={[{ name: 'List', href: '/dashboard' }]}
          action={
            <Button
              onClick={handleNewRow}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>{isEdit.value ? 'Edit Product ' : 'New Product '}</DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  fullWidth
                  name="name"
                  margin="dense"
                  variant="outlined"
                  label=" Name"
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
