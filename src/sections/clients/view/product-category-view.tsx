'use client';

import type { IProductTableFilters } from 'src/types/client';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  Box,
  Tab,
  Tabs,
  Dialog,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
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
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';
import { CLIENTS, CLIENT_TYPE, CLIENTS_STATUS } from 'src/_mock/marketing/_clients';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
import {
  RenderCellProduct,
  RenderCellCreatedAt,
  RenderCellClientType,
  RenderCellNoOfProjects,
} from '../product-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

// Add this interface near the top with other interfaces
interface IClient {
  id: string;
  name: string;
  clientType: string;
  noOfProjects: number;
  createdAt: string;
  status?: string;
}

export function ProductCategoryView() {
  const confirmRows = useBoolean();

  const router = useRouter();

  const { products, productsLoading } = useGetProducts();

  const clients = CLIENTS;

  const filters = useSetState<IProductTableFilters>({ publish: [], stock: [] });

  const [tableData, setTableData] = useState<IClient[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [tabsFilter, setTabFilter] = useState<string>('all');

  const dialog = useBoolean();

  const isEdit = useBoolean();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  // Add these new states
  const [editingClient, setEditingClient] = useState<IClient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    clientType: '',
  });

  useEffect(
    () => {
      if (clients.length) {
        setTableData(clients);
      }
    },
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: tabsFilter });

  const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...CLIENTS_STATUS];

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      const client = tableData.find((row) => row.id === id);
      if (client) {
        setEditingClient(client);
        setFormData({
          name: client.name,
          clientType: client.clientType.toLowerCase(),
        });
        isEdit.onTrue();
        dialog.onTrue();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData]
  );

  const handleNewRow = useCallback(
    () => {
      isEdit.onFalse();
      dialog.onTrue();

      // router.push(paths.dashboard.product.edit(id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.v2.marketing.clients.details(id));
    },
    [router]
  );

  // Add these new handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClientTypeChange = (_: any, value: any) => {
    setFormData({
      ...formData,
      clientType: value?.value || '',
    });
  };

  const handleSubmit = () => {
    if (isEdit.value && editingClient) {
      // Update existing client
      const updatedData = tableData.map((item) =>
        item.id === editingClient.id
          ? {
              ...item,
              name: formData.name,
              clientType: formData.clientType,
            }
          : item
      );
      setTableData(updatedData);
      toast.success('Client updated successfully!');
    } else {
      // Create new client
      const newClient = {
        id: String(tableData.length + 1),
        name: formData.name,
        clientType: formData.clientType,
        noOfProjects: 0,
        createdAt: new Date().toISOString(),
      };
      setTableData([...tableData, newClient]);
      toast.success('Client created successfully!');
    }
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setFormData({ name: '', clientType: '' });
    setEditingClient(null);
    dialog.onFalse();
  };

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Client No', filterable: false },

    {
      field: 'name',
      headerName: 'Client',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'clientType',
      headerName: 'Client Type',
      width: 160,
      renderCell: (params) => <RenderCellClientType params={params} />,
    },
    {
      field: 'noOfProjects',
      headerName: 'No Of Projects',
      width: 160,
      renderCell: (params) => <RenderCellNoOfProjects params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
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
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      console.log(newValue, 'New Value');
      setTabFilter(newValue);
      // table.onResetPage();
      // filters.setState({ status: newValue });
    },
    []
    // [filters, table]
  );
  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <CustomBreadcrumbs
          links={[]}
          action={
            <Button
              // component={RouterLink}
              // href={paths.v2.marketing.clients.new}
              onClick={handleNewRow}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Client
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>{isEdit.value ? 'Edit Client' : 'New Client'}</DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              name="name"
              margin="dense"
              variant="outlined"
              label="Client Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Box sx={{ my: 2 }} />
            <Autocomplete
              fullWidth
              options={CLIENT_TYPE}
              value={CLIENT_TYPE.find((option) => option.value === formData.clientType) || null}
              onChange={handleClientTypeChange}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} label="Client Type" margin="none" />}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              )}
            />
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
        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
            padding: '10px',
          }}
        >
          <Tabs
            value={tabsFilter}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === tabsFilter) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'suspended' && 'warning') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { showQuickFilter: true },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  filters: UseSetStateReturn<IProductTableFilters>;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar filters={filters} options={{ status: CLIENTS_STATUS }} />

        <GridToolbarQuickFilter />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IClient[];
  filters: string;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  if (filters === 'all') {
    return inputData;
  }

  return inputData.filter((client) => client?.status === filters);
}
