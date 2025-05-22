'use client';

import { useEffect, useState } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { IUnitCreate, IUnitUpdate } from 'src/lib/interface/unit.interface';
import {
  UNIT,
  UNIT_CREATE,
  UNIT_RECYCLE,
  UNIT_RESTORE,
  UNIT_UPDATE,
} from 'src/lib/mutations/unit.mutation';
import { Q_UNITS_ACTIVE, Q_UNITS_RECYCLED } from 'src/lib/queries/unit.query';
import { Button, Tab, Tabs, TextField, Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { MutationButton } from 'src/components/MutationButton';

export default function Page() {
  const queryFilters = { page: 0, pageSize: 10 };
  const {
    refetch: refetchUnitsActive,
    data: unitsActive,
    loading: loadingUnitsActive,
  } = GQLQuery({
    query: Q_UNITS_ACTIVE,
    queryAction: 'units',
    variables: { input: queryFilters },
  });
  const {
    refetch: refetchUnitsRecycled,
    data: unitsRecycled,
    loading: loadingUnitsRecycled,
  } = GQLQuery({
    query: Q_UNITS_RECYCLED,
    queryAction: 'unitsRecycled',
    variables: { input: queryFilters },
  });
  const {
    action: getUnit,
    loading: loadingUnit,
    data: unit,
  } = GQLMutation({
    mutation: UNIT,
    resolver: 'm_unit',
    toastmsg: false,
  });
  const { action: create, loading: creating } = GQLMutation({
    mutation: UNIT_CREATE,
    resolver: 'unitCreate',
    toastmsg: true,
  });
  const { action: update, loading: updating } = GQLMutation({
    mutation: UNIT_UPDATE,
    resolver: 'unitUpdate',
    toastmsg: true,
  });
  const { action: recycle, loading: recycling } = GQLMutation({
    mutation: UNIT_RECYCLE,
    resolver: 'unitRecycle',
    toastmsg: true,
  });
  const { action: restore, loading: restoring } = GQLMutation({
    mutation: UNIT_RESTORE,
    resolver: 'unitRestore',
    toastmsg: true,
  });
  const _inputUpdate: IUnitUpdate = {
    id: undefined,
    name: undefined,
    abbreviation: undefined,
  };

  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [inputCreate, setInputCreate] = useState<IUnitCreate>({
    name: undefined,
    abbreviation: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [tabValue, setTabValue] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const columnsActive = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'NAME',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'ABBREVIATION',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.abbreviation,
      cell: (row: any) => row.abbreviation,
    },
    {
      name: 'PACKAGINGS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.packagings?.length,
      cell: (row: any) => row.packagings?.length,
    },
    {
      name: 'CREATED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
    {
      name: 'MORE',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
          <button
            type='button'
            className='btn btn-light btn-sm me-2'
            data-bs-toggle='modal'
            data-bs-target='#update-modal'
            onClick={() => {
              setInputUpdate(_inputUpdate);
              loadUnit(row.id);
            }}
          >
            <i className='mdi mdi-circle-edit-outline'/>
          </button>
        )
      
    },
  ];
  const columnsRecycled = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'NAME',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'ABBREVIATION',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.abbreviation,
      cell: (row: any) => row.abbreviation,
    },
    {
      name: 'PACKAGINGS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.packagings?.length,
      cell: (row: any) => row.packagings?.length,
    },
    {
      name: 'RECYCLED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.recycled,
      cell: (row: any) => row.recycled,
    },
  ];

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
  const loadUnit = (id: string) => {
    getUnit({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (unit) {
      setInputUpdate({
        id: unit.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
      });
    }
  }, [unit]);

  return (
    <>
      <CustomBreadcrumbs
        heading="Units of Measurement"
        links={[
          { name: 'Admin', href: '/admin' },
          { name: 'Units of Measurement' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <div className='row'>
        <div className='col-12'>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="unit tabs">
            <Tab label="Active Records" />
            <Tab label="Recycled Records" />
          </Tabs>

          <div className='tab-content'>
            {tabValue === 0 && (
              <div>
                <div className='btn-group mb-2'>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    New Unit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleRecycle}
                    disabled={recycling}
                  >
                    Recycle
                  </Button>
                </div>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columnsActive.map((column) => (
                          <TableCell key={column.name}>{column.name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {unitsActive?.rows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          {columnsActive.map((column) => (
                            <TableCell key={column.name}>{column.cell(row)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}

            {tabValue === 1 && (
              <div>
                <div className='btn-group mb-2'>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleRestore}
                    disabled={restoring}
                  >
                    Restore
                  </Button>
                </div>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columnsRecycled.map((column) => (
                          <TableCell key={column.name}>{column.name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {unitsRecycled?.rows.map((row: any, index: any) => (
                        <TableRow key={index}>
                          {columnsRecycled.map((column) => (
                            <TableCell key={column.name}>{column.cell(row)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>

          <Modal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            aria-labelledby="create-unit-modal"
          >
            <Box sx={{ ...modalStyle }}>
              <Typography variant="h6" component="h2">
                New Unit
              </Typography>
              <TextField
                label="Unit Name"
                variant="outlined"
                fullWidth
                value={inputCreate.name}
                onChange={(e) =>
                  setInputCreate({
                    ...inputCreate,
                    name: e.target.value,
                  })
                }
              />
              <TextField
                label="Abbreviation"
                variant="outlined"
                fullWidth
                value={inputCreate.abbreviation}
                onChange={(e) =>
                  setInputCreate({
                    ...inputCreate,
                    abbreviation: e.target.value,
                  })
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={creating}
              >
                Create
              </Button>
            </Box>
          </Modal>

          <Modal
            open={updateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            aria-labelledby="update-unit-modal"
          >
            <Box sx={{ ...modalStyle }}>
              {loadingUnit ? (
                <LoadingDiv />
              ) : (
                <>
                  <Typography variant="h6" component="h2">
                    Edit Unit
                  </Typography>
                  <TextField
                    label="Unit Name"
                    variant="outlined"
                    fullWidth
                    value={inputUpdate.name}
                    onChange={(e) =>
                      setInputUpdate({
                        ...inputUpdate,
                        name: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Abbreviation"
                    variant="outlined"
                    fullWidth
                    value={inputUpdate.abbreviation}
                    onChange={(e) =>
                      setInputUpdate({
                        ...inputUpdate,
                        abbreviation: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    Update
                  </Button>
                </>
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
