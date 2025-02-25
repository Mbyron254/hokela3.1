'use client';

import type { IDatePickerControl } from 'src/types/common';
import type { TProject, IProjectItem, TClientTier2, IOrderTableFilters } from 'src/types/project';

import dayjs from 'dayjs';
import { useState, useEffect, useCallback } from 'react';

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

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { STATUS_OPTION } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { GQLQuery, GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { M_USERS_MINI } from 'src/lib/mutations/user.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { Q_CLIENTS_T2_MINI } from 'src/lib/queries/client-t2.query';
import { Q_PROJECTS_ACTIVE, Q_PROJECTS_RECYCLED } from 'src/lib/queries/project.query';
import { PROJECT_CREATE, PROJECT_UPDATE } from 'src/lib/mutations/project.mutation';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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

import { OrderTableRow } from '../project-table-row';
// import { ProjectTableToolbar } from '../project-table-toolbar';
import { OrderTableFiltersResult } from '../project-table-filters-result';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...STATUS_OPTION];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'client', label: 'Client', align: 'center' },
  {
    id: 'campaigns',
    label: 'Campaigns',
    align: 'center',
  },
  { id: 'startDate', label: 'Start Date' },

  { id: 'endDate', label: 'End Date' },
  { id: 'runs', label: 'Runs' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function ProjectListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const confirm = useBoolean();

  const dialog = useBoolean();

  const isEdit = useBoolean();

  const usersQueryFilters = { page: 0, pageSize: 10 };

  const [tableData, setTableData] = useState<IProjectItem[]>([]);

  const [clients, setClients] = useState<TClientTier2[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);

  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  // const [value, setValue] = useState<IDatePickerControl>(dayjs());

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: dayjs(),
    endDate: dayjs(),
    manager: '',
    description: '',
  });

  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });

  const {
    refetch: refetchProjectsActive,
    data: projectsActive,
    loading: loadingProjectsActive,
  } = GQLQuery({
    query: Q_PROJECTS_ACTIVE,
    queryAction: 'projects',
    variables: { input: usersQueryFilters },
  });

  const {
    refetch: refetchProjectsRecycled,
    data: projectsRecycled,
    loading: loadingProjectsRecycled,
  } = GQLQuery({
    query: Q_PROJECTS_RECYCLED,
    queryAction: 'projectsRecycled',
    variables: { input: usersQueryFilters },
  });

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
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: PROJECT_CREATE,
    resolver: 'projectCreate',
    toastmsg: true,
  });

  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: PROJECT_UPDATE,
    resolver: 'projectUpdate',
    toastmsg: true,
  });

  const loadUsersMini = () => {
    if (session?.user?.role?.clientTier1?.id) {
      getUsersMini({
        variables: {
          input: { clientTier1Id: session.user.role.clientTier1.id },
        },
      });
    }
  };

  useEffect(
    () => loadUsersMini(),
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.user?.role?.clientTier1?.id]
  );

  useEffect(() => {
    if (projectsActive && projectsRecycled) {
      const activeProjects = transformProjectData(projectsActive?.rows || []);
      const recycledProjects = transformRecycledProjectData(projectsRecycled?.rows || []);

      const clientsTransformed = transformClientData(t2Clients?.rows || []);

      setClients(clientsTransformed);

      const usersDataTransFormed = transformUsersData(users?.rows || []);

      setUsersData(usersDataTransFormed);

      setTableData([...activeProjects, ...recycledProjects]);
    }
  }, [projectsActive, projectsRecycled, t2Clients, users]);

  console.log(projectsActive, 'PROJECTS ACTIVE');

  const filters = useSetState<IOrderTableFilters>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
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
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleEditRow = (id: string) => {
    console.log(id, 'IDENTIFICATION');
    const project = tableData.find((item) => item.id === id);

    console.log(project, 'PROJECT');

    if (project) {
      setEditProjectId(project.id);
      setFormData({
        name: project.name,
        client: project.clientTier2Id,
        startDate: dayjs(project.startDate),
        endDate: dayjs(project.endDate),
        manager: project.managerId, // manager?.id || '',
        description: project.description,
      });
    }

    // setFormData({
    //   name: project.name,
    //   client: client?.id || '',
    //   startDate: project.startDate,
    //   endDate: project.endDate,
    //   manager: manager?.id || '',
    //   description: project.description,
    // });

    isEdit.onTrue();
    dialog.onTrue();
  };
  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(
    () => {
      const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

      toast.success('Delete success!');

      setTableData(deleteRows);

      table.onUpdatePageDeleteRows({
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    },
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    [dataFiltered.length, dataInPage.length, table, tableData]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.v2.marketing.projects.details(id));
    },
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );
  const handleSubmit = () => {
    if (isEdit.value) {
      const inputUpdate = {
        id: editProjectId,
        clientTier2Id: formData.client,
        managerId: formData.manager,
        name: formData.name,
        dateStart: formData.startDate,
        dateStop: formData.endDate,
        description: formData.description,
      };

      update({ variables: { input: inputUpdate } });

      toast.success('Project updated successfully!');
    } else {
      const inputCreate = {
        clientTier2Id: formData.client,
        managerId: formData.manager,
        name: formData.name,
        dateStart: formData.startDate,
        dateStop: formData.endDate,
        description: formData.description,
      };

      create({ variables: { input: inputCreate } });

      toast.success('Project created successfully!');
    }

    handleDialogClose();
  };
  const handleDialogClose = () => {
    setFormData({
      name: '',
      client: '',
      startDate: dayjs(),
      endDate: dayjs(),
      manager: '',
      description: '',
    });
    dialog.onFalse();
  };

  // Add these new handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleClientTypeChange = (_: any, value: any) => {
    setFormData({
      ...formData,
      client: value?.id || '',
    });
  };
  const handleManagerChange = (_: any, value: any) => {
    setFormData({
      ...formData,
      manager: value?.id || '',
    });
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.v2.marketing.root },
            { name: 'Projects', href: paths.v2.marketing.projects.list },
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
              New Project
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
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'suspended' && 'warning') ||
                      (tab.value === 'complete' && 'primary') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
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

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

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
            <Dialog open={dialog.value} onClose={handleDialogClose} fullWidth maxWidth="sm">
              <DialogTitle>{isEdit.value ? 'Edit Project' : 'New Project'}</DialogTitle>

              <DialogContent>
                <TextField
                  autoFocus
                  fullWidth
                  name="name"
                  margin="dense"
                  variant="outlined"
                  label="Project Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />

                <Box sx={{ my: 2 }} />

                <Autocomplete
                  fullWidth
                  options={clients}
                  value={clients.find((client) => client.id === formData.client) || null}
                  getOptionLabel={(option) => option.name}
                  onChange={handleClientTypeChange}
                  renderInput={(params) => <TextField {...params} label="Clients" margin="none" />}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                />
                <Box sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <MobileDatePicker
                      orientation="portrait"
                      label="Start Date"
                      value={formData.startDate}
                      // onChange={(newValue) => {
                      //   setValue(newValue);
                      // }}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MobileDatePicker
                      orientation="portrait"
                      label="End Date"
                      value={formData.endDate}
                      // onChange={(newValue) => {
                      //   setValue(newValue);
                      // }}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ my: 2 }} />
                <Autocomplete
                  fullWidth
                  options={usersData}
                  value={usersData.find((user) => user.id === formData.manager) || null}
                  getOptionLabel={(option) => option.name}
                  onChange={handleManagerChange}
                  renderInput={(params) => <TextField {...params} label="Manager" margin="none" />}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                />

                <Box sx={{ my: 2 }} />
                <TextField
                  variant="outlined"
                  rows={4}
                  fullWidth
                  value={formData.description}
                  onChange={handleInputChange}
                  name="description"
                  multiline
                  label="Descrption"
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={handleDialogClose} variant="outlined" color="inherit">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                  {isEdit.value ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Dialog>
            <Scrollbar>
              <Table>
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
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IProjectItem[];
  filters: IOrderTableFilters;
  comparator: (a: any, b: any) => number;
};

