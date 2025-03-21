'use client';

import type { IDateValue } from 'src/types/common';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useCallback, useEffect } from 'react';

import { Box ,
  Card,
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  CardHeader,
  DialogTitle,
  DialogContent,
  DialogActions,
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

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  M_CAMPAIGNS_ACTIVE,
  M_CAMPAIGNS_RECYCLED,
  M_CAMPAIGN,
  CAMPAIGN_CREATE,
  CAMPAIGN_UPDATE,
  CAMPAIGN_RECYCLE,
  CAMPAIGN_RESTORE,
} from 'src/lib/mutations/campaign.mutation';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

interface ICampaignCreate {
  projectId?: string;
  name?: string;
  jobDescription?: string;
  jobQualification?: string;
}

interface ICampaignUpdate {
  id?: string;
  projectId?: string;
  name?: string;
  jobDescription?: string;
  jobQualification?: string;
}

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
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    qualification: '',
  });

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
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: CAMPAIGN_CREATE,
    resolver: 'campaignCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: CAMPAIGN_UPDATE,
    resolver: 'campaignUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: CAMPAIGN_RECYCLE,
    resolver: 'campaignRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: CAMPAIGN_RESTORE,
    resolver: 'campaignRestore',
    toastmsg: true,
  });

  const _inputUpdate: ICampaignUpdate = {
    id: undefined,
    name: undefined,
    jobDescription: undefined,
    jobQualification: undefined,
  };
  const [inputCreate, setInputCreate] = useState<ICampaignCreate>({
    name: undefined,
    jobDescription: undefined,
    jobQualification: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

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
    dialog.onFalse();
  };

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

  const handleCreate = () => {
    if (projectId) {
      create({ variables: { input: { ...inputCreate, projectId } } });
    }
  };
  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } });
  };
  const handleRecycle = () => {
    if (selectedActive.length) {
      recycle({ variables: { input: { ids: selectedActive } } });
    }
  };
  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  useEffect(() => {
    const Page = 1;
    const size = 10;
    if (projectId) {
      getCampaignsActive({ variables: { input: { projectId, page: Page, pageSize: size } } });
      getCampaignsRecycled({ variables: { input: { projectId, page: Page, pageSize: size } } });
    }
  }, [projectId, created, updated, recycled, restored, getCampaignsActive, getCampaignsRecycled]);

  return (
    <DashboardContent
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <CustomBreadcrumbs
        links={[
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
      />
      <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit.value ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>

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
                value={inputCreate.name}
                onChange={(e) =>
                  setInputCreate({
                    ...inputCreate,
                    name: e.target.value,
                  })
                }
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Job Description</Typography>
              <TextField
                fullWidth
                name="jobDescription"
                margin="dense"
                variant="outlined"
                label="Job Description"
                value={inputCreate.jobDescription}
                onChange={(e) =>
                  setInputCreate({
                    ...inputCreate,
                    jobDescription: e.target.value,
                  })
                }
              />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Job Qualification</Typography>
              <TextField
                fullWidth
                name="jobQualification"
                margin="dense"
                variant="outlined"
                label="Job Qualification"
                value={inputCreate.jobQualification}
                onChange={(e) =>
                  setInputCreate({
                    ...inputCreate,
                    jobQualification: e.target.value,
                  })
                }
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleCreate} variant="contained">
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
          toolbar: () => (
            <CustomToolbar
              setFilterButtonEl={setFilterButtonEl}
              showQuickFilter={true}
            />
          ),
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No results found" />,
        }}
        slotProps={{
          panel: { anchorEl: filterButtonEl },
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
  showQuickFilter: boolean;
}

function CustomToolbar({ setFilterButtonEl, showQuickFilter }: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      {showQuickFilter && <GridToolbarQuickFilter />}
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
