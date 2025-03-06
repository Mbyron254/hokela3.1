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
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
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

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    clientNo: string;
    name: string;
    clientType: string;
    createdAt: string;
    status?: string;
    // lastLogin: IDateValue;
  }[];
  handleEditRow: (id: string) => void;
};

const HIDE_COLUMNS = { id: false };

const HIDE_COLUMNS_TOGGLABLE = ['id', 'actions'];

export function DataGridCustom({ data, handleEditRow }: Props) {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const baseColumns: GridColDef[] = [
    { field: 'id', headerName: 'Id', filterable: false },
    {
      field: 'clientNo',
      headerName: 'Client No',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Typography component="span" variant="body2" noWrap>
          {params.row.clientNo}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={params.row.name} sx={{ width: 36, height: 36 }}>
            {params.row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Link color="inherit" noWrap>
            {params.row.name}
          </Link>
        </Stack>
      ),
    },
    {
      field: 'clientType',
      headerName: 'Client Type',
      flex: 1,
      minWidth: 160,
      editable: true,
      renderCell: (params) => (
        <Typography color="inherit" noWrap>
          {params.row.clientType}
        </Typography>
      ),
    },
    {
      type: 'string',
      field: 'createdAt',
      headerName: 'Registered',
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
          <Box component="span">{fDate(params.row.createdAt)}</Box>
          <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
            {fTime(params.row.createdAt)}
          </Box>
        </Stack>
      ),
    },
    {
      type: 'singleSelect',
      field: 'status',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      editable: true,
      valueOptions: ['online', 'alway', 'busy'],
      renderCell: (params) => (
        <Label
          variant="soft"
          color={
            (params.row.status === 'busy' && 'error') ||
            (params.row.status === 'alway' && 'warning') ||
            'success'
          }
        >
          {params.row.status}
        </Label>
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
          onClick={() => handleEditRow(params.row)} // Pass row ID to parent
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => console.log('VIEW', params.row.id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const columns = useMemo(
    () =>
      baseColumns.map((col) =>
        col.field === 'rating' ? { ...col, filterOperators: ratingOnlyOperators } : col
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // @ts-expect-error
        toolbar: CustomToolbar as GridSlots['toolbar'],
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
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  setFilterButtonEl: (el: HTMLButtonElement | null) => void;
  // showQuickFilter: boolean;
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
