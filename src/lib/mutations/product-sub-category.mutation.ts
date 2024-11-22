import { gql } from '@apollo/client';

export const PRODUCT_SUB_CATEGORY_CREATE = gql`
  mutation productSubCategoryCreate($input: InputProductSubCategoryCreate!) {
    productSubCategoryCreate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_SUB_CATEGORY_UPDATE = gql`
  mutation productSubCategoryUpdate($input: InputProductSubCategoryUpdate!) {
    productSubCategoryUpdate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_SUB_CATEGORY_RECYCLE = gql`
  mutation productSubCategoryRecycle($input: InputIds!) {
    productSubCategoryRecycle(input: $input) {
      message
    }
  }
`;

export const PRODUCT_SUB_CATEGORY_RESTORE = gql`
  mutation productSubCategoryRestore($input: InputIds!) {
    productSubCategoryRestore(input: $input) {
      message
    }
  }
`;

export const PRODUCT_SUB_CATEGORY = gql`
  mutation m_productSubCategory($input: InputId!) {
    m_productSubCategory(input: $input) {
      id
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
`;

export const M_PRODUCT_SUB_CATEGORIES_MINI = gql`
  mutation m_productSubCategories($input: InputProductSubCategories!) {
    m_productSubCategories(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
