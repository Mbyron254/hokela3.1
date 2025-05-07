import { gql } from '@apollo/client';

export const Q_PRODUCTS_ACTIVE = gql`
  query products($input: InputProducts!) {
    products(input: $input) {
      count
      rows {
        id
        index
        code
        name
        description
        basePrice
        created
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

export const Q_PRODUCTS_RECYCLED = gql`
  query productsRecycled($input: InputProducts!) {
    productsRecycled(input: $input) {
      count
      rows {
        id
        index
        code
        name
        description
        basePrice
        recycled
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

export const Q_PRODUCTS_MINI = gql`
  query products($input: InputProducts!) {
    products(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
