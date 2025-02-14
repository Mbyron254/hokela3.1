import { gql } from '@apollo/client';

export const Q_SHOP_CATEGORIES_ACTIVE = gql`
  query shopCategories($input: InputPaginatedRecords!) {
    shopCategories(input: $input) {
      count
      rows {
        id
        index
        name
        created
        shops {
          id
        }
      }
    }
  }
`;

export const Q_SHOP_CATEGORIES_MINI = gql`
  query shopCategories($input: InputPaginatedRecords!) {
    shopCategories(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;

export const Q_SHOP_CATEGORIES_RECYCLED = gql`
  query shopCategoriesRecycled($input: InputPaginatedRecords!) {
    shopCategoriesRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        recycled
        shops {
          id
        }
      }
    }
  }
`;
