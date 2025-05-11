'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { M_PRODUCTS_MINI } from 'src/lib/mutations/product.mutation';
import { INVENTORY_COUNTER_ENTRY } from 'src/lib/mutations/inventory.mutation';
import { M_STOCK_BALANCE } from 'src/lib/mutations/inventory-allocation.mutation';
import { M_PACKAGINGS_MINI } from 'src/lib/mutations/packaging.mutation';
import { IInventoryCounterEntry } from 'src/lib/interface/general.interface';
import { sourceImage } from 'src/lib/server';
import { commafy } from 'src/lib/helpers';
import { SearchRunOffer } from '../SearchRunOffer';
import { MutationButton } from '../MutationButton';
import { LoadingSpan } from '../LoadingSpan';

export const RunStockCounterEntry: FC<IInventoryCounterEntry> = ({ runId, clientTier2Id }) => {
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
    action: getStock,
    loading: loadingStock,
    data: stock,
  } = GQLMutation({
    mutation: M_STOCK_BALANCE,
    resolver: 'stockBalance',
    toastmsg: false,
  });
  const { action: counter, loading: countering } = GQLMutation({
    mutation: INVENTORY_COUNTER_ENTRY,
    resolver: 'inventoryCounterEntry',
    toastmsg: true,
  });

  const [input, setInput] = useState<{
    agentId?: string;
    productId?: string;
    packagingId?: string;
    quantity: number;
    notes?: string;
  }>({
    agentId: undefined,
    productId: undefined,
    packagingId: undefined,
    quantity: 0,
    notes: undefined,
  });
  const [selectedOffer, setSelectedOffer] = useState<any>();

  const handleCounter = () => {
    if (runId && selectedOffer?.agent?.id) {
      counter({ variables: { input: { ...input, runId, agentId: selectedOffer.agent.id } } });
    }
  };

  useEffect(() => getProducts({ variables: { input: { clientTier2Id } } }), [getProducts, clientTier2Id]);
  useEffect(() => getPackagings({ variables: { input: { productId: input.productId } } }), [getPackagings, input.productId]);
  useEffect(() => {
    if (runId && selectedOffer?.agent?.id && input.packagingId) {
      getStock({
        variables: {
          input: {
            runId,
            agentId: selectedOffer.agent.id,
            packagingId: input.packagingId,
          },
        },
      });
    }
  }, [runId, selectedOffer?.agent?.id, input.productId, input.packagingId, getStock]);

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <SearchRunOffer runId={runId} setSelectedOffer={setSelectedOffer} />
        </div>

        <div className="col-md-8">
          {selectedOffer ? (
            <div className="card border-primary border">
              <div className="card-body p-2 pt-1">
                <div className="d-flex align-items-start mt-1 mb-0">
                  <Image
                    className="rounded-circle me-3"
                    src={sourceImage(selectedOffer?.agent?.user?.profile?.photo?.fileName)}
                    loader={() => sourceImage(selectedOffer?.agent?.user?.profile?.photo?.fileName)}
                    alt=""
                    width={32}
                    height={32}
                  />
                  <div className="w-100 overflow-hidden">
                    <span className="badge badge-warning-lighten float-end font-13 p-1">
                      Sold
                      {loadingStock && <LoadingSpan />}
                      {stock?.balAgentRunPackaging ? commafy(stock.balAgentRunPackaging) : ''} units
                    </span>
                    <h5 className="mt-0 mb-0">{selectedOffer?.agent?.user?.name}</h5>
                    <span className="text-muted font-13">{selectedOffer?.agent?.user?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning text-center mt-0 mb-3" role="alert">
              Please search and select an agent to counter stock
            </div>
          )}

          <div className="card border-primary border">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  {loadingProducts ? (
                    <LoadingSpan />
                  ) : (
                    <div className="form-floating mb-3">
                      <select
                        id="product"
                        className="form-select"
                        aria-label="Product"
                        defaultValue={input.productId}
                        onChange={(e) =>
                          setInput({
                            ...input,
                            productId: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        {products?.rows.map((product: any, index: number) => (
                          <option value={product.id} key={`product-${index}`}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <p>Product</p>
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  {loadingPackagings ? (
                    <LoadingSpan />
                  ) : (
                    <div className="form-floating mb-3">
                      <select
                        id="packaging"
                        className="form-select"
                        aria-label="Packaging"
                        defaultValue={input.packagingId}
                        onChange={(e) =>
                          setInput({
                            ...input,
                            packagingId: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option>Select</option>
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
                <div className="col-md-4">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      aria-label="Quantity"
                      defaultValue={input.quantity}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          quantity: e.target.value === '' ? 0 : parseFloat(e.target.value),
                        })
                      }
                    />
                    <p>Quantity</p>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-floating mb-3">
                    <textarea
                      id="quantity"
                      className="form-control"
                      aria-label="Reasons / Notes"
                      defaultValue={input.notes}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          notes: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    />
                    <p>Reasons / Notes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <MutationButton
            type="button"
            size="sm"
            label="Post Counter Entry"
            icon="mdi mdi-plus"
            className="float-end"
            loading={countering}
            onClick={handleCounter}
          />
        </div>
      </div>
    </>
  );
};
