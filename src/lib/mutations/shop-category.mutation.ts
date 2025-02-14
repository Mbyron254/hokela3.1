import { gql } from '@apollo/client';

export const SHOP_CATEGORY_CREATE = gql`
  mutation shopCategoryCreate($input: InputShopCategoryCreate!) {
    shopCategoryCreate(input: $input) {
      message
    }
  }
`;

export const SHOP_CATEGORY_UPDATE = gql`
  mutation shopCategoryUpdate($input: InputShopCategoryUpdate!) {
    shopCategoryUpdate(input: $input) {
      message
    }
  }
`;

export const SHOP_CATEGORY_RECYCLE = gql`
  mutation shopCategoryRecycle($input: InputIds!) {
    shopCategoryRecycle(input: $input) {
      message
    }
  }
`;

export const SHOP_CATEGORY_RESTORE = gql`
  mutation shopCategoryRestore($input: InputIds!) {
    shopCategoryRestore(input: $input) {
      message
    }
  }
`;

export const SHOP_CATEGORY = gql`
  mutation m_shopCategory($input: InputId!) {
    m_shopCategory(input: $input) {
      id
      name
      created
      shops {
        id
      }
    }
  }
`;

export const M_SHOP_CATEGORIES = gql`
  mutation m_shopCategories($input: InputPaginatedRecords!) {
    m_shopCategories(input: $input) {
      count
      rows {
        id
        name
        created
        shops {
          id
        }
      }
    }
  }
`;
