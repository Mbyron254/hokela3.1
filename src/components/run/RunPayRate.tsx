'use client';

import { FC, useEffect, useState } from 'react';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { PAY_RATE, PAY_RATE_UPSERT } from 'src/lib/mutations/pay-rate.mutation';
import { InputPayRateUpsert } from 'src/lib/interface/pay-rate.interface';
import { Q_PAYMENT_DURATIONS, Q_PAYMENT_INTERVALS } from 'src/lib/queries/general.query';
import { MutationButton } from '../MutationButton';

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

  const handleUpsert = () => {
    if (runId) {
      upsert({ variables: { input: { ...input, runId } } });
    }
  };

  useEffect(() => {
    if (runId) getPayRate({ variables: { input: { runId } } });
  }, [runId, getPayRate]);
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
              <p>Payment Amount</p>
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
                <option value="">Select Duration</option>
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
              <p>Payment Duration</p>
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
                  setInput({ ...input, interval: e.target.value ? parseInt(e.target.value,10) : 0 })
                }
              />
              <p>Payment Interval</p>
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
                <option value="">Select Interval Unit</option>
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
              <p>Payment Interval Unit</p>
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
