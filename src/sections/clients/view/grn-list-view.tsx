import { useState, useEffect } from 'react';
import { GQLMutation } from 'src/lib/client';
import { InputGRNCreate, InputGRNUpdate } from 'src/lib/interface/grns.interface';
import {
  GRN,
  GRNCreate,
  GRNRecycle,
  GRNRestore,
  GRNs,
  GRNs_RECYCLED,
  GRNUpdate,
} from 'src/lib/mutations/grn.mutation';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
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
    action: getGrn,
    loading: loadingGrn,
    data: grn,
    error: errorGrn,
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

  const init: InputGRNUpdate = {
    id: undefined,
    supplierRefNo: undefined,
    notes: undefined,
  };

  const [inputCreate, setInputCreate] = useState<InputGRNCreate>({
    supplierRefNo: undefined,
    notes: undefined,
  });

  const [inputUpdate, setInputUpdate] = useState(init);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

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

  const handleRecycle = (id: string) => {
    recycle({ variables: { input: { ids: [id] } } });
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
    }
  }, [clientTier2Id, getGrnsActive]);

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
          onClick={() => loadGrn(params.row.id)}
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
          onClick={() => handleRecycle(params.row.id)}
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
      {loadingGrnsActive ? (
        <CircularProgress />
      ) : errorGrnsActive ? (
        <div>Error loading GRNs: {errorGrnsActive.message}</div>
      ) : (
        <DataGrid
          columns={columns}
          rows={grnsActive?.rows || []}
          checkboxSelection
          disableRowSelectionOnClick
        />
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
    </DashboardContent>
  );
}
