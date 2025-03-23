'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination } from '@mui/material';
import { useTable, TableNoData, TableEmptyRows, TableHeadCustom, TablePaginationCustom, emptyRows } from 'src/components/table';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { formatDate, formatTimeTo12Hr } from 'src/lib/helpers';
import { ICampaignRunCreate, ICampaignRunUpdate } from 'src/lib/interface/campaign.interface';
import { M_CAMPAIGN } from 'src/lib/mutations/campaign.mutation';
import { useBoolean } from 'src/hooks/use-boolean';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CAMPAIGN_RUN_CREATE, CAMPAIGN_RUN_RECYCLE, CAMPAIGN_RUN_RESTORE, CAMPAIGN_RUN_UPDATE, M_CAMPAIGN_RUNS_ACTIVE, M_CAMPAIGN_RUNS_RECYCLED } from 'src/lib/mutations/campaign-run.mutation';

// Define the tabs
const TABS = [
  { value: 'overview', icon: <Iconify icon="solar:phone-bold" width={24} />, label: 'Overview' },
  { value: 'runs', icon: <Iconify icon="solar:heart-bold" width={24} />, label: 'Runs' },
];

export default function Page({ params: { id } }: any) {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const { action: getCampaign, data: campaign } = GQLMutation({
    mutation: M_CAMPAIGN,
    resolver: 'm_campaign',
    toastmsg: false,
  });

  const dialog = useBoolean();
  const [inputCreate, setInputCreate] = useState<ICampaignRunCreate>({
    managerId: undefined,
    runTypeId: undefined,
    dateStart: undefined,
    dateStop: undefined,
    closeAdvertOn: undefined,
  });

  const [currentTab, setCurrentTab] = useState('overview');

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const { action: create, loading: creating } = GQLMutation({
    mutation: CAMPAIGN_RUN_CREATE,
    resolver: 'runCreate',
    toastmsg: true,
  });

  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: CAMPAIGN_RUN_RECYCLE,
    resolver: 'runRecycle',
    toastmsg: true,
  });

  const { action: restore, loading: restoring } = GQLMutation({
    mutation: CAMPAIGN_RUN_RESTORE,
    resolver: 'runRestore',
    toastmsg: true,
  });

  const {
    action: getRunsActive,
    data: runsActive,
    loading: loadingRunsActive,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUNS_ACTIVE,
    resolver: 'm_runs',
    toastmsg: false,
  });
  const {
    action: getRunsRecycled,
    data: runsRecycled,
    loading: loadingRunsRecycled,
  } = GQLMutation({
    mutation: M_CAMPAIGN_RUNS_RECYCLED,
    resolver: 'm_runsRecycled',
    toastmsg: false,
  }); 

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (id) getCampaign({ variables: { input: { id } } });
  }, [id, getCampaign]);

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

  const table = useTable({ defaultOrderBy: 'name' });

  const columnsActive = [
    { id: 'name', label: 'Name' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'clockInTime', label: 'Clock In Time' },
    { id: 'clockOutTime', label: 'Clock Out Time' },
    { id: 'manage', label: 'Manage', align: 'center' },
  ];

  const columnsRecycled = [
    { id: 'name', label: 'Name' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'clockInTime', label: 'Clock In Time' },
    { id: 'clockOutTime', label: 'Clock Out Time' },
    { id: 'recycled', label: 'Recycled', align: 'center' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <CustomBreadcrumbs
          heading="Campaign Details"
          links={[
            { name: 'Dashboard', href: paths.v2.marketing.root },
            { name: 'Projects', href: paths.v2.marketing.projects.list },
            { name: 'Campaign', href: paths.v2.marketing.projects.campaign(id) },
            { name: 'Details' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      <Typography variant="h4" gutterBottom>
        {campaign?.name}
      </Typography>
      <Tabs value={currentTab} onChange={handleTabChange}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      <Paper variant="outlined" sx={{ p: 2.5, typography: 'body2', borderRadius: 1.5, height: '85vh' }}>
        {currentTab === 'overview' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Created:</Typography>
              <Typography variant="body2">{campaign?.created}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Runs:</Typography>
              <Typography variant="body2">{campaign?.runs?.length}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Job Description:</Typography>
              <Typography variant="body2">{campaign?.jobDescription}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Job Qualifications:</Typography>
              <Typography variant="body2">{campaign?.jobQualification}</Typography>
            </Grid>
          </Grid>
        )}
        {currentTab === 'runs' && (
          <Box sx={{ p: 3 }}>
            <Button
              onClick={() => dialog.onTrue()}
              variant="contained"
              sx={{ mt: 3 }}
            >
              New Run
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={columnsActive}
                  rowCount={runsActive?.rows.length || 0}
                  numSelected={selectedActive.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      runsActive?.rows.map((row: any) => row.id) || []
                    )
                  }
                />
                <TableBody>
                  {runsActive?.rows.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedActive.includes(row.id)}
                          onChange={() => table.onSelectRow(row.id)}
                        />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{formatDate(row.dateStart)}</TableCell>
                      <TableCell>{formatDate(row.dateStop)}</TableCell>
                      <TableCell>{formatTimeTo12Hr(row.clockInTime)}</TableCell>
                      <TableCell>{formatTimeTo12Hr(row.clockOutTime)}</TableCell>
                      <TableCell align="center">
                        {/* Add manage buttons here */}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableEmptyRows
                    height={56}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, runsActive?.rows.length || 0)}
                  />
                  <TableNoData notFound={!runsActive?.rows.length} />
                </TableBody>
              </Table>
            </TableContainer>
            <TablePaginationCustom
              page={table.page}
              dense={table.dense}
              count={runsActive?.rows.length || 0}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onChangeDense={table.onChangeDense}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
