import { gql } from '@apollo/client';

export const PAY_RATE_UPSERT = gql`
  mutation payRateUpsert($input: InputPayRateUpsert!) {
    payRateUpsert(input: $input) {
      message
    }
  }
`;

export const PAY_RATE = gql`
  mutation payRate($input: InputPayRate!) {
    payRate(input: $input) {
      amount
      amountDuration
      interval
      intervalUnit
    }
  }
`;

export const KPI_CONFIG_RUN_UPDATE = gql`
  mutation kpiConfigRunUpdate($input: InputKPIConfigRunUpdate!) {
    kpiConfigRunUpdate(input: $input) {
      message
    }
  }
`;

export const KPI_CONFIG_RUNS = gql`
  mutation kpiConfigRuns($input: InputKPIConfigs!) {
    kpiConfigRuns(input: $input) {
      count
      rows {
        id
        percentage
        kpi {
          label
        }
      }
    }
  }
`;
