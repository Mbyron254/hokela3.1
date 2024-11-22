import { gql } from '@apollo/client';

export const ALLOCATE_FREE_GIVEAWAY = gql`
  mutation allocateFreeGiveaway($input: InputFreeGiveawayAllocate!) {
    allocateFreeGiveaway(input: $input) {
      message
    }
  }
`;

export const M_AGENTS_FREE_GIVEAWAY_ALLOCATIONS = gql`
  mutation agentsFreeGiveawayAllocations(
    $input: InputAgentsFreeGiveawayAllocations!
  ) {
    agentsFreeGiveawayAllocations(input: $input) {
      canBulkFill
      entries {
        index
        quantityAllocated
        quantityGivenAway
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

export const M_AGENT_FREE_GIVEAWAY_ALLOCATIONS = gql`
  mutation agentFreeGiveawayAllocations($input: InputAgentAllocations!) {
    agentFreeGiveawayAllocations(input: $input) {
      index
      id
      quantityAllocated
      quantityGivenAway
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

export const M_UPDATE_FREE_GIVEAWAY = gql`
  mutation updateFreeGiveaway($input: InputFreeGiveawayUpdate!) {
    updateFreeGiveaway(input: $input) {
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
