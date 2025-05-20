import type { IDateValue } from 'src/types/common';
import type { GridColDef } from '@mui/x-data-grid';

import { useState, useEffect } from 'react';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box , Grid , Button , Dialog, TextField, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  M_PRODUCTS_ACTIVE,
  M_PRODUCTS_RECYCLED,
  PRODUCT_CREATE,
  PRODUCT_RECYCLE,
  PRODUCT_RESTORE,
  PRODUCT_UPDATE,
} from 'src/lib/mutations/product.mutation';
import { M_PRODUCT_SUB_CATEGORIES_MINI } from 'src/lib/mutations/product-sub-category.mutation';
import { Q_PRODUCT_CATEGORIES_MINI } from 'src/lib/queries/product-category.query';
import { IProductCreate, IProductUpdate } from 'src/lib/interface/product.interface';
import { DropZone } from 'src/components/dropzone/DropZone';
import { IDocumentWrapper } from 'src/lib/interface/dropzone.type';

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
  const [categoryId, setCategoryId] = useState<string>();
  const [productsActive, setProductsActive] = useState([]);
  const [productsRecycled, setProductsRecycled] = useState([]);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [documents, setDocuments] = useState<IDocumentWrapper[]>([]);

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

  const { data: categories, loading: loadingCategories } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_MINI,
    queryAction: 'productCategories',
    variables: { input: {} },
  });

  const { action: getSubcategories, data: subcategories, loading: loadingSubCategories } = GQLMutation({
    mutation: M_PRODUCT_SUB_CATEGORIES_MINI,
    resolver: 'm_productSubCategories',
    toastmsg: false,
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

  useEffect(() => {
    if (categoryId) {
      getSubcategories({ variables: { input: { productCategoryId: categoryId } } });
    }
  }, [categoryId, getSubcategories]);

  useEffect(() => {
    if (documents.length) {
      const photoIds: string[] = documents.map(doc => doc.meta?.id).filter(id => id) as string[];
      setFormData(prevFormData => ({ ...prevFormData, photoIds }));
    }
  }, [documents]);

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
              <FormControl fullWidth margin="dense">
                <InputLabel>Group ID</InputLabel>
                <Select
                  name="groupId"
                  value={formData.groupId || ''}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                >
                  {/* Add options for groups here */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories?.rows.map((category: any) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="productSubCategoryId"
                  value={formData.productSubCategoryId || ''}
                  onChange={(e) => setFormData({ ...formData, productSubCategoryId: e.target.value })}
                >
                  {subcategories?.rows.map((subcategory: any) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          <Box sx={{ my: 2 }} />
          <DropZone
            name="photos (Max of 3, 230px by 230px)"
            classes="dropzone text-center mt-3"
            acceptedImageTypes={['.png', '.jpeg', '.jpg', '.webp', '.ico']}
            multiple
            files={documents}
            setFiles={setDocuments}
            maxSize={1375000000} // 1GB
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
