import type { IDateValue } from 'src/types/common';
import type { GridColDef } from '@mui/x-data-grid';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  {
    field: 'supplyRef',
    headerName: 'Supply Ref',
    width: 160,
    editable: true,
  },
  {
    field: 'grnNo',
    headerName: 'Grn No',
    width: 160,
    editable: true,
  },
  {
    field: 'items',
    headerName: 'Items',
    type: 'number',
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center',
  },
  //Add created by in future
  {
    field: 'createdAt',
    headerName: 'Created At',
    type: 'number',
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center',
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
    age: number;
    name: string;
    email: string;
    rating: number;
    status: string;
    isAdmin: boolean;
    lastName: string;
    firstName: string;
    performance: number;
    lastLogin: IDateValue;
  }[];
};

export function GrnList({ data }: Props) {
  const handleNewRow = () => {
    // dialog.onTrue();
    // isEdit.onFalse();
    console.log('New Row');
  };
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="GRN List"
          links={[{ name: 'List', href: '/dashboard' }]}
          action={
            <Button
              // component={RouterLink}
              // href={paths.v2.marketing.clients.new}
              onClick={handleNewRow}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New GRN
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <DataGrid columns={columns} rows={data} checkboxSelection disableRowSelectionOnClick />;
      </DashboardContent>
    </>
  );
}
