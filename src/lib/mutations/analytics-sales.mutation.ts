import { gql } from '@apollo/client';

export const M_ANALYZE_RUN_SHOPS = gql`
  mutation analyzeRunShops($input: InputAnalyzeRunShops!) {
    analyzeRunShops(input: $input) {
      previousPage
      nextPage
      total
      totalPages
      data {
        totalSoldUnits
        totalSoldValue
        metadata {
          name
          user {
            name
            accountNo
          }
        }
        agents {
          totalSoldUnits
          # totalSoldValue
          # metadata {
          #   user {
          #     name
          #     accountNo
          #     profile {
          #       photo {
          #         fileName
          #       }
          #     }
          #   }
          # }
        }
      }
    }
  }
`;
