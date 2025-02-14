'use client'

import { Box, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { DashboardContent } from 'src/layouts/dashboard'

import { dummySessions } from 'src/sections/analytics/_mock/dashboard-data'

// Define columns configuration
const columns: GridColDef[] = [
  { 
    field: 'user',
    headerName: 'Name',
    width: 200,
    valueGetter: (params:any) => params.name
  },
  {
    field: 'user',
    headerName: 'Account',
    width: 130,
    valueGetter: (params:any) => params.role.name
  },
  {
    field: 'locked',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Box
        sx={{
          color: params.value ? '#ffd700' : '#4caf50',
          border: `1px solid ${params.value ? '#ffd700' : '#4caf50'}`,
          px: 1.5,
          py: 0.5,
          my: 1,
          mx: 1,
          fontSize: '0.875rem',
          fontWeight: 'medium'
        }}
      >
        {params.value ? 'Dormant' : 'Active'}
      </Box>
    )
  },
  { 
    field: 'created',
    headerName: 'Signed in at',
    width: 200
  },
  { 
    field: 'expireString',
    headerName: 'Expires at',
    width: 200
  }
]

const SessionsPage = () => {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Sessions
      </Typography>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={dummySessions.rows}
          columns={columns}
          // Optional features you might want:
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: () => <div>No data available</div>,
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
    </DashboardContent>
  )
}

export default SessionsPage