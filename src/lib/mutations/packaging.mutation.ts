import { gql } from '@apollo/client';

export const PACKAGING_CREATE = gql`
  mutation packagingCreate($input: InputPackagingCreate!) {
    packagingCreate(input: $input) {
      message
    }
  }
`;

export const PACKAGING_UPDATE = gql`
  mutation packagingUpdate($input: InputPackagingUpdate!) {
    packagingUpdate(input: $input) {
      message
    }
  }
`;

export const PACKAGING_RECYCLE = gql`
  mutation packagingRecycle($input: InputIds!) {
    packagingRecycle(input: $input) {
      message
    }
  }
`;

export const PACKAGING_RESTORE = gql`
  mutation packagingRestore($input: InputIds!) {
    packagingRestore(input: $input) {
      message
    }
  }
`;

export const PACKAGING = gql`
  mutation m_packaging($input: InputId!) {
    m_packaging(input: $input) {
      id
      unitQuantity
      cost
      sellingPrice
      created
      unit {
        id
        name
        abbreviation
      }
    }
  }
`;

export const PACKAGINGS = gql`
  mutation m_packagings($input: InputPackagings!) {
    m_packagings(input: $input) {
      count
      rows {
        id
        index
        unitQuantity
        cost
        sellingPrice
        created
        unit {
          id
          name
          abbreviation
        }
        product {
          group {
            markup
          }
        }
      }
    }
  }
`;

export const PACKAGINGS_RECYCLED = gql`
  mutation packagingsRecycled($input: InputPackagings!) {
    packagingsRecycled(input: $input) {
      count
      rows {
        id
        index
        unitQuantity
        cost
        sellingPrice
        recycled
        unit {
          id
          name
          abbreviation
        }
      }
    }
  }
`;

export const M_PACKAGINGS_MINI = gql`
  mutation m_packagings($input: InputPackagings!) {
    m_packagings(input: $input) {
      count
      rows {
        id
        unitQuantity
        unit {
          id
          name
          abbreviation
        }
      }
    }
  }
`;
