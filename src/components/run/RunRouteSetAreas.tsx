'use client'

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { IAreaUpdate, IAreaCreate, ICoordinate } from 'src/lib/interface/area.interface';
import {
  AREAS,
  AREAS_RECYCLED,
  AREA,
  AREA_CREATE,
  AREA_UPDATE,
  AREA_RECYCLE,
  AREA_RESTORE,
} from 'src/lib/mutations/area.mutation';
import { IPoint } from 'src/lib/interface/point.interface';
// Add Material-UI imports
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { GoogleMapPolygonDraw } from '../GoogleMapPolygonDraw';
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

  useEffect(() => {
    if (run.id) {
      getAreas({ variables: { input: { runId: run.id } } });
    }
  }, [run.id, getAreas]);
  useEffect(() => {
    if (area) {
      const _coords: ICoordinate[] = [];

      for (let i = 0; i < area.coordinates?.length; i+=1) {
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
            <i className="mdi mdi-account-circle d-md-none d-block"/>
            <span className="d-none d-md-block">Active</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#recycled-areas" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
            <i className="mdi mdi-settings-outline d-md-none d-block"/>
            <span className="d-none d-md-block">Recycled</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="active-areas">
          <div className="btn-group btn-group-sm mb-2">
            <Button
              variant="outlined"
              color="success"
              size="small"
              data-bs-toggle="modal"
              data-bs-target="#create-area-modal"
            >
              <i className="mdi mdi-plus me-1"/>New
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleRecycle}
              disabled={recycling}
            >
              <i className="mdi mdi-trash-can-outline me-1"/>Recycle
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>MORE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {areas?.rows.map((row: any, index: number) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        data-bs-toggle="modal"
                        data-bs-target="#update-area-modal"
                        onClick={() => {
                          setInputUpdate(_input);
                          loadArea(row.id);
                        }}
                      >
                        <i className="mdi mdi-circle-edit-outline"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="tab-pane" id="recycled-areas">
          <div className="btn-group btn-group-sm mb-2">
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={handleRestore}
              disabled={restoring}
            >
              <i className="mdi mdi-restore me-2"/>Restore
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>RECYCLED</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {areasRecycled?.rows.map((row: any, index: number) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.shop?.name}</TableCell>
                    <TableCell>{row.recycled}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
                    <p className="mb-1">
                      Name
                    </p>
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
                    <p className="mb-1">
                      Color
                    </p>
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
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setPolygonPathsCreate([])}
              >
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
                      <p className="mb-1">
                        Name
                      </p>
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
                      <p className="mb-1">
                        Color
                      </p>
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

                  <GoogleMapPolygonDraw
                    color={inputUpdate.color || '#4405ad'}
                    polygonPaths={polygonPathsUpdate}
                    setPolygonPaths={setPolygonPathsUpdate}
                  />
                </div>

                <button type="button" className="btn btn-sm btn-primary" onClick={() => setPolygonPathsUpdate([])}>
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
