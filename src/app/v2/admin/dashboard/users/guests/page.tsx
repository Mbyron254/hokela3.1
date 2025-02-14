'use client';

import { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Stack, Chip } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { GQLQuery } from 'src/lib/client';
import { Q_USERS_ACTIVE } from 'src/lib/queries/user.query';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { parseUserState } from 'src/lib/helpers';

// Column definitions
const columns = [
  { 
    field: 'index', 
    headerName: '#', 
    width: 60 
  },
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 300,
    renderCell: (params: any) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <img
          src={sourceImage(params.row.profile?.photo?.fileName)}
          alt={params.row.name}
          style={{ 
            width: TABLE_IMAGE_WIDTH, 
            height: TABLE_IMAGE_HEIGHT, 
            borderRadius: '50%' 
          }}
        />
        <Stack>
          <Typography variant="body2" noWrap>
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.email}
          </Typography>
        </Stack>
      </Stack>
    ),
  },
  { 
    field: 'accountNo', 
    headerName: 'A/C No', 
    width: 130 
  },
  { 
    field: 'phone', 
    headerName: 'Phone', 
    width: 150 
  },
  { 
    field: 'state', 
    headerName: 'State', 
    width: 120,
    renderCell: (params: any) => {
      const { theme, label } = parseUserState(params.row.state);
      return <Chip 
        label={label} 
        color={theme === 'success' ? 'success' : theme === 'warning' ? 'warning' : 'error'} 
        variant="outlined" 
      />;
    }
  },
  { 
    field: 'created', 
    headerName: 'Registered', 
    width: 180 
  },
];

export default function GuestsPage() {
  const [currentTab, setCurrentTab] = useState('active');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const usersQueryFilters = { guests: true, page, pageSize };
  
  const {
    data: guestsActive,
    loading: loadingGuestsActive,
  } = GQLQuery({
    query: Q_USERS_ACTIVE,
    queryAction: 'usersActive',
    variables: { input: usersQueryFilters },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setSelectedRows([]);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Guest Users
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab value="active" label="Records" />
        </Tabs>

        <div style={{ height: 600, width: '100%'}}>
          <DataGrid
            rows={guestsActive?.rows || []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loadingGuestsActive}
            slots={{
              noRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  No data available
                </Stack>
              ),
            }}
            pageSizeOptions={[5, 10, 25]}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            rowCount={guestsActive?.count || 0}
            paginationMode="server"
            onRowSelectionModelChange={(newSelection) => 
              handleSelectionChange(newSelection as string[])
            }
          />
        </div>
      </Paper>
    </DashboardContent>
  );
}