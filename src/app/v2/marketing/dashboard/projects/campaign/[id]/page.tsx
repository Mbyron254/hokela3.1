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
// import { DropZone } from 'src/components/dropzone/DropZone';
import { SelectMultiple } from 'src/components/SelectMultiple';
import { M_RUN_TYPE_MINI } from 'src/lib/mutations/run-type.mutation';

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

  console.log('session:',session);

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
  // const [inputCreate, setInputCreate] = useState<ICampaignRunCreate>({
  //   projectId: undefined,
  //   campaignId: id,
  //   runTypeId: undefined,
  //   managerId: undefined,
  //   dateStart: undefined,
  //   dateStop: undefined,
  //   checkInAt: undefined,
  //   checkOutAt: undefined,
  //   closeAdvertOn: undefined,
  // });

  const [inputCreate, setInputCreate] = useState<ICampaignRunCreate>({
    managerId: undefined,
    posterId: undefined,
    runTypeIds: [],
    name: undefined,
    dateStart: undefined,
    dateStop: undefined,
    clockType: undefined,
    clockInTime: undefined,
    clockOutTime: undefined,
    locationPingFrequency: undefined,
    closeAdvertOn: undefined,
  });

  const [optionsCreate, setOptionsCreate] = useState<any>([]);
  const [optionsAllCreate, setOptionsAllCreate] = useState<any[]>([]);
  const [optionsSelectedCreate, setOptionsSelectedCreate] = useState<any>([]);

  const [optionsUpdate, setOptionsUpdate] = useState<any>([]);
  const [optionsAllUpdate, setOptionsAllUpdate] = useState<any[]>([]);
  const [optionsSelectedUpdate, setOptionsSelectedUpdate] = useState<any>([]);

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
    action: getRunTypes,
    loading: loadingRunTypes,
    data: runTypes,
  } = GQLMutation({
    mutation: M_RUN_TYPE_MINI,
    resolver: 'm_runTypes',
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
  }, [id, getCampaign, getUsersMini]);


  useEffect(() => {
    if (session?.user?.role?.clientTier1?.id) {
      getUsersMini({
        variables: {
          input: { clientTier1Id: session.user.role.clientTier1.id },
        },
      });
    }
  }, [session?.user?.role?.clientTier1?.id, getUsersMini]);

  useEffect(() => {
    if (id) getRunTypes({ variables: { input: {} } });
  }, [id, getRunTypes]);

  useEffect(() => {
    if (runTypes?.rows) {
      setOptionsCreate(runTypes.rows);
      setOptionsAllCreate(runTypes.rows);
      setOptionsUpdate(runTypes.rows);
      setOptionsAllUpdate(runTypes.rows);
    }
  }, [runTypes]);

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

  const handleCreate = () => {
    const _runTypeIds: string[] = [];

    for (let i = 0; i < optionsSelectedCreate.length; i+=1) {
      _runTypeIds.push(optionsSelectedCreate[i].id);
    }

    if (id) {
      if (_runTypeIds.length > 0) {
        create({ variables: { input: { ...inputCreate, campaignId: id, runTypeIds: _runTypeIds } } });
      } else {
        alert('Please choose at least 1 run activity');
      }
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
            value={inputCreate.name || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, name: e.target.value })}
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
            label="Clock In Time"
            type="time"
            value={inputCreate.clockInTime || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, clockInTime: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Clock Out Time"
            type="time"
            value={inputCreate.clockOutTime || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, clockOutTime: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Clock Type</InputLabel>
            <Select
              value={inputCreate.clockType || ''}
              onChange={(e) => setInputCreate({ ...inputCreate, clockType: e.target.value })}
            >
              <MenuItem value="DYNAMIC">DYNAMIC</MenuItem>
              <MenuItem value="STATIC">STATIC</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Location Ping Frequency"
            type="number"
            value={inputCreate.locationPingFrequency || ''}
            onChange={(e) => setInputCreate({ ...inputCreate, locationPingFrequency: Number(e.target.value) })}
            margin="normal"
          />
          <SelectMultiple
            asset="run activities"
            disable={false}
            checkbox={false}
            disablePreselected={false}
            allOptions={optionsCreate}
            options={optionsCreate}
            setOptions={setOptionsCreate}
            selected={optionsSelectedCreate}
            setSelected={setOptionsSelectedCreate}
          />
          {/* <DropZone
            name="photo (Max of 3, 230px by 230px)"
            classes={`dropzone text-center mt-3`}
            acceptedImageTypes={['.png', '.jpeg', '.jpg', '.webp', '.ico']}
            multiple={true}
            files={documentsCreate}
            setFiles={setDocumentsCreate}
            maxSize={1375000000} // 1GB
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" disabled={creating}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
