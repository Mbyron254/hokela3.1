'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box,
  Card,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { _mock } from 'src/_mock';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { Q_CLIENT_TYPES_MINI } from 'src/lib/queries/client.query';
import {
  CLIENT_T1_CREATE,
  CLIENT_T1_UPDATE,
  CLIENT_T1_RECYCLE,
  CLIENT_T1_RESTORE
} from 'src/lib/mutations/client-t1.mutation';
import { Q_CLIENTS_T1, Q_CLIENTS_T1_RECYCLED } from 'src/lib/queries/client-t1.query';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridCustom } from '../data-grid-custom';

const _dataGrid = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'alway') || (index % 4 && 'busy') || 'offline';

  return {
    id: _mock.id(index),
    status,
    email: _mock.email(index),
    name: _mock.fullName(index),
    age: _mock.number.age(index),
    lastLogin: _mock.time(index),
    isAdmin: _mock.boolean(index),
    lastName: _mock.lastName(index),
    rating: _mock.number.rating(index),
    firstName: _mock.firstName(index),
    performance: _mock.number.percent(index),
  };
});

type IClient = {
  id: string;
  clientNo: string;
  name: string;
  clientType: string;
  createdAt: string;
  status?: string;
  // lastLogin: IDateValue;
};
type TClientType = {
  __typename?: 'TClientType';
  id: string;
  name: string;
};
type ClientType = {
  id: string;
  name: string;
};

type TClientTier1 = {
  __typename: 'TClientTier1';
  index: number;
  id: string;
  name: string;
  clientNo: string;
  created: string;
  clientType: TClientType;
};

type TClientsTier1 = {
  __typename: 'TClientsTier1';
  count: number;
  rows: TClientTier1[];
};

