import type { IDateValue } from 'src/types/common';
import type { GridColDef } from '@mui/x-data-grid';

import { useState, useEffect } from 'react';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box , Grid , Button , Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { GQLMutation } from 'src/lib/client';
import {
  M_PRODUCTS_ACTIVE,
  M_PRODUCTS_RECYCLED,
  PRODUCT_CREATE,
  PRODUCT_RECYCLE,
  PRODUCT_RESTORE,
} from 'src/lib/mutations/product.mutation';
import { IProductCreate } from 'src/lib/interface/product.interface';

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
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
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

export function ProductList({ clientTier2Id }: { clientTier2Id: string }) {
  const dialog = useBoolean();
  const isEdit = useBoolean();
  const [formData, setFormData] = useState<IProductCreate>({
    name: '',
    groupId: undefined,
    productSubCategoryId: undefined,
    description: '',
    photoIds: [],
  });
  const [productsActive, setProductsActive] = useState([]);
  const [productsRecycled, setProductsRecycled] = useState([]);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const { action: getProductsActive, data: activeData } = GQLMutation({
    mutation: M_PRODUCTS_ACTIVE,
    resolver: 'm_products',
    toastmsg: false,
  });

  const { action: getProductsRecycled, data: recycledData } = GQLMutation({
    mutation: M_PRODUCTS_RECYCLED,
    resolver: 'm_productsRecycled',
    toastmsg: false,
  });

  const { action: createProduct } = GQLMutation({
    mutation: PRODUCT_CREATE,
    resolver: 'productCreate',
    toastmsg: true,
  });

  const { action: recycleProduct } = GQLMutation({
    mutation: PRODUCT_RECYCLE,
    resolver: 'productRecycle',
    toastmsg: true,
  });

  const { action: restoreProduct } = GQLMutation({
    mutation: PRODUCT_RESTORE,
    resolver: 'productRestore',
    toastmsg: true,
  });

  useEffect(() => {
    if (clientTier2Id) {
      getProductsActive({ variables: { input: { clientTier2Id } } });
      getProductsRecycled({ variables: { input: { clientTier2Id } } });
    }
  }, [clientTier2Id, getProductsActive, getProductsRecycled]);

  useEffect(() => {
    if (activeData) {
      setProductsActive(activeData.rows || []);
    }
  }, [activeData]);

  useEffect(() => {
    if (recycledData) {
      setProductsRecycled(recycledData.rows || []);
    }
  }, [recycledData]);

  const handleDialogClose = () => {
    dialog.onFalse();
    isEdit.onFalse();
  };

  const handleNewRow = () => {
    dialog.onTrue();
    isEdit.onFalse();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (clientTier2Id) {
      createProduct({ variables: { input: { ...formData, clientTier2Id } } });
    }
  };

  const handleRecycle = () => {
    if (selectedActive.length) {
      recycleProduct({ variables: { input: { ids: selectedActive } } });
    }
  };

  const handleRestore = () => {
    if (selectedRecycled.length) {
      restoreProduct({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  return (
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
                label="Product Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                fullWidth
                name="groupId"
                margin="dense"
                variant="outlined"
                label="Group ID"
                value={formData.groupId}
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
      <DataGrid columns={columns} rows={productsActive} checkboxSelection disableRowSelectionOnClick />
    </DashboardContent>
  );
}
