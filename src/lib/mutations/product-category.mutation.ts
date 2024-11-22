import { gql } from '@apollo/client';

export const PRODUCT_CATEGORY_CREATE = gql`
  mutation productCategoryCreate($input: InputProductCategoryCreate!) {
    productCategoryCreate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_CATEGORY_UPDATE = gql`
  mutation productCategoryUpdate($input: InputProductCategoryUpdate!) {
    productCategoryUpdate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_CATEGORY_RECYCLE = gql`
  mutation productCategoryRecycle($input: InputIds!) {
    productCategoryRecycle(input: $input) {
      message
    }
  }
`;

export const PRODUCT_CATEGORY_RESTORE = gql`
  mutation productCategoryRestore($input: InputIds!) {
    productCategoryRestore(input: $input) {
      message
    }
  }
`;

export const PRODUCT_CATEGORY = gql`
  mutation m_productCategory($input: InputId!) {
    m_productCategory(input: $input) {
      id
      name
      created
      subCategories {
        id
      }
    }
  }
`;

export const M_PRODUCT_CATEGORIES_MINI = gql`
  mutation m_productCategories($input: InputPaginatedRecords!) {
    m_productCategories(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
