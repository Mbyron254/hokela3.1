'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  PRODUCT_SUB_CATEGORY,
  PRODUCT_SUB_CATEGORY_CREATE,
  PRODUCT_SUB_CATEGORY_RECYCLE,
  PRODUCT_SUB_CATEGORY_RESTORE,
  PRODUCT_SUB_CATEGORY_UPDATE,
} from 'src/lib/mutations/product-sub-category.mutation';
import {
  Q_PRODUCT_SUB_CATEGORIES_ACTIVE,
  Q_PRODUCT_SUB_CATEGORIES_RECYCLED,
} from 'src/lib/queries/product-sub-category.query';
import { Q_PRODUCT_CATEGORIES_MINI } from 'src/lib/queries/product-category.query';
import {
  IProductSubCategoryCreate,
  IProductSubCategoryUpdate,
} from 'src/lib/interface/product-sub-category.interface';

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const queryFilters = { page: 0, pageSize: 10 };
  const _inputUpdate: IProductSubCategoryUpdate = {
    id: undefined,
    productCategoryId: undefined,
    name: undefined,
  };

  const [inputCreate, setInputCreate] = useState<IProductSubCategoryCreate>({
    productCategoryId: undefined,
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);

  const { data: categories } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_MINI,
    queryAction: 'productCategories',
    variables: { input: {} },
  });
  const {
    refetch: refetchSubcategoriesActive,
    data: subcategoriesActive,
    loading: loadingSubcategoriesActive,
  } = GQLQuery({
    query: Q_PRODUCT_SUB_CATEGORIES_ACTIVE,
    queryAction: 'productSubCategories',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchSubcategoriesRecycled,
    data: subcategoriesRecycled,
    loading: loadingSubcategoriesRecycled,
  } = GQLQuery({
    query: Q_PRODUCT_SUB_CATEGORIES_RECYCLED,
    queryAction: 'productSubCategoriesRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getSubcategory,
    loading: loadingSubcategory,
    data: subcategory,
  } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY,
    resolver: 'm_productSubCategory',
    toastmsg: false,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_CREATE,
    resolver: 'productSubCategoryCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_UPDATE,
    resolver: 'productSubCategoryUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_RECYCLE,
    resolver: 'productSubCategoryRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: PRODUCT_SUB_CATEGORY_RESTORE,
    resolver: 'productSubCategoryRestore',
    toastmsg: true,
  });

  const activeColumns = [
    { field: 'index', headerName: '#', width: 60 },
    { field: 'name', headerName: 'NAME', flex: 1 },
    { 
      field: 'productCategory',
      headerName: 'CATEGORY',
      width: 200,
      valueGetter: (params: any) => params.row.productCategory?.name 
    },
    { 
      field: 'products',
      headerName: 'PRODUCTS',
      width: 120,
      valueGetter: (params: any) => params.row.products?.length 
    },
    { field: 'created', headerName: 'CREATED', width: 180 },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 100,
      renderCell: (params: any) => (
        <Button
          size="small"
          onClick={() => {
            loadSubCategory(params.row.id);
            setOpenEdit(true);
          }}
        >
          Edit
        </Button>
      ),
    }
  ];

  const recycledColumns = activeColumns.filter(col => col.field !== 'actions');

  const handleCreate = () => {
    create({ variables: { input: inputCreate } });
  };
  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } });
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
  const loadSubCategory = (id: string) => {
    getSubcategory({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (subcategory) {
      setInputUpdate({
        id: subcategory.id,
        name: subcategory.name,
        productCategoryId: subcategory.productCategory?.id,
      });
    }
  }, [subcategory]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Product Sub-Categories
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
                onClick={() => setOpenNew(true)}
              >
                New Sub-Category
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
            rows={currentTab === 'active' ? subcategoriesActive?.rows || [] : subcategoriesRecycled?.rows || []}
            columns={currentTab === 'active' ? activeColumns : recycledColumns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={currentTab === 'active' ? loadingSubcategoriesActive : loadingSubcategoriesRecycled}
            slots={{
              noRowsOverlay: () => <div>No data available</div>,
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection as string[])}
          />
        </div>
      </Paper>

      {/* Create Modal */}
      <Dialog open={openNew} onClose={() => setOpenNew(false)}>
        <DialogTitle>New Sub-Category</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            variant="outlined"
            SelectProps={{
              native: true,
            }}
            value={inputCreate.productCategoryId || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, productCategoryId: e.target.value || undefined })}
          >
            <option value=""></option>
            {categories?.rows.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Sub-Category Name"
            fullWidth
            variant="outlined"
            value={inputCreate.name || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNew(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              handleCreate();
              setOpenNew(false);
            }}
            variant="contained"
            disabled={creating}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Sub-Category</DialogTitle>
        <DialogContent>
          {loadingSubcategory ? (
            <div>Loading...</div>
          ) : (
            <>
              <TextField
                select
                margin="dense"
                label="Category"
                fullWidth
                variant="outlined"
                SelectProps={{
                  native: true,
                }}
                value={inputUpdate.productCategoryId || ''}
                onChange={(e) => setInputUpdate({ ...inputUpdate, productCategoryId: e.target.value || undefined })}
              >
                <option value=""></option>
                {categories?.rows.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </TextField>
              <TextField
                margin="dense"
                label="Sub-Category Name"
                fullWidth
                variant="outlined"
                value={inputUpdate.name || ''}
                onChange={(e) => setInputUpdate({ ...inputUpdate, name: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              handleUpdate();
              setOpenEdit(false);
            }}
            variant="contained"
            disabled={updating}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
