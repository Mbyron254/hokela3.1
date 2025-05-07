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
      unitPrice
      giveawayConfigId
      packaging {
        unitQuantity
        unit {
          name
          abbreviation
        }
        product {
          name
          photos {
            fileName
          }
        }
      }
      giveaway {
        totalUnlocked
        totalIssued
        packaging {
          id
          unitQuantity
          product {
            id
            name
            photos {
              id
            }
          }
          unit {
            id
            name
          }
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

export const M_STOCK_BALANCE = gql`
  mutation stockBalance($input: InputProductStockBalance!) {
    stockBalance(input: $input) {
      balPackage
      balAgentRunPackaging
    }
  }
`;
