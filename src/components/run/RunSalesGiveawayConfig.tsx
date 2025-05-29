'use client';

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import {
  SALES_GIVEAWAY_CONFIG,
  SALES_GIVEAWAY_CONFIG_CREATE,
  SALES_GIVEAWAY_CONFIG_RECYCLE,
  SALES_GIVEAWAY_CONFIG_RESTORE,
  SALES_GIVEAWAY_CONFIG_UPDATE,
  SALES_GIVEAWAY_CONFIGS_ACTIVE,
  SALES_GIVEAWAY_CONFIGS_RECYCLED,
} from 'src/lib/mutations/sales-giveaway.mutation';
import { IInputConfigCreate, IInputConfigUpdate } from 'src/lib/interface/general.interface';
import { M_PRODUCTS_MINI } from 'src/lib/mutations/product.mutation';
import { M_PACKAGINGS_MINI } from 'src/lib/mutations/packaging.mutation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MutationButton } from '../MutationButton';
import { LoadingDiv } from '../LoadingDiv';

export const RunSalesGiveawayConfig: FC<{
  clientTier2Id: string;
  runId: string;
}> = ({ clientTier2Id, runId }) => {
  const { action: getProductsTarget, data: productsTarget } = GQLMutation({
    mutation: M_PRODUCTS_MINI,
    resolver: 'm_products',
    toastmsg: false,
  });
  const { action: getProductsGiveaway, data: productsGiveaway } = GQLMutation({
    mutation: M_PRODUCTS_MINI,
    resolver: 'm_products',
    toastmsg: false,
  });
  const { action: getPackagingsTarget, data: packagingsTarget } = GQLMutation({
    mutation: M_PACKAGINGS_MINI,
    resolver: 'm_packagings',
    toastmsg: false,
  });
  const { action: getPackagingsGiveaway, data: packagingsGiveaway } = GQLMutation({
    mutation: M_PACKAGINGS_MINI,
    resolver: 'm_packagings',
    toastmsg: false,
  });
  const {
    action: getConfigsActive,
    loading: loadingConfigsActive,
    data: configsActive,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIGS_ACTIVE,
    resolver: 'salesGiveawayConfigs',
    toastmsg: false,
  });
  const {
    action: getConfigsRecycled,
    loading: loadingConfigsRecycled,
    data: configsRecycled,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIGS_RECYCLED,
    resolver: 'salesGiveawayConfigsRecycled',
    toastmsg: false,
  });
  const {
    action: getConfig,
    loading: loadingConfig,
    data: config,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIG,
    resolver: 'salesGiveawayConfig',
    toastmsg: false,
  });
  const {
    action: createConfig,
    loading: creatingConfig,
    data: createdConfig,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIG_CREATE,
    resolver: 'salesGiveawayConfigCreate',
    toastmsg: true,
  });
  const {
    action: updateConfig,
    loading: updatingConfig,
    data: updatedConfig,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIG_UPDATE,
    resolver: 'salesGiveawayConfigUpdate',
    toastmsg: true,
  });
  const {
    action: recycleConfig,
    loading: recyclingConfig,
    data: recycledConfig,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIG_RECYCLE,
    resolver: 'salesGiveawayConfigRecycle',
    toastmsg: true,
  });
  const {
    action: restoreConfig,
    loading: restoringConfig,
    data: restoredConfig,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_CONFIG_RESTORE,
    resolver: 'salesGiveawayConfigRestore',
    toastmsg: true,
  });

  const init: IInputConfigUpdate = {
    id: undefined,
    salePackagingId: undefined,
    saleUnits: undefined,
    giveawayPackagingId: undefined,
    giveawayUnits: undefined,
  };
  const [inputConfigUpdate, setInputConfigUpdate] = useState<IInputConfigUpdate>(init);
  const [inputConfigCreate, setInputConfigCreate] = useState<IInputConfigCreate>({
    salePackagingId: undefined,
    saleUnits: undefined,
    giveawayPackagingId: undefined,
    giveawayUnits: undefined,
  });
  const [selectedActive, setSelectedActive] = useState<string[]>([]);
  const [selectedRecycled, setSelectedRecycled] = useState<string[]>([]);
  const [productTarget, setProductTarget] = useState<{
    id?: string;
    packagingId?: string;
  }>({ id: undefined, packagingId: undefined });
  const [productGiveaway, setProductGiveaway] = useState<{
    id?: string;
    packagingId?: string;
  }>({ id: undefined, packagingId: undefined });

  const [tabIndex, setTabIndex] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleConfigCreate = () => {
    if (runId) {
      createConfig({ variables: { input: { ...inputConfigCreate, runId } } });
    }
  };
  const handleConfigUpdate = () => {
    updateConfig({ variables: { input: inputConfigUpdate } });
  };
  const handleConfigRecycle = () => {
    if (selectedActive.length) {
      recycleConfig({ variables: { input: { ids: selectedActive } } });
    }
  };
  const handleConfigRestore = () => {
    if (selectedRecycled.length) {
      restoreConfig({ variables: { input: { ids: selectedRecycled } } });
    }
  };

  const loadConfig = (id: string) => {
    getConfig({ variables: { input: { id } } });
  };

  useEffect(() => {
    if (runId) {
      getConfigsActive({ variables: { input: { runId } } });
    }
  },[getConfigsActive, runId])
  useEffect(() => {
    if (runId) {
      getConfigsRecycled({ variables: { input: { runId } } });
    }
  },[getConfigsRecycled, runId])
  useEffect(() => {
    getProductsTarget({ variables: { input: { clientTier2Id } } });
  }, [getProductsTarget, clientTier2Id]);

  useEffect(() => {
    getProductsGiveaway({ variables: { input: { clientTier2Id } } });
  }, [getProductsGiveaway, clientTier2Id]);

  useEffect(() => {
    if (productTarget.id) {
      getPackagingsTarget({
        variables: { input: { productId: productTarget.id } },
      });
    }
  },[getPackagingsTarget, productTarget.id])
  useEffect(() => {
    if (productGiveaway.id) {
      getPackagingsGiveaway({
        variables: { input: { productId: productGiveaway.id } },
      });
    }
  },[getPackagingsGiveaway, productGiveaway.id])

  useEffect(() => {
    if (config) {
      setInputConfigUpdate({
        id: config.id,
        salePackagingId: config.salePackaging.id,
        saleUnits: config.saleUnits,
        giveawayPackagingId: config.giveawayPackaging.id,
        giveawayUnits: config.giveawayUnits,
      });
      setProductTarget(config.salePackaging.product.id);
      setProductGiveaway(config.giveawayPackaging.product.id);
    }
  }, [config]);

  const columnsActive = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'TARGET PRODUCT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => (
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.salePackaging?.product?.name}</h6>
            <span className="font-13">
              {row.salePackaging?.unitQuantity} {row.salePackaging?.unit?.name}
            </span>
          </div>
        )
    },
    {
      name: 'TARGET SALE UNITS',
      sortable: true,
      right: true,
      selector: (row: any) => row.saleUnits,
      cell: (row: any) => row.saleUnits,
    },
    {
      name: 'GIVEAWAY PRODUCT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => (
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.giveawayPackaging?.product?.name}</h6>
            <span className="font-13">
              {row.giveawayPackaging?.unitQuantity} {row.giveawayPackaging?.unit?.name}
            </span>
          </div>
        )
    },
    {
      name: 'GIVEAWAY UNITS',
      sortable: true,
      right: true,
      selector: (row: any) => row.giveawayUnits,
      cell: (row: any) => row.giveawayUnits,
    },
    {
      name: 'MORE',
      sortable: false,
      wrap: true,
      selector: (row: any) => row.id,
      cell: (row: any) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#update-modal"
          onClick={() => {
            loadConfig(row.id);
            setInputConfigUpdate(init);
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
      name: 'TARGET PRODUCT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => (
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.salePackaging?.product?.name}</h6>
            <span className="font-13">
              {row.salePackaging?.unitQuantity} {row.salePackaging?.unit?.name}
            </span>
          </div>
        )
    },
    {
      name: 'TARGET SALE UNITS',
      sortable: true,
      right: true,
      selector: (row: any) => row.saleUnits,
      cell: (row: any) => row.saleUnits,
    },
    {
      name: 'GIVEAWAY PRODUCT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.name,
      cell: (row: any) => (
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.giveawayPackaging?.product?.name}</h6>
            <span className="font-13">
              {row.giveawayPackaging?.unitQuantity} {row.giveawayPackaging?.unit?.name}
            </span>
          </div>
        )
      
    },
    {
      name: 'GIVEAWAY UNITS',
      sortable: true,
      right: true,
      selector: (row: any) => row.giveawayUnits,
      cell: (row: any) => row.giveawayUnits,
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
    getProductsTarget({ variables: { input: { clientTier2Id } } });
    getProductsGiveaway({ variables: { input: { clientTier2Id } } });
  }, [clientTier2Id, getProductsTarget, getProductsGiveaway]);
  useEffect(() => {
    if (productTarget.id) {
      getPackagingsTarget({
        variables: { input: { productId: productTarget.id } },
      });
    }
  }, [productTarget.id, getPackagingsTarget]);
  useEffect(() => {
    if (productGiveaway.id) {
      getPackagingsGiveaway({
        variables: { input: { productId: productGiveaway.id } },
      });
    }
  }, [productGiveaway.id, getPackagingsGiveaway]);
  useEffect(() => {
    if (config) {
      setInputConfigUpdate({
        id: config.id,
        salePackagingId: config.salePackaging.id,
        saleUnits: config.saleUnits,
        giveawayPackagingId: config.giveawayPackaging.id,
        giveawayUnits: config.giveawayUnits,
      });
      setProductTarget(config.salePackaging.product.id);
      setProductGiveaway(config.giveawayPackaging.product.id);
    }
  }, [config]);

  return (
    <div className="row">
      <div className="col-md-12">
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Active" />
          <Tab label="Recycled" />
        </Tabs>

        <div className="tab-content">
          {/* Active Tab Content */}
          {tabIndex === 0 && (
            <div className="tab-pane show active" id="records-active">
              <div className="btn-group btn-group-sm mb-2">
                <Button variant="outlined" color="success" onClick={() => { setOpenCreateDialog(true); }}>
                  <i className="mdi mdi-plus me-1"/>New
                </Button>
                <Button variant="outlined" color="error" onClick={handleConfigRecycle} disabled={recyclingConfig}>
                  <i className="mdi mdi-trash-can-outline me-1"/>Recycle
                </Button>
              </div>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columnsActive.map((column) => (
                        <TableCell key={column.name}>{column.name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {configsActive?.rows.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.index}</TableCell>
                        <TableCell>{row.salePackaging?.product?.name}</TableCell>
                        <TableCell>{row.saleUnits}</TableCell>
                        <TableCell>{row.giveawayPackaging?.product?.name}</TableCell>
                        <TableCell>{row.giveawayUnits}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" onClick={() => { loadConfig(row.id); setInputConfigUpdate(init); }}>
                            <i className="mdi mdi-pen"/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}

          {/* Recycled Tab Content */}
          {tabIndex === 1 && (
            <div className="tab-pane show active" id="records-recycled">
              <div className="btn-group btn-group-sm mb-2">
                <Button variant="outlined" color="warning" onClick={handleConfigRestore} disabled={restoringConfig}>
                  <i className="mdi mdi-restore me-1"/>Restore
                </Button>
              </div>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columnsRecycled.map((column) => (
                        <TableCell key={column.name}>{column.name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {configsRecycled?.rows.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.index}</TableCell>
                        <TableCell>{row.salePackaging?.product?.name}</TableCell>
                        <TableCell>{row.saleUnits}</TableCell>
                        <TableCell>{row.giveawayPackaging?.product?.name}</TableCell>
                        <TableCell>{row.giveawayUnits}</TableCell>
                        <TableCell>{row.recycled}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </div>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="lg">
        <DialogTitle>New Configuration</DialogTitle>
        <DialogContent>
          <h5 className="mt-0 mb-2 text-primary">
            <i className="mdi mdi-bullseye-arrow me-1"/>Target Sale
          </h5>

          <div className="card card-border border border-primary">
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="targetProduct"
                      className="form-select"
                      aria-label="Product"
                      defaultValue={productTarget.id}
                      onChange={(e) =>
                        setProductTarget({
                          ...productTarget,
                          id: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Product</option>
                      {productsTarget?.rows.map((product: any, index: number) => (
                        <option value={product.id} key={`product-${index}`}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <p>Target Product</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="targetPackaging"
                      className="form-select"
                      aria-label="Packaging"
                      defaultValue={inputConfigCreate.salePackagingId}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigCreate,
                          salePackagingId: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Packaging</option>
                      {packagingsTarget?.rows.map((packaging: any, index: number) => (
                        <option key={`packaging-${index}`} value={packaging.id}>
                          {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                        </option>
                      ))}
                    </select>
                    <p>Target Packaging</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="saleUnits"
                      defaultValue={inputConfigCreate.saleUnits}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigCreate,
                          saleUnits: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <p>Target Sale Units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mt-0 mb-2 text-primary">
            <i className="mdi mdi-gift-outline me-1"/> Giveaway
          </h5>

          <div className="card card-border border border-primary mb-0">
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="giveawayProduct"
                      className="form-select"
                      aria-label="Product"
                      defaultValue={productGiveaway.id}
                      onChange={(e) =>
                        setProductGiveaway({
                          ...productGiveaway,
                          id: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Product</option>
                      {productsGiveaway?.rows.map((product: any, index: number) => (
                        <option value={product.id} key={`product-${index}`}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <p>Target Product</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="giveawayPackaging"
                      className="form-select"
                      aria-label="Packaging"
                      defaultValue={inputConfigCreate.giveawayPackagingId}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigCreate,
                          giveawayPackagingId: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Packaging</option>
                      {packagingsGiveaway?.rows.map((packaging: any, index: number) => (
                        <option key={`packaging-${index}`} value={packaging.id}>
                          {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                        </option>
                      ))}
                    </select>
                    <p>Target Packaging</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="giveawayUnits"
                      defaultValue={inputConfigCreate.giveawayUnits}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigCreate,
                          giveawayUnits: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <p>Giveaway Units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)} color="secondary">
            Close
          </Button>
          <MutationButton
            type="button"
            className="btn btn-primary"
            size="sm"
            label="Save"
            icon="mdi mdi-plus"
            loading={creatingConfig}
            onClick={handleConfigCreate}
          />
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="lg">
        <DialogTitle>Edit Configuration</DialogTitle>
        <DialogContent>
          {loadingConfig ? (
            <LoadingDiv />
          ) : (
            <h5 className="mt-0 mb-2 text-primary">
              <i className="mdi mdi-bullseye-arrow me-1"/> Target Sale
            </h5>
          )}

          <div className="card card-border border border-primary">
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="targetProduct"
                      className="form-select"
                      aria-label="Product"
                      defaultValue={productTarget.id}
                      onChange={(e) =>
                        setProductTarget({
                          ...productTarget,
                          id: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Product</option>
                      {productsTarget?.rows.map((product: any, index: number) => (
                        <option
                          key={`product-${index}`}
                          value={product.id}
                          selected={product.id === config?.salePackaging?.product?.id}
                        >
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <p>Target Product</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="targetPackaging"
                      className="form-select"
                      aria-label="Packaging"
                      defaultValue={inputConfigUpdate.salePackagingId}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigUpdate,
                          salePackagingId: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Packaging</option>
                      {packagingsTarget?.rows.map((packaging: any, index: number) => (
                        <option
                          key={`packaging-${index}`}
                          value={packaging.id}
                          selected={packaging.id === config?.salePackaging?.id}
                        >
                          {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                        </option>
                      ))}
                    </select>
                    <p>Target Packaging</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="saleUnits"
                      defaultValue={inputConfigUpdate.saleUnits}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigUpdate,
                          saleUnits: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <p>Target Sale Units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mt-0 mb-2 text-primary">
            <i className="mdi mdi-gift-outline me-1"/> Giveaway
          </h5>

          <div className="card card-border border border-primary mb-0">
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="giveawayProduct"
                      className="form-select"
                      aria-label="Product"
                      defaultValue={productGiveaway.id}
                      onChange={(e) =>
                        setProductGiveaway({
                          ...productGiveaway,
                          id: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Product</option>
                      {productsGiveaway?.rows.map((product: any, index: number) => (
                        <option
                          key={`product-${index}`}
                          value={product.id}
                          selected={product.id === config?.giveawayPackaging?.product?.id}
                        >
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <p>Target Product</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <select
                      id="giveawayPackaging"
                      className="form-select"
                      aria-label="Packaging"
                      defaultValue={inputConfigUpdate.giveawayPackagingId}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigUpdate,
                          giveawayPackagingId: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option value="">Select Packaging</option>
                      {packagingsGiveaway?.rows.map((packaging: any, index: number) => (
                        <option
                          key={`packaging-${index}`}
                          value={packaging.id}
                          selected={packaging.id === config?.giveawayPackaging?.id}
                        >
                          {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                        </option>
                      ))}
                    </select>
                    <p>Target Packaging</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="giveawayUnits"
                      defaultValue={inputConfigUpdate.giveawayUnits}
                      onChange={(e) =>
                        setInputConfigCreate({
                          ...inputConfigUpdate,
                          giveawayUnits: e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <p>Giveaway Units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="secondary">
            Close
          </Button>
          <MutationButton
            type="button"
            className="btn btn-primary"
            size="sm"
            label="Update"
            icon="mdi mdi-refresh"
            loading={updatingConfig}
            onClick={handleConfigUpdate}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};
