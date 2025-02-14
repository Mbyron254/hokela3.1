'use client';

import React, { useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Stack,
    Paper
} from '@mui/material';
import { GQLMutation } from 'src/lib/client';
import { sourceImage } from 'src/lib/server';
import { M_CLIENT_T2 } from 'src/lib/mutations/client-t2.mutation';

const Page = ({ params: { id } }: any) => {
    const { action: getClient, data: client } = GQLMutation({
        mutation: M_CLIENT_T2,
        resolver: 'tier2Client',
        toastmsg: false,
    });

    useEffect(() => {
        if (id) {
            getClient({ variables: { input: { id } } });
        }
    }, []);

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
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            {/* Additional content can go here */}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardContent>
    );
};

export default Page;
