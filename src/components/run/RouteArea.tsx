'use client';

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import {
  AREA,
  AREA_CREATE,
  AREA_RECYCLE,
  AREA_RESTORE,
  AREA_UPDATE,
  AREAS,
  AREAS_RECYCLED,
} from 'src/lib/mutations/area.mutation';
import { IAreaCreate, IAreaUpdate, ICoordinate, IPolygon } from 'src/lib/interface/area.interface';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { LoadingDiv } from '../LoadingDiv';
import { MutationButton } from '../MutationButton';
import { GoogleMapArea } from '../GoogleMapArea';

export const RouteArea: FC<{
  runId: string;
}> = ({ runId }) => {
  const {
    action: getAreas,
    loading: loadingAreas,
    data: areas,
  } = GQLMutation({
    mutation: AREAS,
    resolver: 'areas',
    toastmsg: false,
  });
  const {
    action: getAreasRecycled,
    loading: loadingAreasRecycled,
    data: areasRecycled,
  } = GQLMutation({
    mutation: AREAS_RECYCLED,
    resolver: 'areasRecycled',
    toastmsg: false,
  });
  const {
    action: getArea,
    loading: loadingArea,
    data: area,
  } = GQLMutation({
    mutation: AREA,
    resolver: 'area',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: AREA_CREATE,
    resolver: 'areaCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: AREA_UPDATE,
    resolver: 'areaUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: AREA_RECYCLE,
    resolver: 'areaRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: AREA_RESTORE,
    resolver: 'areaRestore',
    toastmsg: true,
  });

  const _input: IAreaUpdate = {
    id: undefined,
    name: undefined,
    color: undefined,
    coordinates: undefined,
  };
  const [input, setInput] = useState<IAreaCreate>({
    name: undefined,
    color: undefined,
    coordinates: [],
  });
  const [inputUpdate, setInputUpdate] = useState(_input);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [polygons, setPolygons] = useState<IPolygon[]>([]);
  const [coordinate, setCoordinate] = useState<ICoordinate>({ id: 0, lat: 0, lng: 0 });
  const [coordinateUpdate, setCoordinateUpdate] = useState<ICoordinate>({ id: 0, lat: 0, lng: 0 });

  const loadAreasRecycled = () => {
    if (runId) getAreasRecycled({ variables: { input: { runId } } });
  };
  const loadArea = (id: string) => {
    getArea({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    if (runId) {
      const _cords: ICoordinate[] = [];

      if (input.coordinates) {
        for (let i = 0; i < input.coordinates?.length; i+=1) {
          _cords.push({ lat: input.coordinates[i].lat, lng: input.coordinates[i].lng });
        }
      }
      create({ variables: { input: { ...input, runId, coordinates: _cords } } });
    }
  };
  const handleUpdate = () => {
    if (runId) {
      const _cords: ICoordinate[] = [];

      if (inputUpdate.coordinates) {
        for (let i = 0; i < inputUpdate.coordinates?.length; i+=1) {
          _cords.push({ lat: inputUpdate.coordinates[i].lat, lng: inputUpdate.coordinates[i].lng });
        }
      }
      update({ variables: { input: { ...inputUpdate, runId, coordinates: _cords } } });
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
  const handleAdd = (mode: string) => {
    if (mode === 'create') {
      const _coords = input.coordinates || [];

      setInput({
        ...input,
        coordinates: [..._coords, { ...coordinate, id: _coords.length + 1 }],
      });
    }
    if (mode === 'update') {
      const _coords = inputUpdate.coordinates || [];

      setInputUpdate({
        ...inputUpdate,
        coordinates: [..._coords, { ...coordinateUpdate, id: _coords.length + 1 }],
      });
    }
  };
  const handleRemove = (mode: string, id: number) => {
    if (mode === 'create') {
      setInput({
        ...input,
        coordinates: [...(input.coordinates as ICoordinate[]).filter((_coord) => _coord.id !== id)],
      });
    }
    if (mode === 'update') {
      setInputUpdate({
        ...inputUpdate,
        coordinates: [
          ...(inputUpdate.coordinates as ICoordinate[]).filter((_coord) => _coord.id !== id),
        ],
      });
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
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'MORE',
      width: '100px',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) =>  (
          <button
            type="button"
            className="btn btn-light btn-sm me-2"
            data-bs-toggle="modal"
            data-bs-target="#update-area-modal"
            onClick={() => {
              setInputUpdate(_input);
              loadArea(row.id);
            }}
          >
            <i className="mdi mdi-circle-edit-outline"/>
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
      selector: (row: any) => row.shop?.name,
      cell: (row: any) => row.shop?.name,
    },
    {
      name: 'RECYCLED',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.recycled,
      cell: (row: any) => row.recycled,
    },
  ];

  const renderTable = (data: any[], cols: any[], handleRowClick: (id: string) => void) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {cols.map((column, index) => (
              <TableCell key={index}>{column.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} onClick={() => handleRowClick(row.id)}>
              {cols.map((column, colIndex) => (
                <TableCell key={colIndex}>{column.selector(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  useEffect(() => {
    if (runId) getAreas({ variables: { input: { runId } } });
  }, [runId, getAreas]);
  useEffect(() => {
    if (area) {
      const _coords: ICoordinate[] = [];

      for (let i = 0; i < area.coordinates?.length; i+=1) {
        _coords.push({ id: i + 1, lat: area.coordinates[i].lat, lng: area.coordinates[i].lng });
      }
      setInputUpdate({ id: area.id, name: area.name, color: area.color, coordinates: _coords });
    }
  }, [area]);
  useEffect(() => {
    if (areas) {
      areas.rows.forEach((_area: any) => {
        const coords: ICoordinate[] = [];

        for (let i = 0; i < _area.coordinates.length; i+=1) {
          coords.push({
            lat: _area.coordinates[i].lat,
            lng: _area.coordinates[i].lng,
          });
        }
        setPolygons((curr) => [...curr, { color: _area.color, coords }]);
      });
    }
  }, [areas]);

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
            <a
              className="btn btn-info mb-3"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#create-area-modal"
            >
              <span className=" d-md-block">
                <i className="mdi mdi-plus me-2"/>New Area
              </span>
            </a>
            <a
              className="nav-link active show"
              id="v-pills-area-table-tab"
              data-bs-toggle="pill"
              href="#v-pills-area-table"
              role="tab"
              aria-controls="v-pills-area-table"
              aria-selected="true"
            >
              <i className="mdi mdi-home-variant d-md-none d-block"/>
              <span className="d-none d-md-block">Table</span>
            </a>
            <a
              className="nav-link"
              id="v-pills-area-map-tab"
              data-bs-toggle="pill"
              href="#v-pills-area-map"
              role="tab"
              aria-controls="v-pills-area-map"
              aria-selected="false"
            >
              <i className="mdi mdi-account-circle d-md-none d-block"/>
              <span className="d-none d-md-block">Map</span>
            </a>
          </div>
        </div>

        <div className="col-sm-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div
              className="tab-pane fade active show"
              id="v-pills-area-table"
              role="tabpanel"
              aria-labelledby="v-pills-area-table-tab"
            >
              <ul className="nav nav-tabs nav-bordered mb-3">
                <li className="nav-item">
                  <a
                    href="#active-areas"
                    data-bs-toggle="tab"
                    aria-expanded="true"
                    className="nav-link active"
                  >
                    <i className="mdi mdi-account-circle d-md-none d-block"/>
                    <span className="d-none d-md-block">Active</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#recycled-areas"
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link"
                  >
                    <i className="mdi mdi-settings-outline d-md-none d-block"/>
                    <span className="d-none d-md-block">Recycled</span>
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="tab-pane show active" id="active-areas">
                  <div className="btn-group mb-2">
                    <Button variant="outlined" onClick={handleRecycle} disabled={recycling}>
                      <i className="mdi mdi-trash-can-outline me-2"/>Recycle
                    </Button>
                  </div>

                  {renderTable(areas?.rows || [], columns, loadArea)}
                </div>

                <div className="tab-pane" id="recycled-areas">
                  <div className="btn-group mb-2">
                    <Button variant="outlined" onClick={handleRestore} disabled={restoring}>
                      <i className="mdi mdi-restore me-2"/>Restore
                    </Button>
                  </div>

                  {renderTable(areasRecycled?.rows || [], columnsRecycled, loadArea)}
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="v-pills-area-map"
              role="tabpanel"
              aria-labelledby="v-pills-area-map-tab"
            >
              <div className="card">
                <div className="card-body p-2">
                  <GoogleMapArea polygons={polygons} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="create-area-modal"
        className="modal fade"
        role="dialog"
        aria-labelledby="create-area"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="create-area">
                New Area
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <p className="mb-1">Name</p>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      defaultValue={input.name}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <p className="mb-1">Color</p>
                    <input
                      type="color"
                      name="color"
                      className="form-control"
                      id="color"
                      defaultValue={input.color}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <p className="mb-1">Coordinates</p>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Latitude"
                        aria-label="Latitude"
                        defaultValue={coordinate.lat}
                        onChange={(e) =>
                          setCoordinate({
                            ...coordinate,
                            lat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Longitude"
                        aria-label="Longitude"
                        defaultValue={coordinate.lng}
                        onChange={(e) =>
                          setCoordinate({
                            ...coordinate,
                            lng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                          })
                        }
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleAdd('create')}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <ul className="list-group">
                    {input.coordinates?.map((_coordinate: any, index: number) => (
                      <li key={`coordinate-${index}`} className="list-group-item">
                        <i className="mdi mdi-google-maps me-1"/>
                        {`Lat: ${_coordinate.lat}, Lng: ${_coordinate.lng}`}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger float-end p-1"
                          onClick={() => handleRemove('create', _coordinate.id)}
                        >
                          <i className="mdi mdi-cancel"/>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <MutationButton
                type="button"
                className="btn btn-success float-end"
                size="sm"
                label="Save"
                icon="mdi mdi-plus-thick"
                loading={creating}
                onClick={handleCreate}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id="update-area-modal"
        className="modal fade"
        role="dialog"
        aria-labelledby="update-area"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          {loadingArea ? (
            <LoadingDiv />
          ) : (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="update-area">
                  Edit Area
                </h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="mb-1">Name</p>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        defaultValue={inputUpdate.name}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="mb-1">Color</p>
                      <input
                        type="color"
                        name="color"
                        className="form-control"
                        id="color"
                        defaultValue={inputUpdate.color}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            color: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <p className="mb-1">Coordinates</p>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Latitude"
                          aria-label="Latitude"
                          defaultValue={coordinateUpdate.lat}
                          onChange={(e) =>
                            setCoordinateUpdate({
                              ...coordinateUpdate,
                              lat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                            })
                          }
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Longitude"
                          aria-label="Longitude"
                          defaultValue={coordinateUpdate.lng}
                          onChange={(e) =>
                            setCoordinateUpdate({
                              ...coordinateUpdate,
                              lng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                            })
                          }
                        />
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => handleAdd('update')}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <ul className="list-group">
                      {inputUpdate.coordinates?.map((_coordinate: any, index: number) => (
                        <li key={`coordinate-${index}`} className="list-group-item">
                          <i className="mdi mdi-google-maps me-1"/>
                          {`Lat: ${_coordinate.lat}, Lng: ${_coordinate.lng}`}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger float-end p-1"
                            onClick={() => handleRemove('update', _coordinate.id)}
                          >
                            <i className="mdi mdi-cancel"/>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <MutationButton
                  type="button"
                  className="btn btn-primary float-end"
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
    </>
  );
};
