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
import { 
  Box, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  CircularProgress, 
  Button,
  FormControlLabel
} from '@mui/material';


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
  }, [runId, teamId, getAgents, search ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Card variant="outlined">
          <CardContent>
            {loadingTeams ? (
              <CircularProgress />
            ) : (
              <FormControl fullWidth variant="outlined" margin="normal">
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

            <TextField
              fullWidth
              id="top-search"
              label="Search agent..."
              variant="outlined"
              margin="normal"
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
                    {loadingAgents ? <CircularProgress size={24} /> : 'Search'}
                  </Button>
                ),
              }}
            />

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
                          <Typography variant="subtitle1">{row.agent?.user?.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{row.agent?.user?.email}</Typography>
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
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ flex: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth variant="outlined" margin="normal">
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
                  {products?.rows.map((_product: any, index: number) => (
                    <MenuItem value={_product.id} key={`product-${index}`}>
                      {_product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal">
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
            </Box>

            <Typography variant="h6" gutterBottom>
              Allocated {allocationTotal} of {stock?.balPackage ? stock.balPackage : 0} units
              {loadingStock && <CircularProgress size={24} />}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Allocations
              {loadingAllocations && <CircularProgress size={24} />}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bulkFill}
                    onChange={() => setBulkFill(!bulkFill)}
                    disabled={!allocation?.canBulkFill}
                  />
                }
                label="Bulk Fill"
                sx={{ float: 'right' }}
              />
            </Typography>

            {allocations?.map((_allocation: IAllocations, index: number) => (
              <Box key={`allocation-${index}`} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1">{_allocation.index}.</Typography>
                  <Image
                    className="me-2 mt-1 mb-1"
                    src={sourceImage(_allocation.photo)}
                    loader={() => sourceImage(_allocation.photo)}
                    alt=""
                    width={TABLE_IMAGE_WIDTH}
                    height={TABLE_IMAGE_HEIGHT}
                  />
                  <Typography variant="body1">{_allocation.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label={`Sold: ${_allocation.sold}`}
                    disabled
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    value={_allocation.allocated}
                    onChange={(e) => handleChange(_allocation.id, e)}
                    inputProps={{ min: _allocation.sold }}
                  />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<i className="mdi mdi-refresh" />}
          onClick={handleAllocate}
          disabled={allocating}
          sx={{ mt: 2, float: 'right' }}
        >
          {allocating ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};
