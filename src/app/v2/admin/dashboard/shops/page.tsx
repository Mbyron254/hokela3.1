'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Chip } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_SHOPS_ACTIVE, Q_SHOPS_RECYCLED } from 'src/lib/queries/shop.query';
import {
  SHOP,
  SHOP_CREATE,
  SHOP_RECYCLE,
  SHOP_RESTORE,
  SHOP_UPDATE,
  SHOPS_APPROVE,
  SHOPS_REVOKE,
} from 'src/lib/mutations/shop.mutation';
import { IShopUpdate } from 'src/lib/interface/shop.interface';
import ShopNew from 'src/components/ShopNew';
// import ShopEdit from 'src/components/ShopEdit';

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [inputUpdate, setInputUpdate] = useState<IShopUpdate>({
    id: undefined,
    shopCategoryId: undefined,
    shopSectorId: undefined,
    name: undefined,
    lat: undefined,
    lng: undefined,
  });

  const queryFilters = { page: 0, pageSize: 10 };
  const {
    refetch: refetchShopsActive,
    data: shopsActive,
    loading: loadingShopsActive,
  } = GQLQuery({
    query: Q_SHOPS_ACTIVE,
    queryAction: 'shops',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchShopsRecycled,
    data: shopsRecycled,
    loading: loadingShopsRecycled,
  } = GQLQuery({
    query: Q_SHOPS_RECYCLED,
    queryAction: 'shopsRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getShop,
    loading: loadingShop,
    data: shop,
  } = GQLMutation({
    mutation: SHOP,
    resolver: 'm_shop',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: SHOP_CREATE,
    resolver: 'shopCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: SHOP_UPDATE,
    resolver: 'shopUpdate',
    toastmsg: true,
  });
  const {
    action: approve,
    loading: approving,
    data: approved,
  } = GQLMutation({
    mutation: SHOPS_APPROVE,
    resolver: 'shopsApprove',
    toastmsg: true,
  });
  const {
    action: revoke,
    loading: revoking,
    data: revoked,
  } = GQLMutation({
    mutation: SHOPS_REVOKE,
    resolver: 'shopsRevoke',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: SHOP_RECYCLE,
    resolver: 'shopRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: SHOP_RESTORE,
    resolver: 'shopRestore',
    toastmsg: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const activeColumns = [
    { field: 'index', headerName: '#', width: 60 },
    { field: 'name', headerName: 'NAME', flex: 1 },
    { field: 'category', headerName: 'CATEGORY', flex: 1, valueGetter: (params: any) => params.row.category?.name },
    { field: 'sector', headerName: 'SECTOR', flex: 1, valueGetter: (params: any) => params.row.sector?.name },
    { field: 'user', headerName: 'REGISTERED BY', flex: 1, valueGetter: (params: any) => params.row.user?.name },
    { field: 'created', headerName: 'CREATED', width: 180 },
    { 
      field: 'approved', 
      headerName: 'APPROVAL', 
      width: 115,
      renderCell: (params: any) => (
        <Chip 
          label={params.value ? "Approved" : "Pending"} 
          color={params.value ? "success" : "error"} 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 100,
      renderCell: (params: any) => (
        <Button
          size="small"
          onClick={() => {
            loadShop(params.row.id);
            setOpenEdit(true);
          }}
        >
          Edit
        </Button>
      ),
    }
  ];

  const recycledColumns = activeColumns.filter(col => col.field !== 'actions');

  const handleRecycle = () => {
    if (selectedRows.length) {
      recycle({ variables: { input: { ids: selectedRows } } });
    }
  };
  const handleApprove = () => {
    if (selectedRows.length) {
      approve({ variables: { input: { ids: selectedRows } } });
    }
  };
  const handleRevoke = () => {
    if (selectedRows.length) {
      revoke({ variables: { input: { ids: selectedRows } } });
    }
  };
  const handleRestore = () => {
    if (selectedRows.length) {
      restore({ variables: { input: { ids: selectedRows } } });
    }
  };
  const loadShop = (id: string) => {
    getShop({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (shop) {
      setInputUpdate({
        id: shop.id,
        name: shop.name,
        lat: shop.lat,
        lng: shop.lng,
        shopCategoryId: shop.category?.id,
        shopSectorId: shop.sector?.id,
      });
    }
  }, [shop]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Shops
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
                New Shop
              </Button>
              <Button
                variant="outlined"
                color="success"
                disabled={selectedRows.length === 0}
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={selectedRows.length === 0}
                onClick={handleRevoke}
              >
                Revoke
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
            rows={currentTab === 'active' ? shopsActive?.rows || [] : shopsRecycled?.rows || []}
            columns={currentTab === 'active' ? activeColumns : recycledColumns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={currentTab === 'active' ? loadingShopsActive : loadingShopsRecycled}
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

      {/* Modals */}
      <ShopNew 
        open={openNew} 
        onClose={() => setOpenNew(false)}
        create={create}
        creating={creating}
      />

      {/* <ShopEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        loadingShop={loadingShop}
        inputUpdate={inputUpdate}
        setInputUpdate={setInputUpdate}
        update={update}
        updating={updating}
      /> */}
    </DashboardContent>
  );
}
