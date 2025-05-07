import { gql } from '@apollo/client';

export const Q_RUN_SALES_CHART = gql`
  query runSalesChart($input: InputRunSales!) {
    runSalesChart(input: $input) {
      labels
      dailyVolume
      dailyAmount
    }
  }
`;

export const Q_AGENT_RUN_SALES_CHART = gql`
  query agentRunSalesChart($input: InputAgentRunSales!) {
    agentRunSalesChart(input: $input) {
      labels
      dailyVolume
      dailyAmount
    }
  }
`;
