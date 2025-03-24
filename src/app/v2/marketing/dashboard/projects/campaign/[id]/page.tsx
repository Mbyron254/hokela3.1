'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableRow, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useTable, TableNoData, TableEmptyRows, TableHeadCustom, TablePaginationCustom, emptyRows } from 'src/components/table';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { formatDate, formatTimeTo12Hr } from 'src/lib/helpers';
import { ICampaignRunCreate } from 'src/lib/interface/campaign.interface';
import { M_CAMPAIGN } from 'src/lib/mutations/campaign.mutation';
import { useBoolean } from 'src/hooks/use-boolean';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CAMPAIGN_RUN_CREATE, CAMPAIGN_RUN_RECYCLE, CAMPAIGN_RUN_RESTORE, M_CAMPAIGN_RUNS_ACTIVE, M_CAMPAIGN_RUNS_RECYCLED } from 'src/lib/mutations/campaign-run.mutation';
import { M_USERS_MINI } from 'src/lib/mutations/user.mutation';

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

  console.log(session);

  const { action: getCampaign, data: campaign } = GQLMutation({
    mutation: M_CAMPAIGN,
    resolver: 'm_campaign',
    toastmsg: false,
  });

  const { action: getUsersMini, data: users } = GQLMutation({
    mutation: M_USERS_MINI,
    resolver: 'm_usersActive',
    toastmsg: false,
  });

  const dialog = useBoolean();
  const [inputCreate, setInputCreate] = useState<ICampaignRunCreate>({
    projectId: undefined,
    campaignId: id,
    runTypeId: undefined,
    managerId: undefined,
    dateStart: undefined,
    dateStop: undefined,
    checkInAt: undefined,
    checkOutAt: undefined,
    closeAdvertOn: undefined,
  });

  const [currentTab, setCurrentTab] = useState('overview');

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const { action: create, loading: creating } = GQLMutation({
    mutation: CAMPAIGN_RUN_CREATE,
    resolver: 'campaignRunCreate',
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

  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (id) getCampaign({ variables: { input: { id } } });
  }, [id, getCampaign, getUsersMini]);//Variable "$input" of required type "InputUsers!" was not provided.


  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      getUsersMini({
        variables: {
          input: { clientTier1Id: session.user.role.clientTier1.id },
        },
      });
    }
  }, [session?.user?.role?.clientTier1?.id, getUsersMini]);

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateRun = () => {
    create({ variables: { input: inputCreate } });
    handleCloseDialog();
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
              onClick={handleOpenDialog}
              variant="contained"
              sx={{ my: 3 }}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>New Run</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Run Name"
            value={inputCreate.runTypeId || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, runTypeId: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Run Manager</InputLabel>
            <Select
              value={inputCreate.managerId || ''}
              onChange={(e) => setInputCreate({ ...inputCreate, managerId: e.target.value })}
            >
              {users?.rows.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={inputCreate.dateStart ? inputCreate.dateStart.toISOString().split('T')[0] : ''}
            onChange={(e) => setInputCreate({ ...inputCreate, dateStart: new Date(e.target.value) })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Stop Date"
            type="date"
            value={inputCreate.dateStop ? inputCreate.dateStop.toISOString().split('T')[0] : ''}
            onChange={(e) => setInputCreate({ ...inputCreate, dateStop: new Date(e.target.value) })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Check In At"
            type="time"
            value={inputCreate.checkInAt || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, checkInAt: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Check Out At"
            type="time"
            value={inputCreate.checkOutAt || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, checkOutAt: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Close Advert On"
            type="date"
            value={inputCreate.closeAdvertOn ? inputCreate.closeAdvertOn.toISOString().split('T')[0] : ''}
            onChange={(e) => setInputCreate({ ...inputCreate, closeAdvertOn: new Date(e.target.value) })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateRun} color="primary" disabled={creating}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
