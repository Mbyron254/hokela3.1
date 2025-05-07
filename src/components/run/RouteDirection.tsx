'use client';

import { FC, useEffect, useState } from 'react';
import { GoogleMapDirection } from '../GoogleMapDirection';
import { GQLMutation } from '@/lib/client';
import {
  DIRECTION,
  DIRECTION_CREATE,
  DIRECTION_RECYCLE,
  DIRECTION_RESTORE,
  DIRECTION_UPDATE,
  DIRECTIONS,
  DIRECTIONS_RECYCLED,
} from '@/lib/mutations/direction.mutation';
import { IDirectionCreate, IDirectionUpdate } from '@/lib/interface/direction.interface';
import { IPoint } from '@/lib/interface/point.interface';
import { MutationButton } from '../MutationButton';
import { LoadingDiv } from '../LoadingDiv';
import { DataTable } from '../DataTable';
import { DRIVING_MODES } from '@/lib/constant';

export const RouteDirection: FC<{
  runId: string;
}> = ({ runId }) => {
  const {
    action: getDirections,
    loading: loadingDirections,
    data: directions,
  } = GQLMutation({
    mutation: DIRECTIONS,
    resolver: 'directions',
    toastmsg: false,
  });
  const {
    action: getDirectionsRecycled,
    loading: loadingDirectionsRecycled,
    data: directionsRecycled,
  } = GQLMutation({
    mutation: DIRECTIONS_RECYCLED,
    resolver: 'directionsRecycled',
    toastmsg: false,
  });
  const {
    action: getDirection,
    loading: loadingDirection,
    data: direction,
  } = GQLMutation({
    mutation: DIRECTION,
    resolver: 'direction',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: DIRECTION_CREATE,
    resolver: 'directionCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: DIRECTION_UPDATE,
    resolver: 'directionUpdate',
    toastmsg: true,
  });
  const {
    action: recycle,
    loading: recycling,
    data: recycled,
  } = GQLMutation({
    mutation: DIRECTION_RECYCLE,
    resolver: 'directionRecycle',
    toastmsg: true,
  });
  const {
    action: restore,
    loading: restoring,
    data: restored,
  } = GQLMutation({
    mutation: DIRECTION_RESTORE,
    resolver: 'directionRestore',
    toastmsg: true,
  });

  const _input: IDirectionUpdate = {
    id: undefined,
    name: undefined,
    startLat: undefined,
    startLng: undefined,
    stopLat: undefined,
    stopLng: undefined,
    travelMode: undefined,
  };
  const [input, setInput] = useState<IDirectionCreate>({
    name: undefined,
    startLat: undefined,
    startLng: undefined,
    stopLat: undefined,
    stopLng: undefined,
    travelMode: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_input);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [routes, setRoutes] = useState<{ origin: IPoint; destination: IPoint; travelMode: string }[]>(
    [],
  );

  const loadDirections = () => {
    if (runId) {
      getDirections({ variables: { input: { runId } } });
    }
  };
  const loadDirection = (id: string) => {
    getDirection({ variables: { input: { id } } });
  };
  const loadDirectionsRecycled = () => {
    if (runId) {
      getDirectionsRecycled({ variables: { input: { runId } } });
    }
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
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'MODE',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.travelMode,
      cell: (row: any) => row.travelMode,
    },
    {
      name: 'START',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.startLat,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lat:</small>
            {row.startLat}
          </h6>
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lng:</small>
            {row.startLng}
          </h6>
        </div>
      ),
    },
    {
      name: 'STOP',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.stopLat,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lat:</small>
            {row.stopLat}
          </h6>
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lng:</small>
            {row.stopLng}
          </h6>
        </div>
      ),
    },
    {
      name: 'MORE',
      width: '100px',
      sortable: false,
      center: true,
      selector: (row: any) => row.id,
      cell: (row: any) => {
        return (
          <button
            type="button"
            className="btn btn-light btn-sm me-2"
            data-bs-toggle="modal"
            data-bs-target="#update-direction"
            onClick={() => {
              setInputUpdate(_input);
              loadDirection(row.id);
            }}
          >
            <i className="mdi mdi-circle-edit-outline"></i>
          </button>
        );
      },
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
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
    },
    {
      name: 'MODE',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.travelMode,
      cell: (row: any) => row.travelMode,
    },
    {
      name: 'START',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.startLat,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lat:</small>
            {row.startLat}
          </h6>
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lng:</small>
            {row.startLng}
          </h6>
        </div>
      ),
    },
    {
      name: 'STOP',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.stopLat,
      cell: (row: any) => (
        <div className="w-100 overflow-hidden">
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lat:</small>
            {row.stopLat}
          </h6>
          <h6 className="font-8 mb-1">
            <small className="text-muted me-1">Lng:</small>
            {row.stopLng}
          </h6>
        </div>
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
    if (direction) {
      setInputUpdate({
        id: direction.id,
        name: direction.name,
        startLat: direction.startLat,
        startLng: direction.startLng,
        stopLat: direction.stopLat,
        stopLng: direction.stopLng,
        travelMode: direction.travelMode,
      });
    }
  }, [direction]);
  useEffect(() => {
    if (directions) {
      directions.rows.forEach((direction: any) => {
        setRoutes((curr) => {
          return [
            ...curr,
            {
              origin: { lat: direction.startLat, lng: direction.startLng },
              destination: { lat: direction.stopLat, lng: direction.stopLng },
              travelMode: direction.travelMode,
            },
          ];
        });
      });
    }
  }, [directions]);

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
              data-bs-target="#create-direction"
            >
              <span className=" d-md-block">
                <i className="mdi mdi-plus me-2"></i>New Direction
              </span>
            </a>
            <a
              className="nav-link active show"
              id="v-pills-direction-table-tab"
              data-bs-toggle="pill"
              href="#v-pills-direction-table"
              role="tab"
              aria-controls="v-pills-direction-table"
              aria-selected="true"
            >
              <i className="mdi mdi-home-variant d-md-none d-block"></i>
              <span className="d-none d-md-block">Table</span>
            </a>
            <a
              className="nav-link"
              id="v-pills-direction-map-tab"
              data-bs-toggle="pill"
              href="#v-pills-direction-map"
              role="tab"
              aria-controls="v-pills-direction-map"
              aria-selected="false"
            >
              <i className="mdi mdi-account-circle d-md-none d-block"></i>
              <span className="d-none d-md-block">Map</span>
            </a>
          </div>
        </div>

        <div className="col-sm-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div
              className="tab-pane fade active show"
              id="v-pills-direction-table"
              role="tabpanel"
              aria-labelledby="v-pills-direction-table-tab"
            >
              <ul className="nav nav-tabs nav-bordered mb-3">
                <li className="nav-item">
                  <a
                    href="#active-route"
                    data-bs-toggle="tab"
                    aria-expanded="true"
                    className="nav-link active"
                  >
                    <i className="mdi mdi-account-circle d-md-none d-block"></i>
                    <span className="d-none d-md-block">Active</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#recycled-route"
                    data-bs-toggle="tab"
                    aria-expanded="false"
                    className="nav-link"
                  >
                    <i className="mdi mdi-settings-outline d-md-none d-block"></i>
                    <span className="d-none d-md-block">Recycled</span>
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="tab-pane show active" id="active-route">
                  <div className="btn-group mb-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleRecycle}
                      disabled={recycling}
                    >
                      <i className="mdi mdi-trash-can-outline me-2"></i>Recycle
                    </button>
                  </div>

                  <DataTable
                    columns={columns}
                    loading={loadingDirections}
                    setSelected={setSelected}
                    expanded={false}
                    totalRows={directions?.count}
                    data={directions?.rows}
                    handleReloadMutation={loadDirections}
                    reloadTriggers={[created, updated, recycled, restored]}
                  />
                </div>

                <div className="tab-pane" id="recycled-route">
                  <div className="btn-group mb-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleRestore}
                      disabled={restoring}
                    >
                      <i className="mdi mdi-restore me-2"></i>Restore
                    </button>
                  </div>

                  <DataTable
                    columns={columnsRecycled}
                    loading={loadingDirectionsRecycled}
                    setSelected={setSelectedRecycled}
                    expanded={false}
                    totalRows={directionsRecycled?.count}
                    data={directionsRecycled?.rows}
                    handleReloadMutation={loadDirectionsRecycled}
                    reloadTriggers={[recycled, restored]}
                  />
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="v-pills-direction-map"
              role="tabpanel"
              aria-labelledby="v-pills-direction-map-tab"
            >
              <div className="card">
                <div className="card-body p-2">
                  <GoogleMapDirection routes={routes} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="create-direction"
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
                New Direction
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
                      value={input.name}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          name: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="name">Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <select
                      id="travelMode"
                      className="form-select"
                      value={input.travelMode}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          travelMode: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option></option>
                      {DRIVING_MODES.map((mode: any, index: number) => (
                        <option key={`mode-${index}`} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="travelMode">Travel Mode</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="startLat"
                      value={input.startLat}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          startLat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                        })
                      }
                    />
                    <label htmlFor="startLat">Start Latitude</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="startLng"
                      value={input.startLng}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          startLng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                        })
                      }
                    />
                    <label htmlFor="startLng">Start Longitude</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="stopLat"
                      value={input.stopLat}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          stopLat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                        })
                      }
                    />
                    <label htmlFor="stopLat">Stop Latitude</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="stopLng"
                      value={input.stopLng}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          stopLng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                        })
                      }
                    />
                    <label htmlFor="stopLng">Stop Longitude</label>
                  </div>
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
        id="update-direction"
        className="modal fade"
        role="dialog"
        aria-labelledby="update-direction"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          {loadingDirection ? (
            <LoadingDiv />
          ) : (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="update-direction">
                  Edit Direction
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
                        value={inputUpdate.name}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            name: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="name">Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <select
                        id="travelMode"
                        className="form-select"
                        value={inputUpdate.travelMode}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            travelMode: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option></option>
                        {DRIVING_MODES.map((mode: any, index: number) => (
                          <option key={`mode-${index}`} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="travelMode">Travel Mode</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="startLat"
                        value={inputUpdate.startLat}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            startLat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                          })
                        }
                      />
                      <label htmlFor="startLat">Start Latitude</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="startLng"
                        value={inputUpdate.startLng}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            startLng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                          })
                        }
                      />
                      <label htmlFor="startLng">Start Longitude</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="stopLat"
                        value={inputUpdate.stopLat}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            stopLat: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                          })
                        }
                      />
                      <label htmlFor="stopLat">Stop Latitude</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="stopLng"
                        value={inputUpdate.stopLng}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            stopLng: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                          })
                        }
                      />
                      <label htmlFor="stopLng">Stop Longitude</label>
                    </div>
                  </div>
                </div>
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
    </>
  );
};
