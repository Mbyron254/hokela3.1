'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Chip } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_CREATE,
  PRODUCT_CATEGORY_RECYCLE,
  PRODUCT_CATEGORY_RESTORE,
  PRODUCT_CATEGORY_UPDATE,
} from 'src/lib/mutations/product-category.mutation';
import {
  Q_PRODUCT_CATEGORIES_ACTIVE,
  Q_PRODUCT_CATEGORIES_RECYCLED,
} from 'src/lib/queries/product-category.query';
import {
  IProductCategoryCreate,
  IProductCategoryUpdate,
} from 'src/lib/interface/product-category.interface';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const queryFilters = { page: 0, pageSize: 10 };
  const _inputUpdate: IProductCategoryUpdate = {
    id: undefined,
    name: undefined,
  };

  const [inputCreate, setInputCreate] = useState<IProductCategoryCreate>({
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);

  const {
    refetch: refetchCategoriesActive,
    data: categoriesActive,
    loading: loadingCategoriesActive,
  } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_ACTIVE,
    queryAction: 'productCategories',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchCategoriesRecycled,
    data: categoriesRecycled,
    loading: loadingCategoriesRecycled,
  } = GQLQuery({
    query: Q_PRODUCT_CATEGORIES_RECYCLED,
    queryAction: 'productCategoriesRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getCategory,
    loading: loadingCategory,
    data: category,
  } = GQLMutation({
    mutation: PRODUCT_CATEGORY,
    resolver: 'm_productCategory',
    toastmsg: false,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: PRODUCT_CATEGORY_CREATE,
    resolver: 'productCategoryCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: PRODUCT_CATEGORY_UPDATE,
    resolver: 'productCategoryUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: PRODUCT_CATEGORY_RECYCLE,
    resolver: 'productCategoryRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: PRODUCT_CATEGORY_RESTORE,
    resolver: 'productCategoryRestore',
    toastmsg: true,
  });

  const activeColumns = [
    { field: 'index', headerName: '#', width: 60 },
    { field: 'name', headerName: 'NAME', flex: 1 },
    { 
      field: 'subCategories', 
      headerName: 'SUB-CATEGORIES', 
      width: 150,
      valueGetter: (params: any) => JSON.stringify(params) 
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
            //loadCategory(params.row.id);
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
  const loadCategory = (id: string) => {
    getCategory({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (category) {
      setInputUpdate({
        id: category.id,
        name: category.name,
      });
    }
  }, [category]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Product Categories
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
                New Category
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
            rows={currentTab === 'active' ? categoriesActive?.rows || [] : categoriesRecycled?.rows || []}
            columns={currentTab === 'active' ? activeColumns : recycledColumns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={currentTab === 'active' ? loadingCategoriesActive : loadingCategoriesRecycled}
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
        <DialogTitle>New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
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
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          {loadingCategory ? (
            <div>Loading...</div>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              variant="outlined"
              value={inputUpdate.name || ''}
              onChange={(e) => setInputUpdate({ ...inputUpdate, name: e.target.value })}
            />
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
