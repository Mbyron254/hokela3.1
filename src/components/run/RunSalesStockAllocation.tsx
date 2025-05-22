'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
// import { MutationButton } from '../MutationButton';
import {
  ALLOCATE_INVENTORY,
  M_AGENTS_ALLOCATIONS,
  M_STOCK_BALANCE,
} from 'src/lib/mutations/inventory-allocation.mutation';
import { M_RUN_TEAMS_MINI } from 'src/lib/mutations/run-team.mutation';
import { GQLMutation } from 'src/lib/client';
import { M_PRODUCTS_MINI } from 'src/lib/mutations/product.mutation';
import { M_CAMPAIGN_AGENTS } from 'src/lib/mutations/run-offer.mutation';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { M_PACKAGINGS_MINI } from 'src/lib/mutations/packaging.mutation';
import { IAllocations, IInventoryAllocation } from 'src/lib/interface/general.interface';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Button, Select, MenuItem, FormControl, InputLabel, FormControlLabel } from '@mui/material';
import { LoadingSpan } from '../LoadingSpan';

export const RunSalesStockAllocation: FC<IInventoryAllocation> = ({ runId, clientTier2Id }) => {
  const {
    action: getAgents,
    loading: loadingAgents,
    data: agents,
  } = GQLMutation({
    mutation: M_CAMPAIGN_AGENTS,
    resolver: 'runOffers',
    toastmsg: false,
  });
  const {
    action: getProducts,
    loading: loadingProducts,
    data: products,
  } = GQLMutation({
    mutation: M_PRODUCTS_MINI,
    resolver: 'm_products',
    toastmsg: false,
  });
  const {
    action: getPackagings,
    loading: loadingPackagings,
    data: packagings,
  } = GQLMutation({
    mutation: M_PACKAGINGS_MINI,
    resolver: 'm_packagings',
    toastmsg: false,
  });
  const {
    action: getAllocations,
    loading: loadingAllocations,
    data: allocation,
  } = GQLMutation({
    mutation: M_AGENTS_ALLOCATIONS,
    resolver: 'agentsAllocations',
    toastmsg: false,
  });
  const { action: allocate, loading: allocating } = GQLMutation({
    mutation: ALLOCATE_INVENTORY,
    resolver: 'allocateInventory',
    toastmsg: true,
  });
  const {
    action: getStock,
    loading: loadingStock,
    data: stock,
  } = GQLMutation({
    mutation: M_STOCK_BALANCE,
    resolver: 'stockBalance',
    toastmsg: false,
  });
  const {
    action: getTeams,
    loading: loadingTeams,
    data: teams,
  } = GQLMutation({
    mutation: M_RUN_TEAMS_MINI,
    resolver: 'runTeams',
    toastmsg: false,
  });

  const [product, setProduct] = useState<{ id?: string; packagingId?: string }>({
    id: undefined,
    packagingId: undefined,
  });
  const [allocations, setAllocations] = useState<IAllocations[]>([]);
  const [bulkFill, setBulkFill] = useState<boolean>(false);
  const [allocationTotal, setAllocationTotal] = useState<number>(0);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();
  const [teamId, setTeamId] = useState<string>();

  const loadAgents = (page?: number, pageSize?: number) => {
    if (runId) {
      getAgents({ variables: { input: { search, runId, teamId, page, pageSize } } });
    }
  };

  const handleAllocate = () => {
    if (allocations.length) {
      const _allocations: { agentId: string; quantity: number }[] = [];

      for (let x = 0; x < allocations.length; x += 1) {
        _allocations.push({
          agentId: allocations[x].id,
          quantity: allocations[x].allocated,
        });
      }

      if (runId && product.id && product.packagingId && _allocations.length) {
        allocate({
          variables: {
            input: {
              runId,
              packagingId: product.packagingId,
              allocations: _allocations,
            },
          },
        });
      } else {
        alert("Please select agent(s), a product and it's packaging");
      }
    }
  };
  const handleChange = (id: string, event: any) => {
    const _curr: IAllocations[] = [...allocations];

    let _allocationTotal = 0;

    for (let i = 0; i < _curr.length; i += 1) {
      if (bulkFill) {
        _curr[i].allocated = parseInt(event.target.value, 10) || 0;
      } else if (_curr[i].id === id) {
        const newAllocation = parseInt(event.target.value, 10) || 0;

        _curr[i].allocated = newAllocation < _curr[i].sold ? _curr[i].sold : newAllocation;

      }
      _allocationTotal += _curr[i].allocated;
    }
    setAllocations(_curr);
    setAllocationTotal(_allocationTotal);
  };

  const columns = [
    { id: 'index', label: '#', minWidth: 60 },
    { id: 'agent', label: 'AGENT', minWidth: 170 },
  ];

  useEffect(() => getProducts({ variables: { input: { clientTier2Id } } }), [clientTier2Id, getProducts]);
  useEffect(() => getTeams({ variables: { input: { runId } } }), [runId, getTeams]);
  useEffect(() => getPackagings({ variables: { input: { productId: product.id } } }), [product.id, getPackagings]);
  useEffect(() => getStock({ variables: { input: { productId: product.id, packagingId: product.packagingId } } }), [product.id, product.packagingId, getStock]);
  useEffect(() => getAllocations({ variables: { input: { runId, packagingId: product.packagingId, agents: selectedAgents } } }), [product.id, product.packagingId, selectedAgents, getAllocations, runId]);
  useEffect(() => {
    if (allocation?.entries) {
      const _allocations: IAllocations[] = [];

      let _allocationTotal = 0;

      for (let i = 0; i < allocation.entries.length; i += 1) {
        _allocations.push({
          index: allocation.entries[i].index,
          id: allocation.entries[i].agent?.id,
          name: allocation.entries[i].agent?.user?.name,
          photo: allocation.entries[i].agent?.user?.profile?.photo?.fileName,
          allocated: allocation.entries[i].quantityAllocated,
          sold: allocation.entries[i].quantitySold,
        });
        _allocationTotal += allocation.entries[i].quantityAllocated;
      }
      setAllocations(_allocations);
      setAllocationTotal(_allocationTotal);
    }
  }, [allocation?.entries]);

  return (
    <>
      <div className="row">
        <div className="col-md-5">
          <div className="card border border-primary">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {loadingTeams ? (
                    <LoadingSpan />
                  ) : (
                    <FormControl fullWidth variant="outlined" className="mb-3">
                      <InputLabel id="team-label">Filter by team</InputLabel>
                      <Select
                        labelId="team-label"
                        id="team"
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        label="Filter by team"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {teams?.rows.map((team: any, index: number) => (
                          <MenuItem value={team.id} key={`team-${index}`}>
                            {team.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
                <div className="col-md-6">
                  <TextField
                    id="top-search"
                    label="Search agent..."
                    variant="outlined"
                    fullWidth
                    className="mb-3"
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={loadingAgents}
                          onClick={() => loadAgents(0, 10)}
                        >
                          {loadingAgents ? 'Loading...' : 'Search'}
                        </Button>
                      ),
                    }}
                  />
                </div>
              </div>

              <hr className="mb-2" />

              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="agents table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agents?.rows.map((row: any, index: number) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{row.index}</TableCell>
                        <TableCell>
                          <Image
                            className="me-1 mt-1 mb-1 rounded-circle"
                            src={sourceImage(row.agent?.user?.photo?.fileName)}
                            loader={() => sourceImage(row.agent?.user?.photo?.fileName)}
                            alt=""
                            width={TABLE_IMAGE_WIDTH}
                            height={TABLE_IMAGE_HEIGHT}
                          />
                          <div className="w-100 overflow-hidden">
                            <h6 className="mt-1 mb-1">{row.agent?.user?.name}</h6>
                            <p className="mt-0 mb-1 text-muted">{row.agent?.user?.email}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card border-primary border mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {loadingProducts ? (
                    <LoadingSpan />
                  ) : (
                    <FormControl fullWidth variant="outlined" className="mb-3">
                      <InputLabel id="product-label">Product</InputLabel>
                      <Select
                        labelId="product-label"
                        id="product"
                        value={product.id}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            id: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                        label="Product"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {products?.rows.map((prod: any, index: number) => (
                          <MenuItem value={prod.id} key={`product-${index}`}>
                            {prod.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
                <div className="col-md-6">
                  {loadingPackagings ? (
                    <LoadingSpan />
                  ) : (
                    <FormControl fullWidth variant="outlined" className="mb-3">
                      <InputLabel id="packaging-label">Packaging</InputLabel>
                      <Select
                        labelId="packaging-label"
                        id="packaging"
                        value={product.packagingId}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            packagingId: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                        label="Packaging"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {packagings?.rows.map((packaging: any, index: number) => (
                          <MenuItem key={`packaging-${index}`} value={packaging.id}>
                            {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
              </div>

              <hr className="mt-0 mb-0" />

              <h5 className="mb-0">
                Allocated {allocationTotal} of {stock?.balPackage ? stock.balPackage : 0} units
              </h5>
            </div>
          </div>

          <div className="card border-primary border">
            <div className="card-body">
              <h5 className="card-title">
                <span className="text-uppercase">Allocations</span>
                {loadingAllocations ? <LoadingSpan /> : undefined}

                <span className="float-end">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={bulkFill}
                        onChange={() => setBulkFill(!bulkFill)}
                        name="bulkFill"
                        color="primary"
                        disabled={allocation?.canBulkFill}
                      />
                    }
                    label="Bulk Fill"
                  />
                </span>
              </h5>

              <hr className="mt-0 mb-1" />

              <div className="mb-2">
                {allocations?.map((alloc: any, index: number) => (
                  <div key={`allocation-${index}`}>
                    <dl className="row mb-0">
                      <dt className="col-sm-8">
                        <span className="me-2">{alloc.index}.</span>
                        <Image
                          className="me-2 mt-1 mb-1"
                          src={sourceImage(alloc.photo)}
                          loader={() => sourceImage(alloc.photo)}
                          alt=""
                          width={TABLE_IMAGE_WIDTH}
                          height={TABLE_IMAGE_HEIGHT}
                        />
                        {alloc.name}
                      </dt>
                      <dd className="col-sm-4">
                        <div className="input-group input-group-sm">
                          <TextField
                            type="text"
                            variant="outlined"
                            size="small"
                            disabled
                            placeholder={`Sold: ${alloc.sold}`}
                            fullWidth
                          />
                          <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            value={alloc.allocated}
                            onChange={(e) => handleChange(alloc.id, e)}
                            fullWidth
                            inputProps={{ min: alloc.sold }}
                          />
                        </div>
                      </dd>
                    </dl>

                    <hr className="mt-0 mb-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="contained"
            color="primary"
            size="small"
            className="float-end"
            startIcon={<i className="mdi mdi-refresh" />}
            onClick={handleAllocate}
            disabled={allocating}
          >
            {allocating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </>
  );
};
