import { gql } from '@apollo/client';

export const Q_ANALYZE_RUN_SALES = gql`
  query analyzeRunSales($input: InputAnalyzeRunSales!) {
    analyzeRunSales(input: $input) {
      totalUnitsSold
      totalValueSold

      # totalStockUnitsAllocated
      # totalStockUnitsSold
      # totalStockValueAllocated
      # totalStockValueSold
      # totalNewShopsMapped
      # totalShopsVisited
    }
  }
`;
