import { gql } from '@apollo/client';

export const ALLOCATE_INVENTORY = gql`
  mutation allocateInventory($input: InputInventoryAllocate!) {
    allocateInventory(input: $input) {
      message
    }
  }
`;

export const M_AGENTS_ALLOCATIONS = gql`
  mutation agentsAllocations($input: InputAgentsAllocations!) {
    agentsAllocations(input: $input) {
      canBulkFill
      entries {
        index
        quantityAllocated
        quantitySold
        agent {
          id
          user {
            name
            profile {
              photo {
                fileName
              }
            }
          }
        }
      }
    }
  }
`;

export const M_AGENT_ALLOCATIONS = gql`
  mutation agentAllocations($input: InputAgentAllocations!) {
    agentAllocations(input: $input) {
      index
      id
      quantityAllocated
      quantitySold
      product {
        name
        photos {
          fileName
        }
      }
      packaging {
        unitQuantity
        unit {
          name
        }
      }
    }
  }
`;

export const M_UPDATE_SALE = gql`
  mutation updateSale($input: InputSaleUpdate!) {
    updateSale(input: $input) {
      message
    }
  }
`;

export const M_PRODUCT_STOCK_BALANCE = gql`
  mutation productStockBalance($input: InputProductStockBalance!) {
    productStockBalance(input: $input) {
      balPackage
    }
  }
`;
