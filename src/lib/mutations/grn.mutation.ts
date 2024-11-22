import { gql } from '@apollo/client';

export const GRN_CREATE = gql`
  mutation createGRN($input: InputInventoryCreate!) {
    createGRN(input: $input) {
      message
    }
  }
`;

export const GRN_UPDATE = gql`
  mutation updateGRN($input: InputInventoryUpdate!) {
    updateGRN(input: $input) {
      message
    }
  }
`;

export const GRN_APPEND = gql`
  mutation appendGRN($input: InputInventoryAppend!) {
    appendGRN(input: $input) {
      message
    }
  }
`;

export const GRN_RECYCLE = gql`
  mutation recycleGRN($input: InputIds!) {
    recycleGRN(input: $input) {
      message
    }
  }
`;

export const SELL_STOCK = gql`
  mutation sellStock($input: InputInventorySell!) {
    sellStock(input: $input) {
      message
    }
  }
`;

export const GRN_MINIS = gql`
  mutation GRNMinis($input: InputGRNMinis!) {
    GRNMinis(input: $input) {
      count
      rows {
        index
        date
        grnNo
        supplierRef
        totalEntries
        total
      }
    }
  }
`;

export const GRN = gql`
  mutation GRN($input: InputGRN!) {
    GRN(input: $input) {
      date
      grnNo
      supplierRef
      total
      t2client {
        id
        name
        clientNo
      }
      entries {
        index
        id
        product {
          id
          name
        }
        packaging {
          id
          unitQuantity
          unit {
            id
            name
            abbreviation
          }
        }
        quantityIn
        unitPrice
        subtotal
      }
    }
  }
`;

export const M_INVENTORY = gql`
  mutation inventory($input: InputId!) {
    inventory(input: $input) {
      id
      unitPrice
      quantityIn
      packaging {
        id
        unit {
          name
        }
      }
      product {
        id
      }
    }
  }
`;
