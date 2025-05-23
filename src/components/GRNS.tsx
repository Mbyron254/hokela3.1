'use client';

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import {
  GRN,
  GRNCreate,
  GRNRecycle,
  GRNRestore,
  GRNs,
  GRNs_RECYCLED,
  GRNUpdate,
} from 'src/lib/mutations/grn.mutation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab } from '@mui/material';
import { InputGRNCreate, InputGRNUpdate } from 'src/lib/interface/grns.interface';
import { LoadingDiv } from './LoadingDiv';
import { MutationButton } from './MutationButton';

export const GRNS: FC<{ clientTier2Id: string }> = ({ clientTier2Id }) => {
  const {
    action: getGrnsActive,
    loading: loadingGrnsActive,
    data: grnsActive,
  } = GQLMutation({
    mutation: GRNs,
    resolver: 'GRNs',
  });
  const {
    action: getGrnsRecycled,
    loading: loadingGrnsRecycled,
    data: grnsRecycled,
  } = GQLMutation({
    mutation: GRNs_RECYCLED,
    resolver: 'GRNsRecycled',
  });
  const {
    action: getGrn,
    loading: loadingGrn,
    data: grn,
  } = GQLMutation({
    mutation: GRN,
    resolver: 'GRN',
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: GRNCreate,
    resolver: 'GRNCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: GRNUpdate,
    resolver: 'GRNUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: GRNRecycle,
    resolver: 'GRNRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: GRNRestore,
    resolver: 'GRNRestore',
    toastmsg: true,
  });

  const init: InputGRNUpdate = {
    id: undefined,
    supplierRefNo: undefined,
    notes: undefined,
  };

  const [inputCreate, setInputCreate] = useState<InputGRNCreate>({
    supplierRefNo: undefined,
    notes: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(init);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const loadGrnsActive = (page?: number, pageSize?: number) => {
    if (clientTier2Id) {
      getGrnsActive({ variables: { input: { clientTier2Id, pageSize, page } } });
    }
  };
  const loadGrnsRecycled = (page?: number, pageSize?: number) => {
    if (clientTier2Id) {
      getGrnsRecycled({ variables: { input: { clientTier2Id, pageSize, page } } });
    }
  };
  const loadGrn = (id: string) => {
    getGrn({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    if (clientTier2Id) {
      create({ variables: { input: { ...inputCreate, clientTier2Id } } });
    }
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

  const columnsActive = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'SUPPLIER REF',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.supplierRefNo,
      cell: (row: any) => row.supplierRefNo,
    },
    {
      name: 'GRN No',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.grnNo,
      cell: (row: any) => row.grnNo,
    },
    {
      name: 'ITEMS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.inventories?.length,
      cell: (row: any) => row.inventories?.length,
    },
    {
      name: 'CREATED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
    {
      name: 'ACTION',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#edit-grn"
          onClick={() => {
            setInputUpdate(init);
            loadGrn(row.id);
          }}
        >
          <i className="mdi mdi-pen"/>
        </button>
      ),
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
      name: 'SUPPLIER REF',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.supplierRefNo,
      cell: (row: any) => row.supplierRefNo,
    },
    {
      name: 'GRN No',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.grnNo,
      cell: (row: any) => row.grnNo,
    },
    {
      name: 'ITEMS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.inventories?.length,
      cell: (row: any) => row.inventories?.length,
    },
    {
      name: 'RECYCLED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.recycled,
      cell: (row: any) => row.recycled,
    },
  ];

  useEffect(() => {
    if (grn) {
      setInputUpdate({
        id: grn.id,
        supplierRefNo: grn.supplierRefNo,
        notes: grn.notes,
      });
    }
  }, [grn]);

  return (
    <>
      <Tabs value={0} aria-label="GRN Tabs">
        <Tab label="Active" />
        <Tab label="Recycled" />
      </Tabs>

      <div>
        <div>
          <Button variant="outlined" color="success" onClick={() => {}} data-bs-toggle="modal" data-bs-target="#create-grn">
            New
          </Button>
          <Button variant="outlined" color="error" onClick={handleRecycle} disabled={recycling}>
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
              {grnsActive?.rows.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.index}</TableCell>
                  <TableCell>{row.supplierRefNo}</TableCell>
                  <TableCell>{row.grnNo}</TableCell>
                  <TableCell>{row.inventories?.length}</TableCell>
                  <TableCell>{row.created}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setInputUpdate(init);
                        loadGrn(row.id);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div>
        <Button variant="outlined" color="warning" onClick={handleRestore} disabled={restoring}>
          Restore
        </Button>

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
              {grnsRecycled?.rows.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.index}</TableCell>
                  <TableCell>{row.supplierRefNo}</TableCell>
                  <TableCell>{row.grnNo}</TableCell>
                  <TableCell>{row.inventories?.length}</TableCell>
                  <TableCell>{row.recycled}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* =================== Modal Create =================== */}
      <div
        tabIndex={-1}
        id="create-grn"
        className="modal fade"
        role="dialog"
        aria-labelledby="standard-modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="standard-modalLabel">
                New GRN
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <p className="form-label">Supplier Ref (Invoice No, Delivery Note No, etc)</p>
                <input
                  type="text"
                  id="supplierRefNo"
                  className="form-control"
                  defaultValue={inputCreate.supplierRefNo}
                  onChange={(e) =>
                    setInputCreate({
                      ...inputCreate,
                      supplierRefNo: e.target.value === '' ? undefined : e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <p>Notes</p>
                <textarea
                  className="form-control"
                  placeholder="Notes"
                  rows={3}
                  defaultValue={inputCreate.notes}
                  onChange={(e) => setInputCreate({ ...inputCreate, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Close
              </button>
              <MutationButton
                className="btn-sm float-end"
                type="button"
                size="md"
                label="Create"
                icon="mdi mdi-content-save"
                loading={creating}
                onClick={handleCreate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================== Modal Update =================== */}
      <div
        tabIndex={-1}
        id="edit-grn"
        className="modal fade"
        role="dialog"
        aria-labelledby="standard-modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="standard-modalLabel">
                Edit GRN
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              {loadingGrn ? (
                <LoadingDiv />
              ) : (
                <>
                  <div className="mb-3">
                    <p className="form-label">Supplier Ref (Invoice No, Delivery Note No, etc)</p>
                    <input
                      type="text"
                      id="supplierRefNo"
                      className="form-control"
                      defaultValue={inputUpdate.supplierRefNo}
                      onChange={(e) =>
                        setInputUpdate({
                          ...inputUpdate,
                          supplierRefNo: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="">
                    <p>Notes</p>
                    <textarea
                      className="form-control"
                      placeholder="Notes"
                      rows={3}
                      defaultValue={inputUpdate.notes}
                      onChange={(e) =>
                        setInputUpdate({
                          ...inputUpdate,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Close
              </button>
              {!loadingGrn && (
                <MutationButton
                  className="btn-sm float-end"
                  type="button"
                  size="md"
                  label="Update"
                  icon="mdi mdi-content-save"
                  loading={updating}
                  onClick={handleUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