const transformProjectData = (projects: Array<TProject>) => {
  const activeProjects = projects.map((project) => ({
    id: project.id,
    name: project.name,
    client: project.clientTier2.name,
    campaigns: project.campaignRuns.length,
    startDate: project.dateStart,
    endDate: project.dateStop,
    clientTier2Id: project.clientTier2.id,
    managerId: project.manager.id,
    manager: project.manager.name,
    description: project.description,
    status: 'active', // Add status field
  }));
  return activeProjects;
};
const transformRecycledProjectData = (projects: Array<TProject>) => {
  const recycledProjects = projects.map((project) => ({
    id: project.id,
    name: project.name,
    client: project.clientTier2.name,
    campaigns: project.campaignRuns.length,
    startDate: project.dateStart,
    endDate: project.dateStop,
    clientTier2Id: project.clientTier2.id,
    managerId: project.manager.id,
    manager: project.manager.name,
    description: project.description,
    status: 'suspended', // Add status field
  }));
  return recycledProjects;
};

const transformClientData = (clients: Array<TClientTier2>) => {
  const transformedClients = clients.map((client) => ({
    id: client.id,
    name: client.name,
  }));
  return transformedClients;
};

const transformUsersData = (users: Array<any>) => {
  const transformedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
  }));
  return transformedUsers;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const project = comparator(a[0], b[0]);
    if (project !== 0) return project;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (project) =>
        project.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        project.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        project.client.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((project) => project.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((project) => fIsBetween(project.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
