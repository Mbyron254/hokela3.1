'use client';


import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ALLOCATE_INVENTORY,
  M_AGENTS_ALLOCATIONS,
  M_STOCK_BALANCE,
} from 'src/lib/mutations/inventory-allocation.mutation';
import { GQLMutation } from 'src/lib/client';
import { M_PRODUCTS_MINI } from 'src/lib/mutations/product.mutation';
import { M_CAMPAIGN_AGENTS } from 'src/lib/mutations/run-offer.mutation';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { M_PACKAGINGS_MINI } from 'src/lib/mutations/packaging.mutation';
import { IAllocations, IInventoryAllocation } from 'src/lib/interface/general.interface';

import { M_RUN_TEAMS_MINI } from 'src/lib/mutations/run-team.mutation';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { MutationButton } from '../MutationButton';
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

  const loadTeams = () => {
    if (runId) {
      getTeams({ variables: { input: { runId } } });
    }
  };
  const loadAgents = (page?: number, pageSize?: number) => {
    if (runId) {
      getAgents({ variables: { input: { search, runId, teamId, page, pageSize } } });
    }
  };
  const loadProducts = () => {
    getProducts({ variables: { input: { clientTier2Id } } });
  };
  const loadPackagings = () => {
    if (product.id) {
      getPackagings({
        variables: { input: { productId: product.id } },
      });
    }
  };
  const loadStock = () => {
    if (product.id && product.packagingId) {
      console.log('Loading stock for:', { productId: product.id, packagingId: product.packagingId });
      getStock({
        variables: {
          input: { productId: product.id, packagingId: product.packagingId },
        },
      });
    }
  };
  const loadAllocations = () => {
    if (runId && product.packagingId && selectedAgents.length > 0) {
      const validAgents = selectedAgents.filter(agent => agent && agent.trim() !== '');
      if (validAgents.length > 0) {
        getAllocations({ variables: { input: { runId, packagingId: product.packagingId, agents: validAgents } } });
      }
    }
  };
  const handleAllocate = () => {
    if (allocations.length) {
      const _allocations: { agentId: string; quantity: number }[] = [];

      for (let x = 0; x < allocations.length; x+=1) {
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

    for (let i = 0; i < _curr.length; i+=1) {
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
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'AGENT',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.date,
      cell: (row: any) => (
        <>
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
        </>
      ),
    },
  ];

  useEffect(() => getProducts({ variables: { input: { clientTier2Id } } }), [getProducts, clientTier2Id]);
  useEffect(() => getTeams({ variables: { input: { runId } } }), [getTeams, runId]);
  useEffect(() => {
    if (product.id) {
      getPackagings({ variables: { input: { productId: product.id } } });
    }
  }, [getPackagings, product.id]);
  useEffect(() => {
    if (product.id && product.packagingId) {
      console.log('Loading stock for:', { productId: product.id, packagingId: product.packagingId });
      getStock({ variables: { input: { productId: product.id, packagingId: product.packagingId } } });
    }
  }, [getStock, product.id, product.packagingId]);
  useEffect(() => {
    if (runId && product.packagingId && selectedAgents.length > 0) {
      const validAgents = selectedAgents.filter(agent => agent && agent.trim() !== '');
      if (validAgents.length > 0) {
        getAllocations({ variables: { input: { runId, packagingId: product.packagingId, agents: validAgents } } });
      }
    }
  }, [getAllocations, runId, product.packagingId, selectedAgents]);
  useEffect(() => {
    if (allocation?.entries) {
      const _allocations: IAllocations[] = [];

      let _allocationTotal = 0;

      for (let i = 0; i < allocation.entries.length; i+=1) {
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

  // Add this useEffect to debug stock data
  useEffect(() => {
    console.log('Stock data updated:', stock);
  }, [stock]);

  useEffect(() => {
    // Load agents when the component mounts
    if (runId) {
      getAgents({ variables: { input: { search, runId, teamId, page: 0, pageSize: 10 } } });
    }
  }, [runId, teamId, getAgents]);

  return (
    <>
      <div className="row">
        <div className="col-md-5">
          <div className="card border border-primary">
            <div className="card-body">
              {loadingTeams ? (
                <LoadingSpan />
              ) : (
                <div className="mb-3">
                  <p>Filter by team</p>
                  <select
                    id="team"
                    className="form-select mt-2"
                    aria-label="Filter By Team"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                  >
                    <option/>
                    {teams?.rows.map((team: any, index: number) => (
                      <option value={team.id} key={`team-${index}`}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="app-search mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    id="top-search"
                    className="form-control dropdown-toggle"
                    placeholder="Search agent..."
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)}
                  />
                  <span className="mdi mdi-magnify search-icon"/>
                  <button
                    className="input-group-text btn-primary"
                    type="button"
                    disabled={loadingAgents}
                    onClick={() => loadAgents(0, 10)}
                  >
                    {loadingAgents && (
                      <>
                        <i className="spinner-border spinner-border-sm me-1" role="status" />
                        Loading
                      </>
                    )}

                    {!loadingAgents && <>Search</>}
                  </button>
                </div>
              </div>

              <hr className="mb-2" />

              <TableContainer component={Paper}>
                <Table size="small" aria-label="agents table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Agent</TableCell>
                      <TableCell align="right">Select</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agents?.rows.map((row: any, index: number) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
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
                        <TableCell align="right">
                          <Checkbox
                            checked={selectedAgents.includes(row.agent?.id)}
                            onChange={() => {
                              const agentId = row.agent?.id;
                              
                              if (agentId) {
                                const newSelectedAgents = selectedAgents.includes(agentId)
                                  ? selectedAgents.filter((id) => id !== agentId)
                                  : [...selectedAgents, agentId];
                                setSelectedAgents(newSelectedAgents);
                              }
                            }}
                          />
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
          <div className="card border-primary border">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {loadingProducts ? (
                    <LoadingSpan />
                  ) : (
                    <div className="form-floating mb-3">
                      <select
                        id="product"
                        className="form-select"
                        aria-label="Product"
                        defaultValue={product.id}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            id: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option/>
                        {products?.rows.map((_product: any, index: number) => (
                          <option value={_product.id} key={`product-${index}`}>
                            {_product.name}
                          </option>
                        ))}
                      </select>
                      <p>Product</p>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  {loadingPackagings ? (
                    <LoadingSpan />
                  ) : (
                    <div className="form-floating mb-3">
                      <select
                        id="packaging"
                        className="form-select"
                        aria-label="Packaging"
                        defaultValue={product.packagingId}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            packagingId: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option/>
                        {packagings?.rows.map((packaging: any, index: number) => (
                          <option key={`packaging-${index}`} value={packaging.id}>
                            {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                          </option>
                        ))}
                      </select>
                      <p>Packaging</p>
                    </div>
                  )}
                </div>
              </div>

              <hr className="mt-0 mb-0" />

              <h5 className="mb-0">
                Allocated {allocationTotal} of {stock?.balPackage ? stock.balPackage : 0} units
                {loadingStock && <span className="ms-2"><LoadingSpan /></span>}
              </h5>
            </div>
          </div>

          <div className="card border-primary border">
            <div className="card-body">
              <h5 className="card-title">
                <span className="text-uppercase">Allocations</span>
                {loadingAllocations ? <LoadingSpan /> : undefined}

                <span className="float-end">
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="bulkFill"
                      disabled={allocation?.canBulkFill}
                      onClick={() => setBulkFill(!bulkFill)}
                    />
                    <p className="form-check-label" style={{ marginTop: '3px' }}>
                      Bulk Fill
                    </p>
                  </div>
                </span>
              </h5>

              <hr className="mt-0 mb-1" />

              <div className="mb-2">
                {allocations?.map((_allocation: IAllocations, index: number) => (
                  <div key={`allocation-${index}`}>
                    <dl className="row mb-0">
                      <dt className="col-sm-8">
                        <span className="me-2">{_allocation.index}.</span>
                        <Image
                          className="me-2 mt-1 mb-1"
                          src={sourceImage(_allocation.photo)}
                          loader={() => sourceImage(_allocation.photo)}
                          alt=""
                          width={TABLE_IMAGE_WIDTH}
                          height={TABLE_IMAGE_HEIGHT}
                        />
                        {_allocation.name}
                      </dt>
                      <dd className="col-sm-4">
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control form-control-sm font-14"
                            disabled
                            placeholder={`Sold: ${_allocation.sold}`}
                          />
                          <input
                            type="number"
                            id="quantity-1"
                            className="form-control form-control-sm font-14"
                            min={_allocation.sold}
                            value={_allocation.allocated}
                            onChange={(e) => handleChange(_allocation.id, e)}
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

          <MutationButton
            type="button"
            size="sm"
            label="Save"
            icon="mdi mdi-refresh"
            className="float-end"
            loading={allocating}
            onClick={handleAllocate}
          />
        </div>
      </div>
    </>
  );
};
