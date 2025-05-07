'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { MutationButton } from '../MutationButton';
import {
  ALLOCATE_INVENTORY,
  M_AGENTS_ALLOCATIONS,
  M_STOCK_BALANCE,
} from '@/lib/mutations/inventory-allocation.mutation';
import { GQLMutation } from '@/lib/client';
import { M_PRODUCTS_MINI } from '@/lib/mutations/product.mutation';
import { M_CAMPAIGN_AGENTS } from '@/lib/mutations/run-offer.mutation';
import { sourceImage } from '@/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import { M_PACKAGINGS_MINI } from '@/lib/mutations/packaging.mutation';
import { LoadingSpan } from '../LoadingSpan';
import { IAllocations, IInventoryAllocation } from '@/lib/interface/general.interface';
import { DataTable } from '../DataTable';
import { M_RUN_TEAMS_MINI } from '@/lib/mutations/run-team.mutation';

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
      getStock({
        variables: {
          input: { productId: product.id, packagingId: product.packagingId },
        },
      });
    }
  };
  const loadAllocations = () => {
    if (runId && product.id && product.packagingId && selectedAgents) {
      getAllocations({
        variables: {
          input: {
            runId,
            packagingId: product.packagingId,
            agents: selectedAgents,
          },
        },
      });
    }
  };
  const handleAllocate = () => {
    if (allocations.length) {
      const _allocations: { agentId: string; quantity: number }[] = [];

      for (let x = 0; x < allocations.length; x++) {
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

    for (let i = 0; i < _curr.length; i++) {
      if (bulkFill) {
        _curr[i].allocated = parseInt(event.target.value) | 0;
      } else {
        if (_curr[i].id === id) {
          const newAllocation = parseInt(event.target.value) | 0;

          _curr[i].allocated = newAllocation < _curr[i].sold ? _curr[i].sold : newAllocation;
        }
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

  useEffect(() => loadProducts(), []);
  useEffect(() => loadTeams(), [runId]);
  useEffect(() => loadPackagings(), [product.id]);
  useEffect(() => loadStock(), [product.id, product.packagingId]);
  useEffect(() => loadAllocations(), [product.id, product.packagingId, selectedAgents]);
  useEffect(() => {
    if (allocation?.entries) {
      const _allocations: IAllocations[] = [];

      let _allocationTotal = 0;

      for (let i = 0; i < allocation.entries.length; i++) {
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
              {loadingTeams ? (
                <LoadingSpan />
              ) : (
                <div className="mb-3">
                  <label htmlFor="team">Filter by team</label>
                  <select
                    id="team"
                    className="form-select mt-2"
                    aria-label="Filter By Team"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                  >
                    <option></option>
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
                  <span className="mdi mdi-magnify search-icon"></span>
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

              <DataTable
                selectorParent1="agent"
                selectable={true}
                dense={true}
                fixedHeader={true}
                columns={columns}
                data={agents?.rows}
                totalRows={agents?.count}
                setSelected={setSelectedAgents}
                loading={loadingAgents}
                handleReloadMutation={loadAgents}
                reloadTriggers={[runId, teamId]}
              />
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
                        <option></option>
                        {products?.rows.map((product: any, index: number) => (
                          <option value={product.id} key={`product-${index}`}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="product">Product</label>
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
                        <option></option>
                        {packagings?.rows.map((packaging: any, index: number) => (
                          <option key={`packaging-${index}`} value={packaging.id}>
                            {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="packaging">Packaging</label>
                    </div>
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
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="bulkFill"
                      disabled={allocation?.canBulkFill}
                      onClick={() => setBulkFill(!bulkFill)}
                    />
                    <label className="form-check-label" htmlFor="bulkFill" style={{ marginTop: '3px' }}>
                      Bulk Fill
                    </label>
                  </div>
                </span>
              </h5>

              <hr className="mt-0 mb-1" />

              <div className="mb-2">
                {allocations?.map((allocation: any, index: number) => (
                  <div key={`allocation-${index}`}>
                    <dl className="row mb-0">
                      <dt className="col-sm-8">
                        <span className="me-2">{allocation.index}.</span>
                        <Image
                          className="me-2 mt-1 mb-1"
                          src={sourceImage(allocation.photo)}
                          loader={() => sourceImage(allocation.photo)}
                          alt=""
                          width={TABLE_IMAGE_WIDTH}
                          height={TABLE_IMAGE_HEIGHT}
                        />
                        {allocation.name}
                      </dt>
                      <dd className="col-sm-4">
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control form-control-sm font-14"
                            disabled={true}
                            placeholder={`Sold: ${allocation.sold}`}
                          />
                          <input
                            type="number"
                            id="quantity-1"
                            className="form-control form-control-sm font-14"
                            min={allocation.sold}
                            value={allocation.allocated}
                            onChange={(e) => handleChange(allocation.id, e)}
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
