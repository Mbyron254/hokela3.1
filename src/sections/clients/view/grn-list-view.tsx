import { useState, useEffect } from 'react';
import { GQLMutation } from 'src/lib/client';
import { InputGRNCreate, InputGRNUpdate, InputInventoryCreate, InputInventoryUpdate } from 'src/lib/interface/grns.interface';
import {
  GRN,
  GRNCreate,
  GRNRecycle,
  GRNRestore,
  GRNs,
  GRNs_RECYCLED,
  GRNUpdate,
} from 'src/lib/mutations/grn.mutation';
import {
  INVENTORIES,
  INVENTORIES_RECYCLED,
  INVENTORY,
  INVENTORY_CREATE,
  INVENTORY_RECYCLED,
  INVENTORY_RESTORE,
  INVENTORY_UPDATE,
} from 'src/lib/mutations/inventory.mutation';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tabs, Tab, Box, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { MutationButton } from 'src/components/MutationButton';
import { LoadingDiv } from 'src/components/LoadingDiv';


// ----------------------------------------------------------------------

export function GrnList({ clientTier2Id }: { clientTier2Id: string }) {
  const {
    action: getGrnsActive,
    loading: loadingGrnsActive,
    data: grnsActive,
    error: errorGrnsActive,
  } = GQLMutation({
    mutation: GRNs,
    resolver: 'GRNs',
  });

  const {
    action: getGrnsRecycled,
    loading: loadingGrnsRecycled,
    data: grnsRecycled,
  } = GQLMutation({
    mutation: GRNs_RECYCLED,
    resolver: 'GRNsRecycled',
  });

  const {
    action: getGrn,
    loading: loadingGrn,
    data: grn,
  } = GQLMutation({
    mutation: GRN,
    resolver: 'GRN',
  });

  const {
    action: create,
    loading: creating,
  } = GQLMutation({
    mutation: GRNCreate,
    resolver: 'GRNCreate',
    toastmsg: true,
  });

  const {
    action: update,
    loading: updating,
  } = GQLMutation({
    mutation: GRNUpdate,
    resolver: 'GRNUpdate',
    toastmsg: true,
  });

  const {
    action: recycle,
    loading: recycling,
  } = GQLMutation({
    mutation: GRNRecycle,
    resolver: 'GRNRecycle',
    toastmsg: true,
  });

  const {
    action: restore,
    loading: restoring,
  } = GQLMutation({
    mutation: GRNRestore,
    resolver: 'GRNRestore',
    toastmsg: true,
  });

  const {
    action: getInventoriesActive,
    loading: loadingInventoriesActive,
    data: inventoriesActive,
  } = GQLMutation({
    mutation: INVENTORIES,
    resolver: 'inventories',
    toastmsg: false,
  });

  const {
    action: getInventoriesRecycled,
    loading: loadingInventoriesRecycled,
    data: inventoriesRecycled,
  } = GQLMutation({
    mutation: INVENTORIES_RECYCLED,
    resolver: 'inventoriesRecycled',
    toastmsg: false,
  });

  const {
    action: getInventory,
    loading: loadingInventory,
    data: inventory,
  } = GQLMutation({
    mutation: INVENTORY,
    resolver: 'inventory',
    toastmsg: false,
  });

  const {
    action: createInventory,
    loading: creatingInventory,
  } = GQLMutation({
    mutation: INVENTORY_CREATE,
    resolver: 'inventoryCreate',
    toastmsg: false,
  });

  const {
    action: updateInventory,
    loading: updatingInventory,
  } = GQLMutation({
    mutation: INVENTORY_UPDATE,
    resolver: 'inventoryUpdate',
    toastmsg: false,
  });

  const {
    action: recycleInventory,
    loading: recyclingInventory,
  } = GQLMutation({
    mutation: INVENTORY_RECYCLED,
    resolver: 'inventoryRecycle',
    toastmsg: false,
  });

  const {
    action: restoreInventory,
    loading: restoringInventory,
  } = GQLMutation({
    mutation: INVENTORY_RESTORE,
    resolver: 'inventoryRestore',
    toastmsg: false,
  });

  const init: InputGRNUpdate = {
    id: undefined,
    supplierRefNo: undefined,
    notes: undefined,
  };

  const initInventory: InputInventoryUpdate = {
    id: undefined,
    quantity: undefined,
    unitPrice: undefined,
    notes: undefined,
  };

  const [inputCreate, setInputCreate] = useState<InputGRNCreate>({
    supplierRefNo: undefined,
    notes: undefined,
  });

  const [inputUpdate, setInputUpdate] = useState(init);
  const [inputInventoryCreate, setInputInventoryCreate] = useState<InputInventoryCreate>({
    productId: undefined,
    packagingId: undefined,
    quantity: undefined,
    unitPrice: undefined,
    notes: undefined,
  });
  const [inputInventoryUpdate, setInputInventoryUpdate] = useState(initInventory);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleCreate = () => {
    if (clientTier2Id) {
      create({ variables: { input: { ...inputCreate, clientTier2Id } } }).then(() => {
        setOpenCreateModal(false);
        getGrnsActive({ variables: { input: { clientTier2Id } } });
      });
    }
  };

  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } }).then(() => {
      setOpenUpdateModal(false);
      getGrnsActive({ variables: { input: { clientTier2Id } } });
    });
  };

  const handleRecycle = () => {
    if (selectedActive.length) {
      recycle({ variables: { input: { ids: selectedActive } } }).then(() => {
        getGrnsActive({ variables: { input: { clientTier2Id } } });
      });
    }
  };

  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } }).then(() => {
        getGrnsRecycled({ variables: { input: { clientTier2Id } } });
      });
    }
  };

  const handleInventoryCreate = (grnId: string) => {
    createInventory({ variables: { input: { ...inputInventoryCreate, grnId } } }).then(() => {
      getInventoriesActive({ variables: { input: { grnId } } });
    });
  };

  const handleInventoryUpdate = () => {
    updateInventory({ variables: { input: inputInventoryUpdate } }).then(() => {
      getInventoriesActive({ variables: { input: { grnId: inputInventoryUpdate.id } } });
    });
  };

  const handleInventoryRecycle = (grnId: string) => {
    if (selectedActive.length) {
      recycleInventory({ variables: { input: { ids: selectedActive } } }).then(() => {
        getInventoriesActive({ variables: { input: { grnId } } });
      });
    }
  };

  const handleInventoryRestore = (grnId: string) => {
    if (selectedRecycled.length) {
      restoreInventory({ variables: { input: { ids: selectedRecycled } } }).then(() => {
        getInventoriesRecycled({ variables: { input: { grnId } } });
      });
    }
  };

  useEffect(() => {
    if (grn) {
      setInputUpdate({
        id: grn.id,
        supplierRefNo: grn.supplierRefNo,
        notes: grn.notes,
      });
    }
  }, [grn]);

  useEffect(() => {
    if (clientTier2Id) {
      getGrnsActive({ variables: { input: { clientTier2Id } } });
      getGrnsRecycled({ variables: { input: { clientTier2Id } } });
    }
  }, [clientTier2Id, getGrnsActive, getGrnsRecycled]);

  const loadGrn = (id: string) => {
    getGrn({ variables: { input: { id } } });
  };
  
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
      field: 'supplyRef',
      headerName: 'Supply Ref',
      width: 160,
      editable: true,
    },
    {
      field: 'grnNo',
      headerName: 'Grn No',
      width: 160,
      editable: true,
    },
    {
      field: 'items',
      headerName: 'Items',
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
      getActions: (params: any) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => {
            loadGrn(params.row.id);
            setOpenViewDialog(true);
          }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => {
            setInputUpdate(init);
            loadGrn(params.row.id);
            setOpenUpdateModal(true);
          }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleRecycle()}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="GRN List"
        links={[{ name: 'List', href: '/dashboard' }]}
        action={
          <Button
            onClick={() => setOpenCreateModal(true)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New GRN
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="Active" />
        <Tab label="Recycled" />
      </Tabs>
      {tabIndex === 0 ? (
        loadingGrnsActive ? (
          <CircularProgress />
        ) : errorGrnsActive ? (
          <div>Error loading GRNs: {errorGrnsActive.message}</div>
        ) : (
          <DataGrid
            columns={columns}
            rows={grnsActive?.rows || []}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => setSelectedActive(newSelection as string[])}
            getRowHeight={() => 'auto'}
          />
        )
      ) : (
        loadingGrnsRecycled ? (
          <CircularProgress />
        ) : (
          <DataGrid
            columns={columns}
            rows={grnsRecycled?.rows || []}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => setSelectedRecycled(newSelection as string[])}
          />
        )
      )}

      {/* Create GRN Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>New GRN</DialogTitle>
        <DialogContent>
          <TextField
            label="Supplier Ref"
            fullWidth
            margin="normal"
            value={inputCreate.supplierRefNo || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, supplierRefNo: e.target.value })}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={inputCreate.notes || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            variant="contained"
            color="primary"
          >
            {creating ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update GRN Modal */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Edit GRN</DialogTitle>
        <DialogContent>
          {loadingGrn ? (
            <LoadingDiv />
          ) : (
            <>
              <TextField
                label="Supplier Ref"
                fullWidth
                margin="normal"
                value={inputUpdate.supplierRefNo || ''}
                onChange={(e) => setInputUpdate({ ...inputUpdate, supplierRefNo: e.target.value })}
              />
              <TextField
                label="Notes"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={inputUpdate.notes || ''}
                onChange={(e) => setInputUpdate({ ...inputUpdate, notes: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            disabled={updating}
            variant="contained"
            color="primary"
          >
            {updating ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View GRN Modal */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>GRN Details</DialogTitle>
        <DialogContent>
          {loadingGrn ? (
            <LoadingDiv />
          ) : (
            <>
              <Typography variant="body1">Supplier Ref: {grn?.supplierRefNo}</Typography>
              <Typography variant="body1">Notes: {grn?.notes}</Typography>
              {/* Add more fields as necessary */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
