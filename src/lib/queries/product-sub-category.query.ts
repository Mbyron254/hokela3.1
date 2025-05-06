import { gql } from '@apollo/client';

export const Q_PRODUCT_SUB_CATEGORIES_ACTIVE = gql`
  query productSubCategories($input: InputProductSubCategories!) {
    productSubCategories(input: $input) {
      count
      rows {
        id
        index
        name
        created
        productCategory {
          id
          name
        }
        products {
          id
        }
      }
    }
  }
`;

export const Q_PRODUCT_SUB_CATEGORIES_RECYCLED = gql`
  query productSubCategoriesRecycled($input: InputProductSubCategories!) {
    productSubCategoriesRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        recycled
        productCategory {
          id
          name
        }
        products {
          id
        }
      }
    }
  }
`;

export const Q_PRODUCT_SUB_CATEGORIES_MINI = gql`
  query productSubCategories($input: InputProductSubCategories!) {
    productSubCategories(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