export default function EnterpriseListView() {
  const router = useRouter();
  const [tableData, setTableData] = useState<IClient[]>([]);

  const usersQueryFilters = { page: 0, pageSize: 10 };

  const [client_types, setClientsType] = useState<ClientType[]>([]);

  // ----------------------------- -------------------------------------------------
  const { data: clientTypes } = GQLQuery({
    query: Q_CLIENT_TYPES_MINI,
    queryAction: 'clientTypes',
    variables: { input: {} },
  });
  const {
    refetch: refetchClientsActive,
    data: clientsActive,
    loading: loadingCientsActive,
  } = GQLQuery({
    query: Q_CLIENTS_T1,
    queryAction: 'tier1Clients',
    variables: { input: usersQueryFilters },
  });
  const {
    refetch: refetchClientsRecycled,
    data: clientsRecycled,
    loading: loadingCientsRecycled,
  } = GQLQuery({
    query: Q_CLIENTS_T1_RECYCLED,
    queryAction: 'tier1ClientsRecycled',
    variables: { input: usersQueryFilters },
  });

  const { action: create, loading: creating } = GQLMutation({
    mutation: CLIENT_T1_CREATE,
    resolver: 'tier1ClientCreate',
    toastmsg: true,
  });

  const { action: update, loading: updating } = GQLMutation({
    mutation: CLIENT_T1_UPDATE,
    resolver: 'tier1ClientUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: CLIENT_T1_RECYCLE,
    resolver: 'tier1ClientRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: CLIENT_T1_RESTORE,
    resolver: 'tier1ClientRestore',
    toastmsg: true,
  });

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  useMemo(() => {
    console.log('Memo starts');
    const clientsTypeData = clientTypes?.rows ? transformClientTypesData(clientTypes.rows) : [];
    console.log('clientsType:', clientsTypeData);
    if (clientsActive && clientsRecycled) {
      const activeClients = transformClientData(clientsActive.rows);
      const recycledClients = transformRecycledClientData(clientsRecycled.rows);
      const clientsType = clientTypes?.rows ? transformClientTypesData(clientTypes.rows) : [];
      setClientsType(clientsType);

      setTableData([...activeClients, ...recycledClients]);
    }
  }, [clientsActive, clientsRecycled, clientTypes]);

  useEffect(() => {
    if (clientTypes) {
      const clientsType = clientTypes.rows;
      console.log('client types:', clientTypes);
    }
  }, [clientTypes]);

  // -----------------------------enterprise form -------------------------------------------------
  const isEdit = useBoolean();
  const dialog = useBoolean();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    client_type: '',
  });

  const handleNewRow = () => {
    dialog.onTrue();
  };
  const handleEditRow = (row: any) => {
    if (row) {
      console.log('Editing row with ID:', row);

      console.log(tableData, 'Client');
    }
  };

  const handleViewRow = (row: any) => {
    if (row) {
      router.replace(paths.v2.admin.clients.enterprise.details(row?.id));
    }
  };

  const handleDialogClose = () => {
    setFormData({
      id: '',
      name: '',
      client_type: '',
    });
    dialog.onFalse();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleClientTypeChange = (_: any, value: any) => {
    setFormData({
      ...formData,
      client_type: value?.id || '',
    });
  };
  const handleSubmit = () => {
    if (isEdit.value) {
      console.log('Edit');
    } else {
      console.log(formData, 'formData');
      const inputCreate = {
        clientTypeId: formData.client_type,
        name: formData.name,
      };
      create({ variables: { input: inputCreate } });
    }
    handleDialogClose();
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

  const handleUpdate = () => {
    if (isEdit.value) {
      const inputUpdate = {
        id: formData.id,
        clientTypeId: formData.client_type,
        name: formData.name,
      };
      update({ variables: { input: inputUpdate } });
    }
    handleDialogClose();
  };

  // ---------------------------enterprise form ----------------------------------------------------

  return (
    <DashboardContent>
      <Card sx={{ p: 5 }}>
        <Box sx={{ height: 600 }}>
          <CustomBreadcrumbs
            heading="Enterprise Clients"
            links={[
              { name: 'Dashboard', href: paths.v2.admin.root },
              { name: 'Enterprise Clients', href: paths.v2.admin.clients.enterprise.root },
              { name: 'Enterprise Clients List' },
            ]}
            action={
              <Button
                onClick={() => {
                  handleNewRow();
                  isEdit.onFalse();
                }}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Client
              </Button>
            }
          />
          <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
            <DialogTitle>
              {isEdit.value ? 'Edit Enterprise Client' : 'New Enterprise Client'}
            </DialogTitle>

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
                options={client_types ?? []}
                value={
                  client_types?.find(
                    (client: { id: string }) => client.id === formData.client_type
                  ) || null
                }
                getOptionLabel={(option) => option.name}
                onChange={handleClientTypeChange}
                renderInput={(params) => (
                  <TextField {...params} label="Clients Type" margin="none" />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleDialogClose} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button onClick={isEdit.value ? handleUpdate : handleSubmit} variant="contained">
                {isEdit.value ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
          <DataGridCustom
            data={tableData ?? []}
            handleEditRow={handleEditRow}
            handleViewRow={handleViewRow}
          />
        </Box>
      </Card>
    </DashboardContent>
  );
}

const transformClientData = (clients: Array<TClientTier1>) =>
  clients.map((client) => ({
    id: client.id,
    clientNo: client.clientNo, // Add clientNo field
    name: client.name,
    clientType: client.clientType.name,
    createdAt: client.created,
    status: 'active', // Add status field
  }));

// Transform clientsRecycled data
const transformRecycledClientData = (clients: Array<TClientTier1>) =>
  clients.map((client) => ({
    id: client.id,
    clientNo: client.clientNo, // Add clientNo field
    name: client.name,
    clientType: client.clientType.name,
    createdAt: client.created,
    status: 'suspended', // Add status field
  }));
const transformClientTypesData = (clientTypes: Array<TClientType>) =>
  clientTypes.map((clientType) => ({
    id: clientType.id,
    name: clientType.name,
  }));
