'use client';

import { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Chip } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { activeUsers, recycledUsers } from 'src/sections/analytics/_mock/dashboard-data';
import { NewAdminForm } from './components/NewAdminForm';

// Column definitions
const activeColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'state', headerName: 'State', width: 180, renderCell: (params: any) => params.row.state === 'active' ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="error" /> },
  { field: 'accountNo', headerName: 'Account No', width: 130 },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'created', headerName: 'Date Created', width: 180 },
  
];

const recycledColumns = [
  ...activeColumns.filter(col => col.field !== 'created'),
  { field: 'recycled', headerName: 'Date Recycled', width: 180 },
];

export default function Admins() {
  const [currentTab, setCurrentTab] = useState('active');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
  };

  // User management handlers
  const handleNewAdmin = () => {
    setOpen(true);
  };


  const handleActivate = () => {
    console.log('Activating users:', selectedRows);
  };

  const handleSuspend = () => {
    console.log('Suspending users:', selectedRows);
  };

  const handleRecycle = () => {
    console.log('Recycling users:', selectedRows);
  };

  const handleRestore = () => {
    console.log('Restoring users:', selectedRows);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Administrators
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab value="active" label="Active Records" />
          <Tab value="recycled" label="Recycled Records" />
        </Tabs>

        <NewAdminForm open={open} setOpen={setOpen} />

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
                onClick={handleNewAdmin}
              >
                New Admin
              </Button>
              <Button
                variant="outlined"
                color="success"
                disabled={selectedRows.length === 0}
                onClick={handleActivate}
              >
                Activate
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={selectedRows.length === 0}
                onClick={handleSuspend}
              >
                Suspend
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
            <>
              <Button
                variant="outlined"
                color="primary"
                disabled={selectedRows.length === 0}
                onClick={handleRestore}
              >
                Restore
              </Button>
            </>
          )}
        </Stack>

        <div style={{ height: 600, width: '100%' }}>
          {currentTab === 'active' ? (
            <DataGrid
              rows={activeUsers}
              columns={activeColumns}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                noRowsOverlay: () => <div>No data available</div>,
              }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection as string[])}
            />
          ) : (
            <DataGrid
              rows={recycledUsers}
              columns={recycledColumns}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                noRowsOverlay: () => <div>No data available</div>,
              }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection as string[])}
            />
          )}
        </div>
      </Paper>
    </DashboardContent>
  );
}