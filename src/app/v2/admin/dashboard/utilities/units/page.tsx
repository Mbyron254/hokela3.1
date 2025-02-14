'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { IUnitCreate, IUnitUpdate } from 'src/lib/interface/unit.interface';
import {
  UNIT,
  UNIT_CREATE,
  UNIT_RECYCLE,
  UNIT_RESTORE,
  UNIT_UPDATE,
} from 'src/lib/mutations/unit.mutation';
import { Q_UNITS_ACTIVE, Q_UNITS_RECYCLED } from 'src/lib/queries/unit.query';

export default function Page() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [inputCreate, setInputCreate] = useState<IUnitCreate>({
    name: undefined,
    abbreviation: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState<IUnitUpdate>({
    id: undefined,
    name: undefined,
    abbreviation: undefined,
  });

  const queryFilters = { page: 0, pageSize: 10 };
  const {
    refetch: refetchUnitsActive,
    data: unitsActive,
    loading: loadingUnitsActive,
  } = GQLQuery({
    query: Q_UNITS_ACTIVE,
    queryAction: 'units',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchUnitsRecycled,
    data: unitsRecycled,
    loading: loadingUnitsRecycled,
  } = GQLQuery({
    query: Q_UNITS_RECYCLED,
    queryAction: 'unitsRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getUnit,
    loading: loadingUnit,
    data: unit,
  } = GQLMutation({
    mutation: UNIT,
    resolver: 'm_unit',
    toastmsg: false,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: UNIT_CREATE,
    resolver: 'unitCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: UNIT_UPDATE,
    resolver: 'unitUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: UNIT_RECYCLE,
    resolver: 'unitRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: UNIT_RESTORE,
    resolver: 'unitRestore',
    toastmsg: true,
  });

  const activeColumns = [
    { field: 'index', headerName: '#', width: 60 },
    { field: 'name', headerName: 'NAME', flex: 1 },
    { field: 'abbreviation', headerName: 'ABBREVIATION', width: 150 },
    { field: 'packagings', headerName: 'PACKAGINGS', width: 120, valueGetter: (params: any) => JSON.stringify(params) },
    { field: 'created', headerName: 'CREATED', width: 180 },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 100,
      renderCell: (params: any) => (
        <Button
          size="small"
          onClick={() => {
            //loadUnit(params.row.id);
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
  const loadUnit = (id: string) => {
    getUnit({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (unit) {
      setInputUpdate({
        id: unit.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
      });
    }
  }, [unit]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Units of Measurement
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
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
                New Unit
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
            rows={currentTab === 'active' ? unitsActive?.rows || [] : unitsRecycled?.rows || []}
            columns={currentTab === 'active' ? activeColumns : recycledColumns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={currentTab === 'active' ? loadingUnitsActive : loadingUnitsRecycled}
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
        <DialogTitle>New Unit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Unit Name"
            fullWidth
            value={inputCreate.name || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Abbreviation"
            fullWidth
            value={inputCreate.abbreviation || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, abbreviation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNew(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Unit Name"
            fullWidth
            value={inputUpdate.name || ''}
            onChange={(e) => setInputUpdate({ ...inputUpdate, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Abbreviation"
            fullWidth
            value={inputUpdate.abbreviation || ''}
            onChange={(e) => setInputUpdate({ ...inputUpdate, abbreviation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={updating}>Update</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
