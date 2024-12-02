import type { RatingProps } from '@mui/material/Rating';
import type {
  GridSlots,
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
  GridFilterInputValueProps,
} from '@mui/x-data-grid';

import { useRef, useMemo, useState, useImperativeHandle } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const baseColumns: GridColDef[] = [
  {
    field: 'clientName',
    headerName: 'Organization',
    width: 200,
  },
  {
    field: 'campaignName',
    headerName: 'Campaign',
    width: 200,
  },
  {
    field: 'created',
    headerName: 'Application Date',
    width: 200,
  },
  {
    field: 'closeAdvertOn',
    headerName: 'Deadline',
    width: 200,
    renderCell: (params) => fDate(params.row.closeAdvertOn),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.row.status || 'Pending'}
        color={
          (params.row.status === 'Approved' && 'success') ||
          (params.row.status === 'Rejected' && 'error') ||
          'warning'
        }
        variant="soft"
        size="small"
      />
    ),
  },
];

// ----------------------------------------------------------------------

type DataGridRow = {
  id: string;
  index: number;
  created: string;
  agentName: string;
  projectName: string;
  campaignName: string;
  clientName: string;
  code: string;
  closeAdvertOn: string;
};

const HIDE_COLUMNS = { id: false };

const HIDE_COLUMNS_TOGGLABLE = ['id', 'actions'];

export function DataGridCustom({ data }: { data: DataGridRow[] }) {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const columns = useMemo(
    () =>
      baseColumns.map((col) =>
        col.field === 'rating' ? { ...col, filterOperators: ratingOnlyOperators } : col
      ),
    []
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const selected = data.filter((row) => selectedRows.includes(row.id)).map((_row) => _row.id);

  console.info('SELECTED ROWS', selected);

  return (
    <DataGrid
      checkboxSelection
      disableRowSelectionOnClick
      rows={data}
      columns={columns}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectedRows(newSelectionModel);
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      slots={{
        toolbar: CustomToolbar as GridSlots['toolbar'],
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

// ----------------------------------------------------------------------

function RatingInputValue({ item, applyValue, focusElementRef }: GridFilterInputValueProps) {
  const ratingRef: React.Ref<any> = useRef(null);

  useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current.querySelector(`input[value="${Number(item.value) || ''}"]`).focus();
    },
  }));

  const handleFilter: RatingProps['onChange'] = (event, newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Rating
      ref={ratingRef}
      precision={0.5}
      value={Number(item.value)}
      onChange={handleFilter}
      name="custom-rating-filter-operator"
      sx={{ ml: 2 }}
    />
  );
}

const ratingOnlyOperators: GridFilterOperator[] = [
  {
    label: 'Above',
    value: 'above',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params): boolean => Number(params.value) >= Number(filterItem.value);
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: 'number' },
    getValueAsString: (value: number) => `${value} Stars`,
  },
];
