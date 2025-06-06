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
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tabs, Tab, Box, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { MutationButton } from 'src/components/MutationButton';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { M_PRODUCTS_MINI } from 'src/lib/mutations/product.mutation';
import { M_PACKAGINGS_MINI } from 'src/lib/mutations/packaging.mutation';


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
    action: getProducts,
    loading: loadingProducts,
    data: products,
  } = GQLMutation({
    mutation: M_PRODUCTS_MINI,
    resolver: 'm_products',
    toastmsg: false,
  });
  const {
    action: getPackagings,
    loading: loadingPackagings,
    data: packagings,
  } = GQLMutation({
    mutation: M_PACKAGINGS_MINI,
    resolver: 'm_packagings',
    toastmsg: false,
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
  const [selectedInventoryActive, setSelectedInventoryActive] = useState<string[]>([]);
  const [selectedInventoryRecycled, setSelectedInventoryRecycled] = useState<string[]>([]);
  const [openInventoryCreateModal, setOpenInventoryCreateModal] = useState(false);
  const [openInventoryUpdateModal, setOpenInventoryUpdateModal] = useState(false);
  const [currentGrnId, setCurrentGrnId] = useState<string | null>(null);

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
    if (clientTier2Id) {
      getProducts({ variables: { input: { clientTier2Id } } });
    }
  }, [clientTier2Id, getProducts]);
  useEffect(() => {
    if (inputInventoryCreate.productId) {
      getPackagings({ variables: { input: { productId: inputInventoryCreate.productId } } });
    }
  }, [inputInventoryCreate.productId, getPackagings]);

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
            setCurrentGrnId(params.row.id);
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
              {/* Inventory Management */}
              <Typography variant="h6" sx={{ mt: 2 }}>Inventory Management</Typography>
              <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
                <Tab label="Active" />
                <Tab label="Recycled" />
              </Tabs>
              {tabIndex === 0 ? (
                loadingInventoriesActive ? (
                  <CircularProgress />
                ) : (
                  <DataGrid
                    columns={columns}
                    rows={inventoriesActive?.rows || []}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newSelection) => setSelectedInventoryActive(newSelection as string[])}
                  />
                )
              ) : (
                loadingInventoriesRecycled ? (
                  <CircularProgress />
                ) : (
                  <DataGrid
                    columns={columns}
                    rows={inventoriesRecycled?.rows || []}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newSelection) => setSelectedInventoryRecycled(newSelection as string[])}
                  />
                )
              )}
              <Button
                onClick={() => setOpenInventoryCreateModal(true)}
                variant="contained"
                color="primary"
                disabled={creatingInventory}
              >
                {creatingInventory ? <CircularProgress size={24} /> : "Add Inventory"}
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Inventory Create Modal */}
      <Dialog open={openInventoryCreateModal} onClose={() => setOpenInventoryCreateModal(false)}>
        <DialogTitle>New Inventory</DialogTitle>
        <DialogContent>
          {
            loadingProducts ? (
              <LoadingDiv />
            ) : (
              <Select
                id="productId"
                value={inputInventoryCreate.productId}
                onChange={(e) => setInputInventoryCreate({ ...inputInventoryCreate, productId: e.target.value as string })}
                displayEmpty
                fullWidth
              >
                <MenuItem value="">Select Product</MenuItem>
                {products?.rows.map((product: any) => (
                  <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                ))}
              </Select>
            )
          }

          {loadingPackagings ? (
            <LoadingDiv />
          ) : (
            <Select
              id="packaging"
              value={inputInventoryCreate.packagingId}
              onChange={(e) =>
                setInputInventoryCreate({
                  ...inputInventoryCreate,
                  packagingId: e.target.value as string,
                })
              }
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Select Packaging</MenuItem>
              {packagings?.rows?.map((packaging: any, index: number) => (
                <MenuItem key={`packaging-${index}`} value={packaging.id}>
                  {`${packaging.unitQuantity} ${packaging.unit?.name}`}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* New fields for quantity, unit cost, and notes */}
          <TextField
            label="Quantity"
            fullWidth
            margin="normal"
            value={inputInventoryCreate.quantity || ''}
            onChange={(e) => setInputInventoryCreate({ ...inputInventoryCreate, quantity: parseInt(e.target.value, 10) })}
          />
          <TextField
            label="Unit Cost"
            fullWidth
            margin="normal"
            value={inputInventoryCreate.unitPrice?.toString() || ''}
            onChange={(e) => setInputInventoryCreate({ ...inputInventoryCreate, unitPrice: parseFloat(e.target.value).toString() })}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={inputInventoryCreate.notes || ''}
            onChange={(e) => setInputInventoryCreate({ ...inputInventoryCreate, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInventoryCreateModal(false)}>Cancel</Button>
          <Button
            onClick={() => handleInventoryCreate(currentGrnId!)}
            disabled={creatingInventory}
            variant="contained"
            color="primary"
          >
            {creatingInventory ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inventory Update Modal */}
      <Dialog open={openInventoryUpdateModal} onClose={() => setOpenInventoryUpdateModal(false)}>
        <DialogTitle>Edit Inventory</DialogTitle>
        <DialogContent>
          <TextField
            label="Product ID"
            fullWidth
            margin="normal"
            value={inputInventoryUpdate.id || ''}
            onChange={(e) => setInputInventoryUpdate({ ...inputInventoryUpdate, id: e.target.value })}
          />
          <TextField
            label="Quantity"
            fullWidth
            margin="normal"
            value={inputInventoryUpdate.quantity || ''}
            onChange={(e) => setInputInventoryUpdate({ ...inputInventoryUpdate, quantity: parseInt(e.target.value, 10) })}
          />
          {/* Add more fields as necessary */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInventoryUpdateModal(false)}>Cancel</Button>
          <Button
            onClick={handleInventoryUpdate}
            disabled={updatingInventory}
            variant="contained"
            color="primary"
          >
            {updatingInventory ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
