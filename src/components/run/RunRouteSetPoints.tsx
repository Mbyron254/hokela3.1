'use client';

import { GQLQuery, GQLMutation } from 'src/lib/client';
import { IPointUpdate, IPointCreate, IPoint } from 'src/lib/interface/point.interface';
import {
  POINTS,
  POINTS_RECYCLED,
  POINT,
  POINT_CREATE,
  POINT_UPDATE,
  POINT_RECYCLE,
  POINT_RESTORE,
} from 'src/lib/mutations/point.mutation';
import { M_SHOPS_MINI } from 'src/lib/mutations/shop.mutation';
import { Q_SHOP_CATEGORIES_MINI } from 'src/lib/queries/shop-category.query';
import { Q_SHOP_SECTORS_MINI } from 'src/lib/queries/shop-sector.query';
import { FC, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { MutationButton } from '../MutationButton';
import { LoadingDiv } from '../LoadingDiv';
import { GoogleMapPointPick } from '../GoogleMapPointPick';

export const RunRouteSetPoints: FC<{
  run: any;
}> = ({ run }) => {
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
    radius: undefined,
  };

  const [input, setInput] = useState<IPointCreate>({
    shopId: undefined,
    newShop: undefined,
    radius: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputInit);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [marker, setMarker] = useState<IPoint>();
  const [markerUpdate, setMarkerUpdate] = useState<IPoint>();

  const loadPoints = () => {
    if (run.id) {
      getPoints({ variables: { input: { runId: run.id } } });
    }
  };
  const loadPoint = (id: string) => {
    getPoint({ variables: { input: { id } } });
  };
  const loadPointsRecycled = () => {
    if (run.id) {
      getPointsRecycled({ variables: { input: { runId: run.id } } });
    }
  };
  const handleCreate = () => {
    if (run.id) {
      if (input.shopId && !input.newShop) {
        create({ variables: { input: { ...input, runId: run.id } } });
      } else if (input.newShop && !input.shopId) {
        if (marker) {
          create({
            variables: { input: { ...input, runId: run.id, newShop: { ...input.newShop, ...marker } } },
          });
        } else {
          alert('Please select shop location on the map');
        }
      } else {
        alert('Please select a shop from the dropdown list or create a new one');
      }
    }
  };
  const handleUpdate = () => {
    if (run.id) {
      if (inputUpdate.shopId && !inputUpdate.newShop) {
        update({ variables: { input: { ...inputUpdate, runId: run.id } } });
      } else if (inputUpdate.newShop && !inputUpdate.shopId) {
        if (markerUpdate) {
          update({
            variables: {
              input: {
                ...inputUpdate,
                runId: run.id,
                newShop: { ...inputUpdate.newShop, ...markerUpdate },
              },
            },
          });
        } else {
          alert('Please select shop location on the map');
        }
      } else {
        alert('Please select a shop from the dropdown list or create a new one');
      }
    }
  };
  const handleRecycle = () => {
    if (selected.length) {
      recycle({ variables: { input: { ids: selected } } });
    }
  };
  const handleRestore = () => {
    if (selectedRecycled.length) {
      restore({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  useEffect(() => getShops({ variables: { input: {} } }), [getShops]);
  useEffect(() => {
    if (point) {
      setInputUpdate({ id: point.id, shopId: point.shop?.id, radius: point.radius });
    }
  }, [point]);

  return (
    <>
      <ul className="nav nav-tabs nav-bordered mb-2">
        <li className="nav-item">
          <a href="#active-shops" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
            <i className="mdi mdi-account-circle d-md-none d-block"/>
            <span className="d-none d-md-block">Active</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#recycled-shops" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
            <i className="mdi mdi-settings-outline d-md-none d-block"/>
            <span className="d-none d-md-block">Recycled</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="active-shops">
          <div className="btn-group btn-group-sm mb-2">
            <Button variant="outlined" onClick={() => { /* handle new shop creation */ }}>
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
                  <TableCell>#</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>SECTOR</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>RADIUS</TableCell>
                  <TableCell>APPROVAL</TableCell>
                  <TableCell>MORE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {points?.rows.map((row: any, index: number) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.shop?.name}</TableCell>
                    <TableCell>{row.shop?.sector?.name}</TableCell>
                    <TableCell>{row.shop?.category?.name}</TableCell>
                    <TableCell>{`${row.radius} m`}</TableCell>
                    <TableCell>
                      <IconButton>
                        <i className={`mdi mdi-check-decagram text-${row.shop?.approved ? 'success' : 'danger'} font-16`} />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => { setInputUpdate(_inputInit); loadPoint(row.id); }}>
                        Edit
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="tab-pane" id="recycled-shops">
          <div className="btn-group btn-group-sm mb-2">
            <Button variant="outlined" color="warning" onClick={handleRestore} disabled={restoring}>
              Restore
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>SECTOR</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>RADIUS</TableCell>
                  <TableCell>APPROVAL</TableCell>
                  <TableCell>RECYCLED</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointsRecycled?.rows.map((row: any, index: number) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.shop?.name}</TableCell>
                    <TableCell>{row.shop?.sector?.name}</TableCell>
                    <TableCell>{row.shop?.category?.name}</TableCell>
                    <TableCell>{`${row.radius} m`}</TableCell>
                    <TableCell>
                      <IconButton>
                        <i className={`mdi mdi-check-decagram text-${row.shop?.approved ? 'success' : 'danger'} font-16`} />
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.recycled}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
                <div className="col-md-3">
                  <div className="mb-3">
                    <p>Proximity Radius (m)</p>
                    <input
                      id="radius"
                      type="number"
                      className="form-control"
                      defaultValue={input.radius}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          radius: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="mb-3">
                    <p className="form-label">Name</p>
                    <div className="input-group input-group-sm">
                      <select
                        id="name"
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
                        className="btn btn-primary"
                        data-bs-toggle="collapse"
                        href="#collapseNewShop"
                        aria-expanded="false"
                        aria-controls="collapseNewShop"
                        onChange={() => setInput({ ...input, shopId: undefined })}
                      >
                        Create New
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="collapse" id="collapseNewShop">
                    <div className="card border border-primary">
                      <div className="card-body p-2">
                        <h5 className="card-title text-primary">New Point/Shop</h5>

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

                        <GoogleMapPointPick setMarker={setMarker} />

                        <div className="row">
                          <div className="col-md-6 mt-2 mb-1">
                            <strong className="me-1">Latitude:</strong>
                            {marker?.lat}
                          </div>
                          <div className="col-md-6 mt-2 mb-1 ">
                            <strong className="me-1">Longitude:</strong>
                            {marker?.lng}
                          </div>
                        </div>

                        <a
                          className="btn btn-danger btn-sm mt-2"
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
                    label="Submit"
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
                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <p>Proximity Radius (m)</p>
                      <input
                        id="radius"
                        type="number"
                        className="form-control"
                        defaultValue={inputUpdate.radius}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            radius: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="mb-3">
                      <p className="form-label">Name</p>
                      <div className="input-group input-group-sm">
                        <select
                          id="point"
                          className="form-select"
                          aria-label="point"
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
                          className="btn btn-primary"
                          data-bs-toggle="collapse"
                          href="#collapseNewShop"
                          aria-expanded="false"
                          aria-controls="collapseNewShop"
                          onClick={() => setInputUpdate({ ...inputUpdate, shopId: undefined })}
                        >
                          Create New
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="collapse" id="collapseNewShop">
                      <div className="card border border-secondary">
                        <div className="card-body">
                          <h5 className="card-title text-primary">New Point/Shop</h5>

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

                          <GoogleMapPointPick setMarker={setMarkerUpdate} />

                          <div className="row">
                            <div className="col-md-6 mt-2 mb-1">
                              <strong className="me-1">Latitude:</strong>
                              {markerUpdate?.lat}
                            </div>
                            <div className="col-md-6 mt-2 mb-1 ">
                              <strong className="me-1">Longitude:</strong>
                              {markerUpdate?.lng}
                            </div>
                          </div>

                          <a
                            className="btn btn-danger btn-sm float-end"
                            data-bs-toggle="collapse"
                            href="#collapseNewShop"
                            aria-expanded="false"
                            aria-controls="collapseNewShop"
                            onClick={() => setInputUpdate({ ...inputUpdate, newShop: undefined })}
                          >
                            Cancel Point/Shop Creation
                          </a>
                        </div>
                      </div>
                    </div>

                    <MutationButton
                      type="button"
                      icon="mdi mdi-plus-thick"
                      className="btn btn-primary"
                      size="sm"
                      label="Submit"
                      loading={updating}
                      onClick={handleUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
