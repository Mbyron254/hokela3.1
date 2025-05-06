'use client';

import { GQLMutation } from '@/lib/client';
import { IAreaUpdate, IAreaCreate, ICoordinate } from '@/lib/interface/area.interface';
import {
  AREAS,
  AREAS_RECYCLED,
  AREA,
  AREA_CREATE,
  AREA_UPDATE,
  AREA_RECYCLE,
  AREA_RESTORE,
} from '@/lib/mutations/area.mutation';
import { FC, useEffect, useState } from 'react';
import { GoogleMapPolygonDraw } from '../GoogleMapPolygonDraw';
import { IPoint } from '@/lib/interface/point.interface';
import { DataTable } from '../DataTable';
import { MutationButton } from '../MutationButton';
import { LoadingDiv } from '../LoadingDiv';

export const RunRouteSetAreas: FC<{
  run: any;
}> = ({ run }) => {
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
    color: '#4405ad',
    coordinates: [],
  });
  const [inputUpdate, setInputUpdate] = useState(_input);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [polygonPathsCreate, setPolygonPathsCreate] = useState<IPoint[]>([]);
  const [polygonPathsUpdate, setPolygonPathsUpdate] = useState<IPoint[]>([]);

  const loadAreas = () => {
    if (run.id) {
      getAreas({ variables: { input: { runId: run.id } } });
    }
  };
  const loadAreasRecycled = () => {
    if (run.id) {
      getAreasRecycled({ variables: { input: { runId: run.id } } });
    }
  };
  const loadArea = (id: string) => {
    getArea({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    if (run.id) {
      create({ variables: { input: { ...input, runId: run.id, coordinates: polygonPathsCreate } } });
    }
  };
  const handleUpdate = () => {
    if (run.id) {
      update({
        variables: { input: { ...inputUpdate, runId: run.id, coordinates: polygonPathsUpdate } },
      });
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
      selector: (row: any) => row.name,
      cell: (row: any) => row.name,
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
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#update-area-modal"
            onClick={() => {
              setInputUpdate(_input);
              loadArea(row.id);
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

  useEffect(() => loadAreas(), []);
  useEffect(() => {
    if (area) {
      const _coords: ICoordinate[] = [];

      for (let i = 0; i < area.coordinates?.length; i++) {
        _coords.push({ lat: area.coordinates[i].lat, lng: area.coordinates[i].lng });
      }

      setPolygonPathsUpdate(_coords);
      setInputUpdate({ id: area.id, name: area.name, color: area.color });
    }
  }, [area]);

  return (
    <>
      <ul className="nav nav-tabs nav-bordered mb-2">
        <li className="nav-item">
          <a href="#active-areas" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
            <i className="mdi mdi-account-circle d-md-none d-block"></i>
            <span className="d-none d-md-block">Active</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#recycled-areas" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
            <i className="mdi mdi-settings-outline d-md-none d-block"></i>
            <span className="d-none d-md-block">Recycled</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="active-areas">
          <div className="btn-group btn-group-sm mb-2">
            <button
              type="button"
              className="btn btn-outline-success me-2"
              data-bs-toggle="modal"
              data-bs-target="#create-area-modal"
            >
              <i className="mdi mdi-plus me-1"></i>New
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleRecycle}
              disabled={recycling}
            >
              <i className="mdi mdi-trash-can-outline me-1"></i>Recycle
            </button>
          </div>

          <DataTable
            columns={columns}
            loading={loadingAreas}
            setSelected={setSelected}
            expanded={false}
            totalRows={areas?.count}
            data={areas?.rows}
            handleReloadMutation={loadAreas}
            reloadTriggers={[created, updated, recycled, restored]}
          />
        </div>

        <div className="tab-pane" id="recycled-areas">
          <div className="btn-group btn-group-sm mb-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              onClick={handleRestore}
              disabled={restoring}
            >
              <i className="mdi mdi-restore me-2"></i>Restore
            </button>
          </div>

          <DataTable
            columns={columnsRecycled}
            loading={loadingAreasRecycled}
            setSelected={setSelectedRecycled}
            expanded={false}
            totalRows={areasRecycled?.count}
            data={areasRecycled?.rows}
            handleReloadMutation={loadAreasRecycled}
            reloadTriggers={[recycled, restored]}
          />
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
                    <label className="mb-1" htmlFor="name">
                      Name
                    </label>
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
                    <label className="mb-1" htmlFor="color">
                      Color
                    </label>
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
                <GoogleMapPolygonDraw
                  color={input.color || '#4405ad'}
                  polygonPaths={polygonPathsCreate}
                  setPolygonPaths={setPolygonPathsCreate}
                />
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => setPolygonPathsCreate([])}>
                Reset Area
              </button>
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
                      <label className="mb-1" htmlFor="name">
                        Name
                      </label>
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
                      <label className="mb-1" htmlFor="color">
                        Color
                      </label>
                      <input
                        type="color"
                        name="color"
                        className="form-control"
                        id="color"
                        // value="#727cf5"
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

                  <GoogleMapPolygonDraw
                    color={inputUpdate.color || '#4405ad'}
                    polygonPaths={polygonPathsUpdate}
                    setPolygonPaths={setPolygonPathsUpdate}
                  />
                </div>

                <button className="btn btn-sm btn-primary" onClick={() => setPolygonPathsUpdate([])}>
                  Reset Map
                </button>
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
