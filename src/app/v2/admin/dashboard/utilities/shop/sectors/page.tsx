'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Modal, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  Q_SHOP_SECTORS_ACTIVE,
  Q_SHOP_SECTORS_RECYCLED,
} from 'src/lib/queries/shop-sector.query';
import {
  SHOP_SECTOR,
  SHOP_SECTOR_CREATE,
  SHOP_SECTOR_RECYCLE,
  SHOP_SECTOR_RESTORE,
  SHOP_SECTOR_UPDATE,
} from 'src/lib/mutations/shop-sector.mutation';
import {
  IShopSectorCreate,
  IShopSectorUpdate,
} from 'src/lib/interface/shop-sector.interface';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [inputCreate, setInputCreate] = useState<IShopSectorCreate>({
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState<IShopSectorUpdate>({
    id: undefined,
    name: undefined,
  });

  const queryFilters = { page: 0, pageSize: 10 };
  const {
    refetch: refetchSectorsActive,
    data: sectorsActive,
    loading: loadingSectorsActive,
  } = GQLQuery({
    query: Q_SHOP_SECTORS_ACTIVE,
    queryAction: 'shopSectors',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchSectorsRecycled,
    data: sectorsRecycled,
    loading: loadingSectorsRecycled,
  } = GQLQuery({
    query: Q_SHOP_SECTORS_RECYCLED,
    queryAction: 'shopSectorsRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getSector,
    loading: loadingSector,
    data: sector,
  } = GQLMutation({
    mutation: SHOP_SECTOR,
    resolver: 'm_shopSector',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: SHOP_SECTOR_CREATE,
    resolver: 'shopSectorCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: SHOP_SECTOR_UPDATE,
    resolver: 'shopSectorUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: SHOP_SECTOR_RECYCLE,
    resolver: 'shopSectorRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: SHOP_SECTOR_RESTORE,
    resolver: 'shopSectorRestore',
    toastmsg: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const activeColumns = [
    { field: 'index', headerName: '#', width: 60 },
    { field: 'name', headerName: 'NAME', flex: 1 },
    { 
      field: 'shops', 
      headerName: 'SHOPS', 
      width: 100,
      valueGetter: (params: any) => params.row.shops?.length 
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
            loadSector(params.row.id);
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
  const loadSector = (id: string) => {
    getSector({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (sector) {
      setInputUpdate({
        id: sector.id,
        name: sector.name,
      });
    }
  }, [sector]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Shop Sectors
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
                New Sector
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
            rows={currentTab === 'active' ? sectorsActive?.rows || [] : sectorsRecycled?.rows || []}
            columns={currentTab === 'active' ? activeColumns : recycledColumns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={currentTab === 'active' ? loadingSectorsActive : loadingSectorsRecycled}
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
      <Modal open={openNew} onClose={() => setOpenNew(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            New Shop Sector
          </Typography>
          <TextField
            fullWidth
            label="Sector Name"
            value={inputCreate.name || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setOpenNew(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={creating}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Edit Shop Sector
          </Typography>
          {loadingSector ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <TextField
                fullWidth
                label="Sector Name"
                value={inputUpdate.name || ''}
                onChange={(e) => setInputUpdate({ ...inputUpdate, name: e.target.value })}
                sx={{ mb: 3 }}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={updating}
                >
                  Update
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </DashboardContent>
  );
}
