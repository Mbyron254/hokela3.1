'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DashboardContent } from 'src/layouts/dashboard';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Chip,
    Stack,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { sourceImage } from 'src/lib/server';
import { USER_CREATE_ALIEN } from 'src/lib/mutations/user.mutation';
import {
    IT1AccountManagerCreate,
    IT1GuestAsAccountManager,
} from 'src/lib/interface/user.interface';
import { Q_GUESTS_MINI } from 'src/lib/queries/user.query';
import { parseUserState } from 'src/lib/helpers';
import { M_CLIENT_T1 } from 'src/lib/mutations/client-t1.mutation';
import {
    ADD_GUEST_AS_ACCOUNT_MANAGER,
    REMOVE_ACCOUNT_MANAGER,
} from 'src/lib/mutations/client.mutation';
import { Q_ACCOUNT_MANAGERS } from 'src/lib/queries/client.query';
import MuiPhoneNumber from 'mui-phone-number';

const Page = ({ params: { id } }: any) => {
    const [openNewManager, setOpenNewManager] = useState(false);
    const [openAddManager, setOpenAddManager] = useState(false);

    const { data: guests } = GQLQuery({
        query: Q_GUESTS_MINI,
        queryAction: 'usersActive',
        variables: { input: { guests: true } },
    });

    const { data: managers } = GQLQuery({
        query: Q_ACCOUNT_MANAGERS,
        queryAction: 'clientAccountManagers',
        variables: {
            input: { clientTier1Id: id },
        },
    });

    const { action: getClient, data: client } = GQLMutation({
        mutation: M_CLIENT_T1,
        resolver: 'tier1Client',
        toastmsg: false,
    });

    const { action: create, loading: creating } = GQLMutation({
        mutation: USER_CREATE_ALIEN,
        resolver: 'userCreateAlien',
        toastmsg: true,
    });

    const { action: add, loading: adding } = GQLMutation({
        mutation: ADD_GUEST_AS_ACCOUNT_MANAGER,
        resolver: 'addGuestAsAccountManager',
        toastmsg: true,
    });

    const { action: remove } = GQLMutation({
        mutation: REMOVE_ACCOUNT_MANAGER,
        resolver: 'removeAccountManager',
        toastmsg: true,
    });

    const [inputCreate, setInputCreate] = useState<IT1AccountManagerCreate>({
        name: undefined,
        phone: undefined,
        email: undefined,
        clientTier1Id: id,
    });

    const [inputT1GAAM, setInputT1GAAM] = useState<IT1GuestAsAccountManager>({
        userId: undefined,
        clientTier1Id: id,
    });

    useEffect(() => {
        if (id) {
            getClient({ variables: { input: { id } } });
        }
    }, []);

    const handleCreate = () => {
        create({ variables: { input: inputCreate } });
        setOpenNewManager(false);
    };

    const handleAdd = () => {
        add({ variables: { input: inputT1GAAM } });
        setOpenAddManager(false);
    };

    const handleRemove = (userId: string) => {
        remove({ variables: { input: { userId, clientTier1Id: id } } });
    };

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Client Profile
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={sourceImage(client?.profile?.photo?.fileName)}
                                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                {client?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {client?.clientType?.name}
                            </Typography>

                            <Stack spacing={2} sx={{ pt: 2 }}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Client No.</Typography>
                                    <Typography variant="body2">{client?.clientNo}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Joined Date</Typography>
                                    <Typography variant="body2">{client?.created}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Account Managers</Typography>
                                <Box>
                                    <Button size="small" onClick={() => setOpenNewManager(true)}>New Manager</Button>
                                    <Button size="small" onClick={() => setOpenAddManager(true)}>Add Existing</Button>
                                </Box>
                            </Box>

                            <Stack spacing={2}>
                                {managers?.rows?.map((manager: any, index: number) => {
                                    const { theme, label } = parseUserState(manager.state);
                                    return (
                                        <Paper key={`manager-${index}`} sx={{ p: 2 }}>
                                            <Box display="flex" alignItems="center">
                                                <Avatar
                                                    src={sourceImage(manager.profile?.photo?.fileName)}
                                                    sx={{ width: 40, height: 40, mr: 2 }}
                                                />
                                                <Box flex={1}>
                                                    <Typography variant="subtitle2">{manager.name}</Typography>
                                                    <Typography variant="caption" display="block">
                                                        A/C No: {manager.accountNo}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={label}
                                                    color={theme as any}
                                                    size="small"
                                                    onDelete={() => handleRemove(manager.id)}
                                                />
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            {/* Additional content can go here */}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* New Manager Dialog */}
            <Dialog open={openNewManager} onClose={() => setOpenNewManager(false)}>
                <DialogTitle>Create New User as A/C Manager</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Full Name"
                        margin="normal"
                        value={inputCreate.name || ''}
                        onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        margin="normal"
                        value={inputCreate.email || ''}
                        onChange={(e) => setInputCreate({ ...inputCreate, email: e.target.value })}
                    />
                    <Box sx={{ mt: 2 }}>
                        <MuiPhoneNumber
                            name="phoneNumber"
                            label="Phone Number"
                            defaultCountry="ke"
                            variant="outlined"
                            fullWidth
                            onChange={setInputCreate}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewManager(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={creating}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Add Existing Manager Dialog */}
            <Dialog open={openAddManager} onClose={() => setOpenAddManager(false)}>
                <DialogTitle>Add Guest as A/C Manager</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select Guest</InputLabel>
                        <Select
                            value={inputT1GAAM.userId || ''}
                            onChange={(e) => setInputT1GAAM({
                                ...inputT1GAAM,
                                userId: e.target.value === '' ? undefined : e.target.value,
                            })}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {guests?.rows?.map((guest: any, index: number) => (
                                <MenuItem value={guest.id} key={`guest-${index}`}>
                                    {guest.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddManager(false)}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={adding}>Add Manager</Button>
                </DialogActions>
            </Dialog>
        </DashboardContent>
    );
};

export default Page;