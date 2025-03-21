'use client';

import type { IDatePickerControl } from 'src/types/common';
import type { IProject } from 'src/lib/interface/project.interface';

import dayjs from 'dayjs';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { MobileDatePicker } from '@mui/x-date-pickers';
import {
  Grid,
  Dialog,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// import { ProjectTableToolbar } from '../project-table-toolbar';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { ICampaignCreate } from 'src/lib/interface/campaign.interface';
import {
  M_CAMPAIGNS_ACTIVE,
  CAMPAIGN_CREATE,
  CAMPAIGN_UPDATE
} from 'src/lib/mutations/campaign.mutation';
import { Q_PROJECTS_ACTIVE } from 'src/lib/queries/project.query';
import { 
  PROJECT,
  PROJECT_CREATE, 
  PROJECT_UPDATE
} from 'src/lib/mutations/project.mutation';
import { IProjectCreate } from 'src/lib/interface/project.interface';
import { Q_CLIENTS_T2_MINI } from 'src/lib/queries/client-t2.query';
import { M_USERS_MINI } from 'src/lib/mutations/user.mutation';
import { ProjectTableRow } from '../project-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'recycled', label: 'Recycled' }
];

const TABLE_HEAD = [
  { id: 'name', label: 'Project Name' },
  { id: 'clientTier2', label: 'Client' },
  { id: 'manager', label: 'Manager' },
  { id: 'dateStart', label: 'Start Date', width: 120 },
  { id: 'dateStop', label: 'End Date', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

type IProjectTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IProject[];
  filters: IProjectTableFilters;
  comparator: (a: any, b: any) => number;
};

// ----------------------------------------------------------------------

export function ProjectListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const confirm = useBoolean();

  const dialog = useBoolean();

  const isEdit = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [value, setValue] = useState<IDatePickerControl>(dayjs(new Date()));

  const [formData, setFormData] = useState<ICampaignCreate>({
    name: '',
    jobDescription: '',
    jobQualification: '',
    clientTier2Id: '',
  });

  const filters = useSetState<IProjectTableFilters>({
    name: '',
    status: 'active',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const { data: t2Clients } = GQLQuery({
    query: Q_CLIENTS_T2_MINI,
    queryAction: 'tier2Clients',
    variables: { input: {} },
  });

  const { action: getUsersMini, data: users } = GQLMutation({
    mutation: M_USERS_MINI,
    resolver: 'm_usersActive',
    toastmsg: false,
  });
  
  const {
    refetch: refetchProjectsActive,
    data: projectsActive,
    loading: loadingProjectsActive,
  } = GQLQuery({
    query: Q_PROJECTS_ACTIVE,
    queryAction: 'projects',
    variables: { input: { page: 0, pageSize: 10 } },
  });

  const dataFiltered = applyFilter({
    inputData: projectsActive?.rows || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleNewRow = useCallback(
    () => {
      // isEdit.onFalse();
      dialog.onTrue();

      // router.push(paths.dashboard.product.edit(id));
    },
    // eslint-disable-next-line
    []
  );
  const handleEditRow = (id: string) => {
    console.log(id, 'IDENTIFICATION');

    isEdit.onTrue();
    dialog.onTrue();
  };

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.v2.marketing.projects.details(id));
    },
    // eslint-disable-next-line
    []
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const {
    action: getCampaignsActive,
    data: campaignsActive,
    loading: loadingCampaignsActive,
  } = GQLMutation({
    mutation: M_CAMPAIGNS_ACTIVE,
    resolver: 'm_campaigns',
    toastmsg: false,
  });

  const {
    action: create,
    loading: creating,
  } = GQLMutation({
    mutation: CAMPAIGN_CREATE,
    resolver: 'campaignCreate',
    toastmsg: true,
  });

  const {
    action: update,
    loading: updating,
  } = GQLMutation({
    mutation: CAMPAIGN_UPDATE,
    resolver: 'campaignUpdate',
    toastmsg: true,
  });

  const handleSubmit = () => {
    if (isEdit.value) {
      update({
        variables: {
          input: {
            // id: formData.id,
            name: formData.name,
            jobDescription: formData.jobDescription,
            jobQualification: formData.jobQualification,
          },
        },
      });
    } else {
      create({
        variables: {
          input: formData,
        },
      });
    }
    handleDialogClose();
  };
  const handleDialogClose = () => {
    setFormData({ name: '', jobDescription: '', jobQualification: '', clientTier2Id: '' });
    dialog.onFalse();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getCampaignsActive({ variables: { input: { page: table.page, pageSize: table.rowsPerPage } } });
  }, [table.page, table.rowsPerPage, getCampaignsActive]);

  // Add new state for project data
  const [projectData, setProjectData] = useState<IProjectCreate>({
    name: '',
    clientTier2Id: undefined,
    managerId: undefined,
    dateStart: undefined,
    dateStop: undefined,
    description: undefined
  });

  // Add GraphQL queries/mutations
  const {
    action: getProject,
    data: project,
    loading: loadingProject 
  } = GQLMutation({
    mutation: PROJECT,
    resolver: 'project',
    toastmsg: false
  });

  const {
    action: createProject,
    loading: creatingProject
  } = GQLMutation({
    mutation: PROJECT_CREATE,
    resolver: 'projectCreate',
    toastmsg: true
  });

  const {
    action: updateProject,
    loading: updatingProject
  } = GQLMutation({
    mutation: PROJECT_UPDATE,
    resolver: 'projectUpdate', 
    toastmsg: true
  });

  // Add handlers
  const handleCreateProject = () => {
    createProject({
      variables: {
        input: projectData
      }
    });
    handleDialogClose();
  };

  const handleUpdateProject = () => {
    updateProject({
      variables: {
        input: {
          projectData
        }
      }
    });
    handleDialogClose(); 
  };

  const handleLoadProject = (id: string) => {
    getProject({
      variables: {
        input: { id }
      }
    });
  };

  // Update useEffect to set table data when projects are loaded
  useEffect(() => {
    if (projectsActive?.rows) {
      console.log('Fetched projects:', projectsActive.rows);
      setTableData(projectsActive.rows);
    }
  }, [projectsActive]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Projects"
          links={[
            { name: 'Dashboard', href: paths.v2.marketing.root },
            { name: 'Campaigns', href: paths.v2.marketing.projects.list },
            { name: 'List' },
          ]}
          action={
            <Button
              // component={RouterLink}
              // href={paths.v2.marketing.clients.new}
              onClick={() => {
                handleNewRow();
                isEdit.onFalse();
              }}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Campaign
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      (tab.value === filters.state.status && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'recycled' && 'error') ||
                      'default'
                    }
                  >
                    {projectsActive?.count || 0}
                  </Label>
                }
              />
            ))}
          </Tabs>

          {/* <ProjectTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          /> */}

          {/* {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="md">
              <DialogTitle>
                {isEdit.value ? 'Edit Project' : 'New Project'}
              </DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="name"
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  sx={{ mb: 2 }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      fullWidth
                      options={t2Clients?.rows || []}
                      getOptionLabel={(option: any) => option.name}
                      value={t2Clients?.rows?.find((c: any) => c.id === projectData.clientTier2Id) || null}
                      onChange={(_, newValue) => {
                        setProjectData({
                          ...projectData,
                          clientTier2Id: newValue?.id
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Client" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      fullWidth 
                      options={users?.rows || []}
                      getOptionLabel={(option: any) => option.name}
                      value={users?.rows?.find((u: any) => u.id === projectData.managerId) || null}
                      onChange={(_, newValue) => {
                        setProjectData({
                          ...projectData,
                          managerId: newValue?.id
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Manager" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <MobileDatePicker
                      label="Start Date"
                      value={projectData.dateStart ? dayjs(projectData.dateStart) : null}
                      onChange={(date) => setProjectData({...projectData, dateStart: date?.toDate()})}
                    />
                  </Grid>

                  <Grid item xs={6}>  
                    <MobileDatePicker
                      label="End Date"
                      value={projectData.dateStop ? dayjs(projectData.dateStop) : null}
                      onChange={(date) => setProjectData({...projectData, dateStop: date?.toDate()})}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  sx={{ mt: 2 }}
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button 
                  variant="contained"
                  onClick={isEdit.value ? handleUpdateProject : handleCreateProject}
                  disabled={creatingProject || updatingProject}
                >
                  {isEdit.value ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Dialog>
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ProjectTableRow
                        key={row.id}
                        row={{
                          id: row.id,
                          name: row.name,
                          client: row.clientTier2?.name,
                          manager: row.manager?.name,
                          dateStart: row.dateStart,
                          dateStop: row.dateStop,
                        }}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => {}}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData.filter(
  //     (project) =>
  //       project.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
  //       project.clientTier2?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
  //       project.manager?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  if (status !== 'all') {
    inputData = inputData.filter((project) => project.status === status);
  }

  return inputData;
}
