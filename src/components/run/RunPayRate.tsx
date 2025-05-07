'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { GQLMutation, GQLQuery } from '@/lib/client';
import { DataTable } from '../DataTable';
import { sourceImage } from '@/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import { PAY_RATE, PAY_RATE_UPSERT } from '@/lib/mutations/pay-rate.mutation';
import { InputPayRateUpsert } from '@/lib/interface/pay-rate.interface';
import { MutationButton } from '../MutationButton';
import { Q_PAYMENT_DURATIONS, Q_PAYMENT_INTERVALS } from '@/lib/queries/general.query';

export const RunPayRate: FC<{ runId: string }> = ({ runId }) => {
  const { data: durations } = GQLQuery({
    query: Q_PAYMENT_DURATIONS,
    queryAction: 'paymentDurations',
  });
  const { data: intervals } = GQLQuery({
    query: Q_PAYMENT_INTERVALS,
    queryAction: 'paymentIntervals',
  });
  const { action: getPayRate, data: payRate } = GQLMutation({
    mutation: PAY_RATE,
    resolver: 'payRate',
    toastmsg: false,
  });
  const {
    action: upsert,
    loading: upserting,
    data: upserted,
  } = GQLMutation({
    mutation: PAY_RATE_UPSERT,
    resolver: 'payRateUpsert',
    toastmsg: true,
  });

  const [input, setInput] = useState<InputPayRateUpsert>({
    amount: undefined,
    amountDuration: undefined,
    interval: undefined,
    intervalUnit: undefined,
  });

  const loadPayRate = () => {
    if (runId) getPayRate({ variables: { input: { runId } } });
  };
  const handleUpsert = () => {
    if (runId) {
      upsert({ variables: { input: { ...input, runId } } });
    }
  };

  useEffect(() => loadPayRate(), [upserted]);
  useEffect(() => {
    if (payRate) {
      setInput({
        amount: payRate.amount,
        amountDuration: payRate.amountDuration,
        interval: payRate.interval,
        intervalUnit: payRate.intervalUnit,
      });
    }
  }, [payRate]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="amount"
                placeholder=" "
                defaultValue={input.amount}
                onChange={(e) => setInput({ ...input, amount: e.target.value })}
              />
              <label htmlFor="amount">Payment Amount</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <select
                className="form-select"
                id="amountDuration"
                aria-label="Amount Duration"
                defaultValue={input.amountDuration}
                onChange={(e) => setInput({ ...input, amountDuration: e.target.value })}
              >
                <option></option>
                {durations?.map((duration: any, index: number) => (
                  <option
                    key={`duration-${index}`}
                    value={duration.code}
                    selected={duration.code === input.amountDuration}
                  >
                    {duration.label}
                  </option>
                ))}
              </select>
              <label htmlFor="amountDuration">Payment Duration</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="interval"
                placeholder=" "
                defaultValue={input.interval}
                onChange={(e) =>
                  setInput({ ...input, interval: e.target.value ? parseInt(e.target.value) : 0 })
                }
              />
              <label htmlFor="interval">Payment Interval</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3">
              <select
                className="form-select"
                id="intervalUnit"
                aria-label="Interval Unit"
                defaultValue={input.intervalUnit}
                onChange={(e) => setInput({ ...input, intervalUnit: e.target.value })}
              >
                <option></option>
                {intervals?.map((interval: any, index: number) => (
                  <option
                    key={`interval-${index}`}
                    value={interval.code}
                    selected={interval.code === input.intervalUnit}
                  >
                    {interval.label}
                  </option>
                ))}
              </select>
              <label htmlFor="intervalUnit">Payment Interval Unit</label>
            </div>
          </div>
        </div>
        <MutationButton
          type="button"
          size="sm"
          label="Save"
          icon="mdi mdi-refresh"
          className="float-end"
          loading={upserting}
          onClick={handleUpsert}
        />
      </div>
    </div>
  );
};
