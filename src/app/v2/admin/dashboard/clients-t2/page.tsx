'use client';

import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, IconButton } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { DataGridEyeIcon } from 'src/theme/core/components/mui-x-data-grid';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { M_CLIENT_T2 } from 'src/lib/mutations/client-t2.mutation';
import { dummyT2Clients } from 'src/sections/analytics/_mock/dashboard-data';

export default function ClientsT2() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState('active');
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    
    const { action: getClient, data: client } = GQLMutation({
        mutation: M_CLIENT_T2,
        resolver: 'tier2Client',
        toastmsg: false,
    });

    const activeColumns = [
        { field: 'index', headerName: '#', width: 60 },
        { field: 'clientNo', headerName: 'CLIENT No', width: 100 },
        { field: 'name', headerName: 'NAME', width: 200 },
        {
            field: 'clientType',
            headerName: 'CLIENT TYPE',
            width: 150,
            valueGetter: (params: any) => params.name
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
                            getClient({ variables: { input: { id: params.row.id } } });
                            setOpen(true);
                        }}
                        sx={{ minWidth: 'unset', p: 1 }}
                    >
                        <Icon icon="solar:pen-bold" width={20} />
                    </Button>
                    <IconButton
                        onClick={() => router.push(`/v2/admin/dashboard/clients-t2/${params.row.id}`)}
                        color="primary"
                    >
                        <DataGridEyeIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];

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

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Tier 2 Clients
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab value="active" label="Active Records" />
                    <Tab value="recycled" label="Recycled Records" />
                </Tabs>

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
                            >
                                Recycle
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={selectedRows.length === 0}
                        >
                            Restore
                        </Button>
                    )}
                </Stack>

                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={dummyT2Clients?.rows || []}
                        columns={currentTab === 'active' ? activeColumns : recycledColumns}
                        checkboxSelection
                        disableRowSelectionOnClick
                        slots={{
                            noRowsOverlay: () => <div>No data available</div>,
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        onRowSelectionModelChange={(newSelection) => {
                            setSelectedRows(newSelection as string[]);
                        }}
                    />
                </div>
            </Paper>
        </DashboardContent>
    );
}
