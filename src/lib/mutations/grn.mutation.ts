import { gql } from '@apollo/client';

export const GRNCreate = gql`
  mutation GRNCreate($input: InputGRNCreate!) {
    GRNCreate(input: $input) {
      message
    }
  }
`;

export const GRNUpdate = gql`
  mutation GRNUpdate($input: InputGRNUpdate!) {
    GRNUpdate(input: $input) {
      message
    }
  }
`;

export const GRNRecycle = gql`
  mutation GRNRecycle($input: InputIds!) {
    GRNRecycle(input: $input) {
      message
    }
  }
`;

export const GRNRestore = gql`
  mutation GRNRestore($input: InputIds!) {
    GRNRestore(input: $input) {
      message
    }
  }
`;

export const GRN = gql`
  mutation GRN($input: InputGRN!) {
    GRN(input: $input) {
      index
      id
      grnNo
      supplierRefNo
      notes
      created
      updated
      recycled
      inventories {
        id
      }
      # clientTier1 {
      #   name
      # }
      # clientTier2 {
      #   name
      # }
    }
  }
`;

export const GRNs = gql`
  mutation GRNs($input: InputGRNs!) {
    GRNs(input: $input) {
      count
      rows {
        id
        grnNo
        supplierRefNo
        notes
        created
        updated
        recycled
        inventories {
          id
        }
        clientTier2 {
          id
        }
      }
    }
  }
`;

export const GRNs_RECYCLED = gql`
  mutation GRNsRecycled($input: InputGRNs!) {
    GRNsRecycled(input: $input) {
      count
      rows {
        id
        grnNo
        supplierRefNo
        notes
        created
        updated
        recycled
        inventories {
          id
        }
      }
    }
  }
`;

// ====================== OLD =======================

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

export const GRN_ = gql`
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
