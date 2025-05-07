'use client';

import { FC, useEffect, useState } from 'react';
import { GQLMutation } from '@/lib/client';
import { KPI_CONFIG_RUN_UPDATE, KPI_CONFIG_RUNS, PAY_RATE } from '@/lib/mutations/pay-rate.mutation';
import { InputKPIConfig } from '@/lib/interface/pay-rate.interface';
import { MutationButton } from '../MutationButton';
import { commafy } from '@/lib/helpers';

export const RunKPIs: FC<{ runId: string }> = ({ runId }) => {
  const { action: getConfigurations, data: configurations } = GQLMutation({
    mutation: KPI_CONFIG_RUNS,
    resolver: 'kpiConfigRuns',
    toastmsg: false,
  });
  const { action: getPayRate, data: payRate } = GQLMutation({
    mutation: PAY_RATE,
    resolver: 'payRate',
    toastmsg: false,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: KPI_CONFIG_RUN_UPDATE,
    resolver: 'kpiConfigRunUpdate',
    toastmsg: true,
  });

  const [configs, setConfigs] = useState<InputKPIConfig[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadConfigurations = () => {
    if (runId) getConfigurations({ variables: { input: { runId } } });
  };
  const loadPayRate = () => {
    if (runId) getPayRate({ variables: { input: { runId } } });
  };
  const handleUpdate = () => {
    for (let i = 0; i < configs.length; i++) delete configs[i]._label;

    update({ variables: { input: { configs } } });
  };
  const handleChange = (id: string, event: any) => {
    const _curr: InputKPIConfig[] = [...configs];

    let _total = 0;

    for (let i = 0; i < _curr.length; i++) {
      if (_curr[i].id === id) {
        _curr[i].percentage = parseInt(event.target.value) | 0;
      }

      _total += _curr[i].percentage!;
    }

    setConfigs(_curr);
    setTotal(_total);
  };

  useEffect(() => loadPayRate(), []);
  useEffect(() => loadConfigurations(), [updated]);
  useEffect(() => {
    if (configurations) {
      const _configs = [];

      let _total = 0;

      for (let i = 0; i < configurations.rows.length; i++) {
        _total += configurations.rows[i].percentage;

        _configs.push({
          _label: configurations.rows[i].kpi?.label,
          id: configurations.rows[i].id,
          percentage: configurations.rows[i].percentage,
        });
      }

      setConfigs(_configs);
      setTotal(_total);
    }
  }, [configurations]);

  return (
    <div className="card">
      <div className="card-body">
        {payRate && total !== 100 && (
          <div className="alert alert-warning bg-transparent text-warning text-center" role="alert">
            <strong>Pending Allocation: {100 - total}%</strong> (ksh{' '}
            {commafy(((100 - total) / 100) * parseFloat(payRate.amount))})
          </div>
        )}

        <div className="mb-2">
          {configs?.map((config: any, index: number) => (
            <div key={`allocation-${index}`}>
              <dl className="row mb-0">
                <dt className="col-sm-8">
                  <span className="me-2">{index + 1}.</span>
                  {config._label}
                </dt>
                <dd className="col-sm-4">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control form-control-sm font-14"
                      disabled={true}
                      placeholder={`ksh: ${
                        payRate
                          ? commafy((parseInt(config.percentage) / 100) * parseFloat(payRate.amount))
                          : 0
                      }`}
                    />
                    <input
                      type="number"
                      id="percentage-1"
                      className="form-control form-control-sm font-14 me-1"
                      min={0}
                      max={100}
                      value={config.percentage}
                      onChange={(e) => handleChange(config.id, e)}
                    />
                    <span className="font-16 mt-1">%</span>
                  </div>
                </dd>
              </dl>

              <hr className="mt-0 mb-1" />
            </div>
          ))}
        </div>

        {total === 100 && (
          <MutationButton
            type="button"
            size="sm"
            label="Save"
            icon="mdi mdi-refresh"
            className="float-end"
            loading={updating}
            onClick={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};
