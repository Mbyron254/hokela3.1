'use client';

import type { IDateValue } from 'src/types/common';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useCallback } from 'react';

import {
  Box,
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardHeader,
  TextField,
} from '@mui/material';
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

import {
  M_CAMPAIGNS_ACTIVE,
  M_CAMPAIGNS_RECYCLED,
  // M_CAMPAIGN,
  // CAMPAIGN_CREATE,
  // CAMPAIGN_UPDATE,
  // CAMPAIGN_RECYCLE,
  // CAMPAIGN_RESTORE,
} from 'src/lib/mutations/campaign.mutation';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { GQLMutation } from 'src/lib/client';
import { Card } from '@mui/material';

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

export function CampaignListView({ projectId }: { projectId: string }) {
  const isEdit = useBoolean();

  const dialog = useBoolean();

  const [rows, setData] = useState<Props['data']>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    qualification: '',
  });

  // -----------------------------------------------------------------------------------------------------------------------------------
  const {
    action: getCampaignsActive,
    data: campaignsActive,
    loading: loadingCampaignsActive,
  } = GQLMutation({
    mutation: M_CAMPAIGNS_ACTIVE,
    resolver: 'm_campaigns',
    toastmsg: false,
  });
  const {
    action: getCampaignsRecycled,
    data: campaignsRecycled,
    loading: loadingCampaignsRecycled,
  } = GQLMutation({
    mutation: M_CAMPAIGNS_RECYCLED,
    resolver: 'm_campaignsRecycled',
    toastmsg: false,
  });

  const loadCampaignsActive = (page?: number, pageSize?: number) => {
    if (projectId) {
      getCampaignsActive({ variables: { input: { projectId, page, pageSize } } });
    }
  };
  const loadCampaignsRecycled = (page?: number, pageSize?: number) => {
    if (projectId) {
      getCampaignsRecycled({ variables: { input: { projectId, page, pageSize } } });
    }
  };

  useState(
    () => {
      const Page = 1;
      const size = 10;
      loadCampaignsActive(Page, size);
      loadCampaignsRecycled(Page, size);
    },
    // @ts-expect-error
    []
  );

  console.log('campaignsActive', campaignsActive);
  console.log('campaignsRecycled', campaignsRecycled);

  // -----------------------------------------------------------------------------------------------------------------------------------

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDialogClose = () => {
    // setFormData({
    //   name: '',
    //   client: '',
    //   startDate: dayjs(),
    //   endDate: dayjs(),
    //   manager: '',
    //   description: '',
    // });
    dialog.onFalse();
  };
  // -----------------------------------------------------------------------

  const handleSubmit = () => {
    // if (isEdit.value) {
    //   updateProject(
  };
  return (
    <DashboardContent
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <CustomBreadcrumbs
        links={[
          // { name: 'Dashboard', href: paths.v2.marketing.root },
          // { name: 'Projects', href: paths.v2.marketing.projects.list },
          { name: '' },
        ]}
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
      <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit.value ? 'Edit Project' : 'New Project'}</DialogTitle>

        <DialogContent>
          <Card>
            <CardHeader
              title="Details"
              subheader="Title, short description, qualifications..."
              sx={{ mb: 3 }}
            />
          </Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Title</Typography>
              <TextField
                autoFocus
                fullWidth
                name="name"
                margin="dense"
                variant="outlined"
                label="Campaign Title"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Title</Typography>
              <TextField
                autoFocus
                fullWidth
                name="name"
                margin="dense"
                variant="outlined"
                label="Campaign Title"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEdit.value ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
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
          // @ts-expect-error
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
