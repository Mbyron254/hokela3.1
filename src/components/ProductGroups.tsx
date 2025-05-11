'use client';

import { FC, useEffect, useState } from 'react';
import {
  M_PRODUCT_GROUPS,
  M_PRODUCT_GROUPS_RECYCLED,
  PRODUCT_GROUP,
  PRODUCT_GROUP_CREATE,
  PRODUCT_GROUP_RECYCLE,
  PRODUCT_GROUP_RESTORE,
  PRODUCT_GROUP_UPDATE,
} from 'src/lib/mutations/product-group.mutation';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { MutationButton } from 'src/components/MutationButton';
import { GQLMutation } from 'src/lib/client';
import { IProductGroupCreate, IProductGroupUpdate } from 'src/lib/interface/product-group.interface';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';

export const ProductGroups: FC<{ clientTier2Id: string }> = ({ clientTier2Id }) => {
  const {
    action: getGroupsActive,
    loading: loadingGroupsActive,
    data: groupsActive,
  } = GQLMutation({
    mutation: M_PRODUCT_GROUPS,
    resolver: 'productGroups',
    toastmsg: false,
  });
  const {
    action: getGroupsRecycled,
    loading: loadingGroupsRecycled,
    data: groupsRecycled,
  } = GQLMutation({
    mutation: M_PRODUCT_GROUPS_RECYCLED,
    resolver: 'productGroupsRecycled',
    toastmsg: false,
  });
  const {
    action: getGroup,
    loading: loadingGroup,
    data: group,
  } = GQLMutation({
    mutation: PRODUCT_GROUP,
    resolver: 'productGroup',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_CREATE,
    resolver: 'productGroupCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_UPDATE,
    resolver: 'productGroupUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_RECYCLE,
    resolver: 'productGroupRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: PRODUCT_GROUP_RESTORE,
    resolver: 'productGroupRestore',
    toastmsg: true,
  });

  const _inputUpdate: IProductGroupUpdate = {
    id: undefined,
    name: undefined,
    description: undefined,
    markup: undefined,
  };
  const [inputCreate, setInputCreate] = useState<IProductGroupCreate>({
    name: undefined,
    description: undefined,
    markup: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

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
      name: 'MARKUP',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.markup,
      cell: (row: any) => `${row.markup} %`,
    },
    {
      name: 'CREATED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
    {
      name: 'EDIT',
      width: '70px',
      sortable: false,
      cell: (row: any) => (
        <button
          type="button"
          className="btn btn-primary btn-sm me-2"
          data-bs-toggle="modal"
          data-bs-target="#update-modal"
          onClick={() => {
            setInputUpdate(_inputUpdate);
            loadGroup(row.id);
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
      name: 'NAME',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'MARKUP',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.markup,
      cell: (row: any) => `${row.markup} %`,
    },
    {
      name: 'CREATED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
    {
      name: 'RECYCLED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.recycled,
      cell: (row: any) => row.recycled,
    },
  ];

  const loadGroupsActive = () => {
    if (clientTier2Id) {
      getGroupsActive({ variables: { input: { clientTier2Id } } });
    }
  };
  const loadGroupsRecycled = () => {
    if (clientTier2Id) {
      getGroupsRecycled({ variables: { input: { clientTier2Id } } });
    }
  };
  const loadGroup = (id: string) => {
    getGroup({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    create({ variables: { input: { ...inputCreate, clientTier2Id } } });
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

  useEffect(() => {
    if (group) {
      setInputUpdate({
        id: group.id,
        name: group.name,
        description: group.description,
        markup: group.markup,
      });
    }
  }, [group]);

  return (
    <div className="row">
      <div className="col-12">
        <ul className="nav nav-tabs nav-bordered mb-2">
          <li className="nav-item">
            <a
              href="#records-active"
              data-bs-toggle="tab"
              aria-expanded="true"
              className="nav-link active"
            >
              <i className="mdi mdi-account-circle d-md-none d-block"/>
              <span className="d-none d-md-block">Active</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#records-recycled" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
              <i className="mdi mdi-settings-outline d-md-none d-block"/>
              <span className="d-none d-md-block">Recycled</span>
            </a>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane show active" id="records-active">
            <div className="btn-group btn-group-sm mb-2">
              <Button variant="outlined" color="success" data-bs-toggle="modal" data-bs-target="#create-modal">
                <i className="mdi mdi-plus me-1"/>New
              </Button>
              <Button variant="outlined" color="error" onClick={handleRecycle} disabled={recycling}>
                <i className="mdi mdi-trash-can-outline me-1"/>Recycle
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
                  {groupsActive?.rows.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{row.index}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{`${row.markup} %`}</TableCell>
                      <TableCell>{row.created}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setInputUpdate(_inputUpdate);
                            loadGroup(row.id);
                          }}
                        >
                          <i className="mdi mdi-pen"/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="tab-pane" id="records-recycled">
            <div className="btn-group btn-group-sm mb-2">
              <Button variant="outlined" color="warning" onClick={handleRestore} disabled={restoring}>
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
                  {groupsRecycled?.rows.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{row.index}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{`${row.markup} %`}</TableCell>
                      <TableCell>{row.created}</TableCell>
                      <TableCell>{row.recycled}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        <div
          id="create-modal"
          className="modal fade"
          role="dialog"
          aria-labelledby="create-client"
          aria-hidden="true"
          tabIndex={-1}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="create-client">
                  New Group
                </h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={inputCreate.name}
                        onChange={(e) =>
                          setInputCreate({
                            ...inputCreate,
                            name: e.target.value,
                          })
                        }
                      />
                      <p>Group Name</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        className="form-control"
                        id="markup"
                        value={inputCreate.markup}
                        onChange={(e) =>
                          setInputCreate({
                            ...inputCreate,
                            markup: parseInt(e.target.value,10),
                          })
                        }
                      />
                      <p>Markup (%)</p>
                    </div>
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    value={inputCreate.description}
                    onChange={(e) =>
                      setInputCreate({
                        ...inputCreate,
                        description: e.target.value,
                      })
                    }
                  />
                  <p>Description</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">
                  Close
                </button>
                <MutationButton
                  type="button"
                  className="btn btn-primary"
                  size="sm"
                  label="Create"
                  icon="mdi mdi-plus"
                  loading={creating}
                  onClick={handleCreate}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          id="update-modal"
          className="modal fade"
          role="dialog"
          aria-labelledby="update-group"
          aria-hidden="true"
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            {loadingGroup ? (
              <LoadingDiv />
            ) : (
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="update-role">
                    Edit Group
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                  />
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={inputUpdate.name}
                          onChange={(e) =>
                            setInputUpdate({
                              ...inputUpdate,
                              name: e.target.value,
                            })
                          }
                        />
                        <p>Group Name</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          className="form-control"
                          id="markup"
                          value={inputUpdate.markup}
                          onChange={(e) =>
                            setInputUpdate({
                              ...inputUpdate,
                              markup: parseInt(e.target.value,10),
                            })
                          }
                        />
                        <p>Markup (%)</p>
                      </div>
                    </div>
                  </div>
                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="description"
                      rows={3}
                      value={inputUpdate.description}
                      onChange={(e) =>
                        setInputUpdate({
                          ...inputUpdate,
                          description: e.target.value,
                        })
                      }
                    />
                    <p>Description</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">
                    Close
                  </button>
                  <MutationButton
                    type="button"
                    className="btn btn-primary"
                    size="sm"
                    label="Update"
                    icon="mdi mdi-refresh"
                    loading={updating}
                    onClick={handleUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
