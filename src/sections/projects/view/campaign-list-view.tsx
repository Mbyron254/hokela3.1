'use client';

import type { IDateValue } from 'src/types/common';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useCallback } from 'react';

import { Box , Stack, Button, Typography } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', filterable: false },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 160,
    hideable: false,
    renderCell: (params) => (
      <Typography component="span" variant="body2" noWrap>
        {params.row.name}
      </Typography>
    ),
  },
  {
    type: 'number',
    field: 'runs',
    headerName: 'Runs',
    flex: 1,
    minWidth: 160,
    editable: true,
    renderCell: (params) => (
      <Typography color="inherit" noWrap>
        {params.row.runs}
      </Typography>
    ),
  },
  {
    type: 'string',
    field: 'created',
    headerName: 'Created',
    align: 'right',
    headerAlign: 'right',
    width: 120,
    renderCell: (params) => (
      <Stack
        spacing={0.5}
        sx={{
          height: 1,
          lineHeight: 1,
          textAlign: 'right',
          justifyContent: 'center',
        }}
      >
        <Box component="span">{fDate(params.row.lastLogin)}</Box>
        <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
          {fTime(params.row.lastLogin)}
        </Box>
      </Stack>
    ),
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
    getActions: (params) => [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:eye-bold" />}
        label="View"
        onClick={() => console.info('VIEW', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Edit"
        onClick={() => console.info('EDIT', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Delete"
        onClick={() => console.info('DELETE', params.row.id)}
        sx={{ color: 'error.main' }}
      />,
    ],
  },
];

type Props = {
  data: {
    id: string;
    name: string;
    runs: IDateValue;
  }[];
};

const HIDE_COLUMNS = { id: false };

const HIDE_COLUMNS_TOGGLABLE = ['id', 'actions'];

export function CampaignListView({ id }: { id: string }) {
  const isEdit = useBoolean();

  const dialog = useBoolean();

  const [rows, setData] = useState<Props['data']>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const selected = rows.filter((row) => selectedRows.includes(row.id)).map((_row) => _row.id);

  console.info('SELECTED ROWS', selected);

  const handleNewRow = useCallback(
    () => {
      isEdit.onFalse();
      dialog.onTrue();
    },
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DashboardContent
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <CustomBreadcrumbs
          links={
            [
              // { name: 'Dashboard', href: paths.v2.marketing.root },
              // { name: 'Projects', href: paths.v2.marketing.projects.list },
              // { name: '' },
            ]
          }
          action={
            <Button
              onClick={handleNewRow}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Campaign
            </Button>
          }
          // sx={{ mb: { xs: 3, md: 5 } }}
        />
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRows(newSelectionModel);
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          slots={{
            toolbar: CustomToolbar as unknown as GridSlots['toolbar'],
            noRowsOverlay: () => <EmptyContent />,
            noResultsOverlay: () => <EmptyContent title="No results found" />,
          }}
          slotProps={{
            panel: { anchorEl: filterButtonEl },
            toolbar: { setFilterButtonEl, showQuickFilter: true },
            columnsManagement: { getTogglableColumns },
          }}
          sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
        />
      </DashboardContent>
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({ setFilterButtonEl }: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
