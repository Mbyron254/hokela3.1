import { gql } from '@apollo/client';

export const INVENTORY_CREATE = gql`
  mutation inventoryCreate($input: InputInventoryCreate!) {
    inventoryCreate(input: $input) {
      message
    }
  }
`;

export const INVENTORY_UPDATE = gql`
  mutation inventoryUpdate($input: InputInventoryUpdate!) {
    inventoryUpdate(input: $input) {
      message
    }
  }
`;

export const INVENTORY_COUNTER_ENTRY = gql`
  mutation inventoryCounterEntry($input: InputInventoryCounterEntry!) {
    inventoryCounterEntry(input: $input) {
      message
    }
  }
`;

export const INVENTORY_RECYCLED = gql`
  mutation inventoryRecycle($input: InputIds!) {
    inventoryRecycle(input: $input) {
      message
    }
  }
`;

export const INVENTORY_RESTORE = gql`
  mutation inventoryRestore($input: InputIds!) {
    inventoryRestore(input: $input) {
      message
    }
  }
`;

export const INVENTORY = gql`
  mutation inventory($input: InputInventory!) {
    inventory(input: $input) {
      index
      id
      quantity
      unitPrice
      notes
      salesRef
      created
      updated
      recycled
    }
  }
`;

export const INVENTORIES = gql`
  mutation inventories($input: InputInventories!) {
    inventories(input: $input) {
      count
      totalItems
      totalValue
      rows {
        id
        index
        quantity
        unitPrice
        notes
        salesRef
        created
        updated
        recycled
        product {
          id
          name
        }
        packaging {
          id
          unitQuantity
          unit {
            name
          }
        }
      }
    }
  }
`;

export const INVENTORIES_RECYCLED = gql`
  mutation inventoriesRecycled($input: InputInventories!) {
    inventoriesRecycled(input: $input) {
      count
      totalItems
      totalValue
      rows {
        id
        index
        quantity
        unitPrice
        notes
        salesRef
        created
        updated
        recycled
        product {
          id
          name
        }
        packaging {
          id
          unitQuantity
          unit {
            name
          }
        }
      }
    }
  }
`;

export const AGENT_RUN_SALES = gql`
  mutation agentRunSales($input: InputAgentRunSales!) {
    agentRunSales(input: $input) {
      index
      quantity
      packaging {
        unitQuantity
        unit {
          name
          abbreviation
        }
        product {
          name
          photos {
            id
          }
        }
      }
    }
  }
`;
