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
import { Dispatch, FC, useEffect, useState } from 'react';
import type { SetStateAction } from 'react';
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tab, Tabs, TextField, Table, TableBody, TableContainer, Paper, TableCell, TableRow, Checkbox, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTable, TableNoData, TableEmptyRows, TableSelectedAction, TablePaginationCustom, TableHeadCustom } from 'src/components/table';
import { Iconify } from 'src/components/iconify';

const LeafletMapPointPick: FC<{ setMarker: Dispatch<SetStateAction<IPoint | undefined>> }> = ({
  setMarker,
}) => {
  const MapEvents = () => {
    useMapEvents({
      click(e: any) {
        setMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <MapContainer style={{ height: '250px', width: '100%' }} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents />
    </MapContainer>
  );
};

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

  const table = useTable({ defaultOrderBy: 'orderNumber' });

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
      name: 'RADIUS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.radius,
      cell: (row: any) => `${row.radius} m`,
    },
    {
      name: 'APPROVAL',
      width: '115px',
      sortable: true,
      center: true,
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
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#update-point-modal"
            onClick={() => {
              setInputUpdate(_inputInit);
              loadPoint(row.id);
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
      name: 'RADIUS',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.radius,
      cell: (row: any) => `${row.radius} m`,
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
    if (point) {
      setInputUpdate({ id: point.id, shopId: point.shop?.id, radius: point.radius });
    }
  }, [point]);

  return (
    <>
      <Tabs value={0} aria-label="shop tabs">
        <Tab label="Active" />
        <Tab label="Recycled" />
      </Tabs>

      <Box>
        <Card>
          <Button variant="outlined" color="success" onClick={() => {/* handle new shop */}}>
            New
          </Button>
          <Button variant="outlined" color="error" onClick={handleRecycle} disabled={recycling}>
            Recycle
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={columns}
                rowCount={points?.rows.length || 0}
                numSelected={selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    points?.rows.map((row: any) => row.id) || []
                  )
                }
              />
              <TableBody>
                {points?.rows.map((row: any, index: number) => (
                  <TableRow hover key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onClick={() => console.log(row.id)}
                        inputProps={{ 'aria-label': 'select point' }}
                      />
                    </TableCell>
                    <TableCell>{row.index}</TableCell>
                    <TableCell>{row.shop?.name}</TableCell>
                    <TableCell>{row.shop?.sector?.name}</TableCell>
                    <TableCell>{row.shop?.category?.name}</TableCell>
                    <TableCell>{`${row.radius} m`}</TableCell>
                    <TableCell>
                      <i
                        className={`mdi mdi-check-decagram text-${
                          row.shop?.approved ? 'success' : 'danger'
                        } font-16`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => console.log(row.id)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton onClick={() => console.log(row.id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Card>
          <Button variant="outlined" color="warning" onClick={handleRestore} disabled={restoring}>
            Restore
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={columnsRecycled}
                rowCount={pointsRecycled?.rows.length || 0}
                numSelected={selectedRecycled.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    pointsRecycled?.rows.map((row: any) => row.id) || []
                  )
                }
              />
              <TableBody>
                {pointsRecycled?.rows.map((row: any, index: number) => (
                  <TableRow hover key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRecycled.includes(row.id)}
                        onClick={() => console.log(row.id)}
                        inputProps={{ 'aria-label': 'select point' }}
                      />
                    </TableCell>
                    <TableCell>{row.index}</TableCell>
                    <TableCell>{row.shop?.name}</TableCell>
                    <TableCell>{row.shop?.sector?.name}</TableCell>
                    <TableCell>{row.shop?.category?.name}</TableCell>
                    <TableCell>{`${row.radius} m`}</TableCell>
                    <TableCell>
                      <i
                        className={`mdi mdi-check-decagram text-${
                          row.shop?.approved ? 'success' : 'danger'
                        } font-16`}
                      />
                    </TableCell>
                    <TableCell>{row.recycled ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      <Dialog open={false} onClose={() => {}} fullWidth maxWidth="md">
        <DialogTitle>New Shop</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Proximity Radius (m)" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" />
            </Grid>
            <Grid item xs={12}>
              <LeafletMapPointPick setMarker={setMarker} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
