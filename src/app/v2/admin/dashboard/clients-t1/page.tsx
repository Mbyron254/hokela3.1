'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, IconButton } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
    IClientT1Create,
    IClientT1Update,
} from 'src/lib/interface/client-t1.interface';
import {
    M_CLIENT_T1,
    CLIENT_T1_CREATE,
    CLIENT_T1_UPDATE,
    CLIENT_T1_RECYCLE,
    CLIENT_T1_RESTORE,
} from 'src/lib/mutations/client-t1.mutation';
import {
    Q_CLIENTS_T1,
    Q_CLIENTS_T1_RECYCLED,
} from 'src/lib/queries/client-t1.query';
import { Q_CLIENT_TYPES_MINI } from 'src/lib/queries/client.query';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { DataGridEyeIcon } from 'src/theme/core/components/mui-x-data-grid';
import { useRouter } from 'next/navigation';
// Create a new ClientForm component similar to NewAdminForm
// Will add that in a separate file

export default function ClientsT1() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState('active');
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const usersQueryFilters = { page: 0, pageSize: 10 };

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
    const {
        action: getClient,
        loading: loadingClient,
        data: client,
    } = GQLMutation({
        mutation: M_CLIENT_T1,
        resolver: 'tier1Client',
        toastmsg: false,
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
    const _inputUpdate: IClientT1Update = {
        id: undefined,
        clientTypeId: undefined,
        name: undefined,
    };

    const [selectedActive, setSelectedActive] = useState<string[]>([]);
    const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
    const [inputCreate, setInputCreate] = useState<IClientT1Create>({
        clientTypeId: undefined,
        name: undefined,
    });
    const [inputUpdate, setInputUpdate] = useState(_inputUpdate);

    // ... Keep all your existing GQL queries and mutations ...

    const activeColumns = [
        { field: 'index', headerName: '#', width: 60 },
        { field: 'clientNo', headerName: 'CLIENT No', width: 100 },
        { field: 'name', headerName: 'NAME', width: 200 },
        {
            field: 'clientType',
            headerName: 'CLIENT TYPE',
            width: 150,
            valueGetter: (params: any) => params?.name
        },
        { field: 'created', headerName: 'REGISTERED', width: 180 },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            width: 120,
            renderCell: (params: any) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        onClick={() => {
                            setInputUpdate(_inputUpdate);
                            loadClient(params.row.id);
                            setOpen(true);
                        }}
                        sx={{ minWidth: 'unset', p: 1 }}
                    >
                        <Icon icon="solar:pen-bold" width={20} />
                    </Button>
                    <IconButton
                        onClick={() => router.push(`/v2/admin/dashboard/clients-t1/${params.row.id}`)}
                        color="primary"
                    >
                        <DataGridEyeIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const dummyT1Clients = {
        count: 5,
        rows: [
            {
                index: 1,
                id: "c1a2b3d4",
                name: "Acme Corporation",
                clientNo: "T1-2024-001",
                created: "2024-03-15T10:30:00Z",
                clientType: {
                    id: "ct1",
                    name: "Enterprise"
                }
            },
            {
                index: 2,
                id: "e5f6g7h8",
                name: "Global Industries Ltd",
                clientNo: "T1-2024-002",
                created: "2024-03-14T09:15:00Z",
                clientType: {
                    id: "ct2",
                    name: "Corporate"
                }
            },
            {
                index: 3,
                id: "i9j0k1l2",
                name: "TechStart Solutions",
                clientNo: "T1-2024-003",
                created: "2024-03-13T14:45:00Z",
                clientType: {
                    id: "ct1",
                    name: "Enterprise"
                }
            },
            {
                index: 4,
                id: "m3n4o5p6",
                name: "First National Bank",
                clientNo: "T1-2024-004",
                created: "2024-03-12T11:20:00Z",
                clientType: {
                    id: "ct3",
                    name: "Financial"
                }
            },
            {
                index: 5,
                id: "q7r8s9t0",
                name: "Healthcare Plus",
                clientNo: "T1-2024-005",
                created: "2024-03-11T16:00:00Z",
                clientType: {
                    id: "ct4",
                    name: "Healthcare"
                }
            }
        ]
    };

    const recycledColumns = [
        { field: 'index', headerName: '#', width: 60 },
        { field: 'clientNo', headerName: 'CLIENT No', width: 100 },
        { field: 'name', headerName: 'NAME', width: 200 },
        {
            field: 'clientType',
            headerName: 'CLIENT TYPE',
            width: 150,
            valueGetter: (params: any) => params.row.clientType?.name
        },
        { field: 'recycled', headerName: 'RECYCLED', width: 180 },
    ];

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
        setSelectedRows([]);
    };

    const handleCreate = () => {
        create({ variables: { input: inputCreate } });
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
    const loadClient = (id: string) => {
        getClient({ variables: { input: { id } } });
    };
    // ... Keep your existing handlers (handleCreate, handleUpdate, etc) ...

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Tier 1 Clients
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab value="active" label="Active Records" />
                    <Tab value="recycled" label="Recycled Records" />
                </Tabs>

                {/* Add your modals here but styled with MUI */}

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        my: 2,
                        py: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    {currentTab === 'active' ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpen(true)}
                            >
                                New Client
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                disabled={selectedRows.length === 0}
                                onClick={handleRecycle}
                            >
                                Recycle
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={selectedRows.length === 0}
                            onClick={handleRestore}
                        >
                            Restore
                        </Button>
                    )}
                </Stack>

                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={currentTab === 'active' ? dummyT1Clients?.rows || [] : dummyT1Clients?.rows || []}
                        columns={currentTab === 'active' ? activeColumns : recycledColumns}
                        checkboxSelection
                        disableRowSelectionOnClick
                        loading={currentTab === 'active' ? loadingCientsActive : loadingCientsRecycled}
                        slots={{
                            noRowsOverlay: () => <div>No data available</div>,
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        onRowSelectionModelChange={(newSelection) => {
                            currentTab === 'active'
                                ? setSelectedActive(newSelection as string[])
                                : setSelectedRecycled(newSelection as string[]);
                        }}
                    />
                </div>
            </Paper>
        </DashboardContent>
    );
}