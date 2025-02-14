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
    Tabs,
    Tab,
    Grid,
    Chip,
    Stack,
    Paper
} from '@mui/material';
// import WorkIcon from '@mui/icons-material/Work';

// import ManageAgentKYC from '@/components/ManageAgentKYC';

import { GQLQuery } from 'src/lib/client';
import { Q_AGENT } from 'src/lib/queries/user.query';
import { TState } from 'src/lib/interface/general.interface';
import { parseUserState } from 'src/lib/helpers';
import { sourceImage } from 'src/lib/server';
import ManageAgentKYC from 'src/components/ManageAgentKYC';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`agent-tabpanel-${index}`}
            aria-labelledby={`agent-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AgentDetailsPage({ params: { id } }: any) {
    const [tabValue, setTabValue] = useState(0);
    const [state, setState] = useState<TState>();

    let {
        refetch: reloadAgent,
        loading: loadingAgent,
        data: agent,
    } = GQLQuery({
        query: Q_AGENT,
        queryAction: 'userAlien',
        variables: { input: { id } },
    });

    useEffect(() => {
        if (agent) {
            setState(parseUserState(agent.state));
        }
    }, [agent]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!agent) {
        agent = {
            index: 1,
            id: "usr_001",
            name: "John Smith",
            accountNo: "ACC001",
            phone: "+1-555-0101",
            email: "john.smith@example.com",
            state: "active",
            created: "2024-03-15T10:00:00Z",
            role: { name: "user" },
            profile: { photo: { fileName: "john_profile.jpg" } }
        }
    }

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Agents
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={sourceImage(agent?.profile?.photo?.fileName)}
                            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            {agent?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {agent?.role?.name}
                        </Typography>
                        <Chip
                            label={agent?.state}
                            color={agent?.state === 'active' ? 'success' : 'default'}
                            sx={{ mb: 2 }}
                        />

                        <Stack spacing={2} sx={{ pt: 2 }}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Account No.</Typography>
                                <Typography variant="body2">{agent?.accountNo}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Phone No.</Typography>
                                <Typography variant="body2">{agent?.phone}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body2">{agent?.email}</Typography>
                            </Box>
                        </Stack>
                    </CardContent>

                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ width: '100%' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="agent details tabs"
                        >
                            <Tab label="Overall Performance" />
                            <Tab label="Campaigns" />
                            <Tab label="Job Applications" />
                            <Tab label="K.Y.C" />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                        PERFORMANCE METRICS
                                    </Typography>
                                </CardContent>
                            </Card>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                        PORTFOLIO CAMPAIGNS
                                    </Typography>
                                </CardContent>
                            </Card>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                        JOB APPLICATIONS
                                    </Typography>
                                </CardContent>
                            </Card>
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <ManageAgentKYC agentId={agent?.agent?.id} />
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </DashboardContent>
    );
}