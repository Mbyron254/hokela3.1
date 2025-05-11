'use client'

import { FC, useEffect, useState } from 'react';

import {
  POINT,
  POINT_CREATE,
  POINT_RECYCLE,
  POINT_RESTORE,
  POINT_UPDATE,
  POINTS,
  POINTS_RECYCLED,
} from 'src/lib/mutations/point.mutation';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Q_SHOP_CATEGORIES_MINI } from 'src/lib/queries/shop-category.query';
import { Q_SHOP_SECTORS_MINI } from 'src/lib/queries/shop-sector.query';
import { M_SHOPS_MINI } from 'src/lib/mutations/shop.mutation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { IPoint, IPointCreate, IPointUpdate } from 'src/lib/interface/point.interface';
import { LoadingDiv } from '../LoadingDiv';
import { MutationButton } from '../MutationButton';
import { GoogleMapPoint } from '../GoogleMapPoint';

export const RoutePoint: FC<{
  runId: string;
}> = ({ runId }) => {
  const { data: sectors } = GQLQuery({
    query: Q_SHOP_SECTORS_MINI,
    queryAction: 'shopSectors',
    variables: { input: {} },
  });
  const { data: categories } = GQLQuery({
    query: Q_SHOP_CATEGORIES_MINI,
    queryAction: 'shopCategories',
    variables: { input: {} },
  });
  const { action: getShops, data: shops } = GQLMutation({
    mutation: M_SHOPS_MINI,
    resolver: 'm_shops',
    toastmsg: false,
  });
  const {
    action: getPoints,
    loading: loadingPoints,
    data: points,
  } = GQLMutation({
    mutation: POINTS,
    resolver: 'points',
    toastmsg: false,
  });
  const {
    action: getPointsRecycled,
    loading: loadingPointsRecycled,
    data: pointsRecycled,
  } = GQLMutation({
    mutation: POINTS_RECYCLED,
    resolver: 'pointsRecycled',
    toastmsg: false,
  });
  const {
    action: getPoint,
    loading: loadingPoint,
    data: point,
  } = GQLMutation({
    mutation: POINT,
    resolver: 'point',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: POINT_CREATE,
    resolver: 'pointCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: POINT_UPDATE,
    resolver: 'pointUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: POINT_RECYCLE,
    resolver: 'pointRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: POINT_RESTORE,
    resolver: 'pointRestore',
    toastmsg: true,
  });

  const _inputInit: IPointUpdate = {
    id: undefined,
    shopId: undefined,
    newShop: undefined,
  };
  const [input, setInput] = useState<IPointCreate>({
    shopId: undefined,
    newShop: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputInit);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);

  const [locations, setLocations] = useState<IPoint[]>([]);

  const loadPoints = () => {
    if (runId) getPoints({ variables: { input: { runId } } });
  };
  const loadPoint = (id: string) => {
    getPoint({ variables: { input: { id } } });
  };
  const loadPointsRecycled = () => {
    if (runId) getPointsRecycled({ variables: { input: { runId } } });
  };
  const handleCreate = () => {
    if (runId) {
      create({ variables: { input: { ...input, runId } } });
    }
  };
  const handleUpdate = () => {
    if (runId) {
      update({ variables: { input: { ...inputUpdate, runId } } });
    }
  };
  const handleRecycle = () => {
    if (selected.length) recycle({ variables: { input: { ids: selected } } });
  };
  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  const columns = [
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
      selector: (row: any) => row.shop?.name,
      cell: (row: any) => row.shop?.name,
    },
    {
      name: 'SECTOR',
      sortable: true,
      wrap: true,
      grow: 1,
      selector: (row: any) => row.shop?.sector?.name,
      cell: (row: any) => row.shop?.sector?.name,
    },
    {
      name: 'CATEGORY',
      sortable: true,
      wrap: true,
      grow: 1,
      selector: (row: any) => row.shop?.category?.name,
      cell: (row: any) => row.shop?.category?.name,
    },
    {
      name: 'APPROVAL',
      width: '115px',
      sortable: true,
      selector: (row: any) => row.shop?.approved,
      cell: (row: any) => (
          <i
            className={`mdi mdi-check-decagram text-${
              row.shop?.approved ? 'success' : 'danger'
            } font-16`}
          />
        ),
    },
    {
      name: 'MORE',
      width: '100px',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
          <button
            type="button"
            className="btn btn-light btn-sm me-2"
            data-bs-toggle="modal"
            data-bs-target="#update-point-modal"
            onClick={() => {
              setInputUpdate(_inputInit);
              loadPoint(row.id);
            }}
          >
            <i className="mdi mdi-circle-edit-outline"/>
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
      selector: (row: any) => row.shop?.name,
      cell: (row: any) => row.shop?.name,
    },
    {
      name: 'SECTOR',
      sortable: true,
      wrap: true,
      grow: 1,
      selector: (row: any) => row.shop?.sector?.name,
      cell: (row: any) => row.shop?.sector?.name,
    },
    {
      name: 'CATEGORY',
      sortable: true,
      wrap: true,
      grow: 1,
      selector: (row: any) => row.shop?.category?.name,
      cell: (row: any) => row.shop?.category?.name,
    },
    {
      name: 'APPROVAL',
      width: '115px',
      sortable: true,
      selector: (row: any) => row.shop?.approved,
      cell: (row: any) => (
          <i
            className={`mdi mdi-check-decagram text-${
              row.shop?.approved ? 'success' : 'danger'
            } font-16`}
          />
        ),
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
    getShops({ variables: { input: {} } });
  }, [getShops]);
  useEffect(() => {
    if (point) setInputUpdate({ id: point.id, shopId: point.shop?.id });
  }, [point]);
  useEffect(() => {
    if (points) {
      points.rows.forEach((_point: any) => {
        setLocations((curr) => [...curr, { lat: _point.shop.lat, lng: _point.shop.lng }]);
      });
    }
  }, [points]);

  const renderTable = (data: any[], _columns: any[], handleRowClick: (id: string) => void) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {_columns.map((column, index) => (
              <TableCell key={index}>{column.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} onClick={() => handleRowClick(row.id)}>
              {_columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{column.cell(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <div className="row">
        <div className="col-sm-3 mb-2 mb-sm-0">
          <div
            className="nav flex-column nav-pills"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <Button variant="contained" color="primary" data-bs-toggle="modal" data-bs-target="#create-shop-modal">
              New Shop
            </Button>
            <Button variant="outlined" color="primary" className="mt-3" data-bs-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">
              Table
            </Button>
            <Button variant="outlined" color="primary" className="mt-3" data-bs-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">
              Map
            </Button>
          </div>
        </div>

        <div className="col-sm-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div
              className="tab-pane fade active show"
              id="v-pills-home"
              role="tabpanel"
              aria-labelledby="v-pills-home-tab"
            >
              <div className="btn-group mb-2">
                <Button variant="outlined" color="secondary" onClick={handleRecycle} disabled={recycling}>
                  Recycle
                </Button>
              </div>

              {renderTable(points?.rows || [], columns, loadPoint)}

              <div className="btn-group mb-2 mt-3">
                <Button variant="outlined" color="secondary" onClick={handleRestore} disabled={restoring}>
                  Restore
                </Button>
              </div>

              {renderTable(pointsRecycled?.rows || [], columnsRecycled, loadPoint)}
            </div>

            <div
              className="tab-pane fade"
              id="v-pills-profile"
              role="tabpanel"
              aria-labelledby="v-pills-profile-tab"
            >
              <div className="card">
                <div className="card-body p-2">
                  <GoogleMapPoint locations={locations} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="create-shop-modal"
        className="modal fade"
        role="dialog"
        aria-labelledby="create-shop"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="create-shop">
                New Shop
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <p className="form-label">Shop</p>
                    <div className="input-group">
                      <select
                        id="shop"
                        className="form-select"
                        aria-label="Shop"
                        value={input.shopId}
                        onChange={(e) =>
                          setInput({
                            ...input,
                            shopId: e.target.value === '' ? undefined : e.target.value,
                            newShop: undefined,
                          })
                        }
                      >
                        <option value="">Select Shop</option>
                        {shops?.rows.map((shop: any, index: number) => (
                          <option value={shop.id} key={`shop-${index}`}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                      <a
                        className="btn btn-outline-secondary"
                        data-bs-toggle="collapse"
                        href="#collapseNewShop"
                        aria-expanded="false"
                        aria-controls="collapseNewShop"
                        onChange={() => setInput({ ...input, shopId: undefined })}
                      >
                        New Shop
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="collapse" id="collapseNewShop">
                    <div className="card border border-secondary">
                      <div className="card-body">
                        <h5 className="card-title">New Shop</h5>

                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={input.newShop?.name}
                                onChange={(e) =>
                                  setInput({
                                    ...input,
                                    newShop: {
                                      ...input.newShop,
                                      name: e.target.value,
                                    },
                                  })
                                }
                              />
                              <p>Name</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-floating mb-3">
                              <select
                                id="sector"
                                className="form-select"
                                value={input.newShop?.shopSectorId}
                                onChange={(e) =>
                                  setInput({
                                    ...input,
                                    newShop: {
                                      ...input.newShop,
                                      shopSectorId: e.target.value === '' ? undefined : e.target.value,
                                    },
                                  })
                                }
                              >
                                <option value="">Select Sector</option>
                                {sectors?.rows.map((sector: any, index: number) => (
                                  <option value={sector.id} key={`sector-${index}`}>
                                    {sector.name}
                                  </option>
                                ))}
                              </select>
                              <p>Sector</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-floating mb-3">
                              <select
                                id="category"
                                className="form-select"
                                value={input.newShop?.shopCategoryId}
                                onChange={(e) =>
                                  setInput({
                                    ...input,
                                    newShop: {
                                      ...input.newShop,
                                      shopCategoryId: e.target.value === '' ? undefined : e.target.value,
                                    },
                                  })
                                }
                              >
                                <option value="">Select Category</option>
                                {categories?.rows.map((category: any, index: number) => (
                                  <option value={category.id} key={`category-${index}`}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                              <p>Category</p>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="lat"
                                value={input.newShop?.lat}
                                onChange={(e) =>
                                  setInput({
                                    ...input,
                                    newShop: {
                                      ...input.newShop,
                                      lat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                                    },
                                  })
                                }
                              />
                              <p>Latitude</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="lng"
                                value={input.newShop?.lng}
                                onChange={(e) =>
                                  setInput({
                                    ...input,
                                    newShop: {
                                      ...input.newShop,
                                      lng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                                    },
                                  })
                                }
                              />
                              <p>Longitude</p>
                            </div>
                          </div>
                        </div>

                        <a
                          className="btn btn-outline-danger btn-sm float-end"
                          data-bs-toggle="collapse"
                          href="#collapseNewShop"
                          aria-expanded="false"
                          aria-controls="collapseNewShop"
                          onClick={() => setInput({ ...input, newShop: undefined })}
                        >
                          Cancel Shop Creation
                        </a>
                      </div>
                    </div>
                  </div>
                  <MutationButton
                    type="button"
                    icon="mdi mdi-plus-thick"
                    className="btn btn-success float-end"
                    size="sm"
                    label="Save"
                    loading={creating}
                    onClick={handleCreate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="update-point-modal"
        className="modal fade"
        role="dialog"
        aria-labelledby="update-point"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          {loadingPoint ? (
            <LoadingDiv />
          ) : (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="update-point">
                  Edit Point
                </h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
              </div>
              <div className="modal-body">
                <div className="col-md-12">
                  <div className="mb-3">
                    <p className="form-label">Shop</p>
                    <div className="input-group">
                      <select
                        id="shop"
                        className="form-select"
                        aria-label="Shop"
                        value={inputUpdate.shopId}
                        onChange={(e) => {
                          setInputUpdate({
                            ...inputUpdate,
                            shopId: e.target.value === '' ? undefined : e.target.value,
                            newShop: undefined,
                          });
                        }}
                      >
                        <option value="">Select Shop</option>
                        {shops?.rows.map((shop: any, index: number) => (
                          <option value={shop.id} key={`shop-${index}`}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                      <a
                        className="btn btn-outline-secondary"
                        data-bs-toggle="collapse"
                        href="#collapseNewShop"
                        aria-expanded="false"
                        aria-controls="collapseNewShop"
                        onClick={() => setInputUpdate({ ...inputUpdate, shopId: undefined })}
                      >
                        New Shop
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="collapse" id="collapseNewShop">
                    <div className="card border border-secondary">
                      <div className="card-body">
                        <h5 className="card-title">New Shop</h5>

                        <div className="row">
                          <div className="col-md-4">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={inputUpdate.newShop?.name}
                                onChange={(e) =>
                                  setInputUpdate({
                                    ...inputUpdate,
                                    newShop: {
                                      ...inputUpdate.newShop,
                                      name: e.target.value,
                                    },
                                  })
                                }
                              />
                              <p>Name</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-floating mb-3">
                              <select
                                id="sector"
                                className="form-select"
                                value={inputUpdate.newShop?.shopSectorId}
                                onChange={(e) =>
                                  setInputUpdate({
                                    ...inputUpdate,
                                    newShop: {
                                      ...inputUpdate.newShop,
                                      shopSectorId: e.target.value === '' ? undefined : e.target.value,
                                    },
                                  })
                                }
                              >
                                <option value="">Select Sector</option>
                                {sectors?.rows.map((sector: any, index: number) => (
                                  <option value={sector.id} key={`sector-${index}`}>
                                    {sector.name}
                                  </option>
                                ))}
                              </select>
                              <p>Sector</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-floating mb-3">
                              <select
                                id="category"
                                className="form-select"
                                value={inputUpdate.newShop?.shopCategoryId}
                                onChange={(e) =>
                                  setInputUpdate({
                                    ...inputUpdate,
                                    newShop: {
                                      ...inputUpdate.newShop,
                                      shopCategoryId: e.target.value === '' ? undefined : e.target.value,
                                    },
                                  })
                                }
                              >
                                <option value="">Select Category</option>
                                {categories?.rows.map((category: any, index: number) => (
                                  <option value={category.id} key={`category-${index}`}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                              <p>Category</p>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="lat"
                                value={inputUpdate.newShop?.lat}
                                onChange={(e) =>
                                  setInputUpdate({
                                    ...inputUpdate,
                                    newShop: {
                                      ...inputUpdate.newShop,
                                      lat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                                    },
                                  })
                                }
                              />
                              <p>Latitude</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="lng"
                                value={inputUpdate.newShop?.lng}
                                onChange={(e) =>
                                  setInputUpdate({
                                    ...inputUpdate,
                                    newShop: {
                                      ...inputUpdate.newShop,
                                      lng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                                    },
                                  })
                                }
                              />
                              <p>Longitude</p>
                            </div>
                          </div>
                        </div>

                        <a
                          className="btn btn-outline-danger btn-sm float-end"
                          data-bs-toggle="collapse"
                          href="#collapseNewShop"
                          aria-expanded="false"
                          aria-controls="collapseNewShop"
                          onClick={() => setInputUpdate({ ...inputUpdate, newShop: undefined })}
                        >
                          Cancel Shop Creation
                        </a>
                      </div>
                    </div>
                  </div>
                  <MutationButton
                    type="button"
                    icon="mdi mdi-refresh"
                    className="btn btn-primary"
                    size="sm"
                    label="Update"
                    loading={updating}
                    onClick={handleUpdate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
