'use client';

import { FC, useState } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { IPackagingCreate } from 'src/lib/interface/product.interface';
import {
  PACKAGING_CREATE,
  PACKAGING_RECYCLE,
  PACKAGING_RESTORE,
  PACKAGINGS,
  PACKAGINGS_RECYCLED,
} from 'src/lib/mutations/packaging.mutation';
import { Q_UNITS_MINI } from 'src/lib/queries/unit.query';
import { commafy } from 'src/lib/helpers';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
} from '@mui/material';
import { MutationButton } from './MutationButton';
import { LoadingSpan } from './LoadingSpan';

export const Packaging: FC<{ productId?: string }> = ({ productId }) => {
  const { data: units, loading: loadingUnits } = GQLQuery({
    query: Q_UNITS_MINI,
    queryAction: 'units',
    variables: { input: {} },
  });
  const {
    action: getPackagingsActive,
    loading: loadingPackagingsActive,
    data: packagingsActive,
  } = GQLMutation({
    mutation: PACKAGINGS,
    resolver: 'm_packagings',
    toastmsg: false,
  });
  const {
    action: getPackagingsRecycled,
    loading: loadingPackagingsRecycled,
    data: packagingsRecycled,
  } = GQLMutation({
    mutation: PACKAGINGS_RECYCLED,
    resolver: 'packagingsRecycled',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: PACKAGING_CREATE,
    resolver: 'packagingCreate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: PACKAGING_RECYCLE,
    resolver: 'packagingRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: PACKAGING_RESTORE,
    resolver: 'packagingRestore',
    toastmsg: true,
  });

  const [inputCreate, setInputCreate] = useState<IPackagingCreate>({
    unitId: undefined,
    unitQuantity: undefined,
    cost: undefined,
  });
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const loadPackagingsActive = () => {
    if (productId) getPackagingsActive({ variables: { input: { productId } } });
  };
  const loadPackagingsRecycled = () => {
    if (productId) getPackagingsRecycled({ variables: { input: { productId } } });
  };
  const handleCreate = () => {
    if (productId) {
      create({ variables: { input: { ...inputCreate, productId } } });
    }
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

  const columnsActive = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'UNIT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.unit.name,
      cell: (row: any) => row.unit.name,
    },
    {
      name: 'UNIT QUANTITY',
      sortable: true,
      right: true,
      selector: (row: any) => row.unitQuantity,
      cell: (row: any) => row.unitQuantity,
    },
    {
      name: 'UNIT COST',
      sortable: true,
      right: true,
      selector: (row: any) => row.cost,
      cell: (row: any) => row.cost,
    },
    {
      name: 'MARKUP',
      sortable: true,
      right: true,
      selector: (row: any) => row.product.group?.markup,
      cell: (row: any) => `${row.product.group?.markup}%`,
    },

    {
      name: 'UNIT PRICE',
      sortable: true,
      right: true,
      selector: (row: any) => row.sellingPrice,
      cell: (row: any) => commafy(row.sellingPrice.toFixed(2)),
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
      name: 'UNIT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.unit.name,
      cell: (row: any) => row.unit.name,
    },
    {
      name: 'UNIT QUANTITY',
      sortable: true,
      right: true,
      selector: (row: any) => row.unitQuantity,
      cell: (row: any) => row.unitQuantity,
    },
    {
      name: 'UNIT COST',
      sortable: true,
      right: true,
      selector: (row: any) => row.cost,
      cell: (row: any) => row.cost,
    },
  ];

  return (
    <Dialog
      open
      onClose={() => {}}
      aria-labelledby="packaging-dialog"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="packaging-dialog">Packaging</DialogTitle>
      <DialogContent>
        <div className="card border-secondary border m-0 mb-2">
          <div className="card-body text-muted">
            <div className="row">
              <div className="col-md-3">
                <div className="mb-3">
                  <p>Unit Quantity</p>
                  <input
                    type="number"
                    className="form-control"
                    id="name"
                    value={inputCreate.unitQuantity}
                    onChange={(e) =>
                      setInputCreate({
                        ...inputCreate,
                        unitQuantity: e.target.value === '' ? undefined : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-4">
                {loadingUnits ? (
                  <CircularProgress />
                ) : (
                  <div className="mb-3">
                    <p>Unit of Measure</p>
                    <select
                      id="unit"
                      className="form-select"
                      aria-label="Unit"
                      value={inputCreate.unitId}
                      onChange={(e) =>
                        setInputCreate({
                          ...inputCreate,
                          unitId: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option/>
                      {units?.rows.map((unit: any, index: number) => (
                        <option value={unit.id} key={`unit-${index}`}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="col-md-5">
                <p>Unit Cost</p>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control me-3"
                    id="cost"
                    value={inputCreate.cost}
                    onChange={(e) =>
                      setInputCreate({
                        ...inputCreate,
                        cost: e.target.value === '' ? undefined : e.target.value,
                      })
                    }
                  />
                  <Button
                    type="button"
                    className="btn btn-success float-end"
                    size="small"
                    onClick={handleCreate}
                    disabled={creating}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={0} aria-label="packaging tabs">
          <Tab label="Active" />
          <Tab label="Recycled" />
        </Tabs>

        <div className="tab-content">
          <div className="tab-pane show active" id="packagings-active">
            <div className="btn-group btn-group-sm mb-2">
              <Button
                type="button"
                variant="outlined"
                color="error"
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
                  {packagingsActive?.rows.map((row: any, index: number) => (
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

          <div className="tab-pane" id="packagings-recycled">
            <div className="btn-group btn-group-sm mb-2">
              <Button
                type="button"
                variant="outlined"
                color="warning"
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
                  {packagingsRecycled?.rows.map((row: any, index: number) => (
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="contained" color="secondary" onClick={() => {}}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
