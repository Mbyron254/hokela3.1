import { gql } from '@apollo/client';

export const Q_PRODUCT_CATEGORIES_ACTIVE = gql`
  query productCategories($input: InputPaginatedRecords!) {
    productCategories(input: $input) {
      count
      rows {
        id
        index
        name
        created
        subCategories {
          id
        }
      }
    }
  }
`;

export const Q_PRODUCT_CATEGORIES_RECYCLED = gql`
  query productCategoriesRecycled($input: InputPaginatedRecords!) {
    productCategoriesRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        recycled
        subCategories {
          id
        }
      }
    }
  }
`;

export const Q_PRODUCT_CATEGORIES_MINI = gql`
  query productCategories($input: InputPaginatedRecords!) {
    productCategories(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
