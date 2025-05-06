import { gql } from '@apollo/client';

export const PRODUCT_CREATE = gql`
  mutation productCreate($input: InputProductCreate!) {
    productCreate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_UPDATE = gql`
  mutation productUpdate($input: InputProductUpdate!) {
    productUpdate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_RECYCLE = gql`
  mutation productRecycle($input: InputIds!) {
    productRecycle(input: $input) {
      message
    }
  }
`;

export const PRODUCT_RESTORE = gql`
  mutation productRestore($input: InputIds!) {
    productRestore(input: $input) {
      message
    }
  }
`;

export const PRODUCT = gql`
  mutation m_product($input: InputId!) {
    m_product(input: $input) {
      id
      code
      name
      description
      created
      group {
        id
        name
        markup
      }
      clientTier2 {
        id
        name
      }
      subCategory {
        id
        name
        productCategory {
          id
          name
        }
      }
      packagings {
        id
        unitQuantity
        unit {
          id
          name
          abbreviation
        }
      }
      photos {
        id
        fileName
      }
    }
  }
`;

export const M_PRODUCTS_ACTIVE = gql`
  mutation m_products($input: InputProducts!) {
    m_products(input: $input) {
      count
      rows {
        id
        index
        code
        name
        description
        created
        group {
          name
          markup
        }
        clientTier2 {
          id
          name
        }
        subCategory {
          id
          name
          productCategory {
            id
            name
          }
        }
        packagings {
          id
          unitQuantity
          unit {
            id
            name
            abbreviation
          }
        }
        photos {
          id
          fileName
        }
      }
    }
  }
`;

export const M_PRODUCTS_RECYCLED = gql`
  mutation m_productsRecycled($input: InputProducts!) {
    m_productsRecycled(input: $input) {
      count
      rows {
        id
        index
        code
        name
        description
        recycled
        group {
          name
          markup
        }
        clientTier2 {
          id
          name
        }
        subCategory {
          id
          name
          productCategory {
            id
            name
          }
        }
        packagings {
          id
          unitQuantity
          unit {
            id
            name
            abbreviation
          }
        }
        photos {
          id
          fileName
        }
      }
    }
  }
`;

export const M_PRODUCTS_MINI = gql`
  mutation m_products($input: InputProducts!) {
    m_products(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
