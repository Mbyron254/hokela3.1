import { gql } from '@apollo/client';

export const PRODUCT_GROUP_CREATE = gql`
  mutation productGroupCreate($input: InputProductGroupCreate!) {
    productGroupCreate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_GROUP_UPDATE = gql`
  mutation productGroupUpdate($input: InputProductGroupUpdate!) {
    productGroupUpdate(input: $input) {
      message
    }
  }
`;

export const PRODUCT_GROUP_RECYCLE = gql`
  mutation productGroupRecycle($input: InputIds!) {
    productGroupRecycle(input: $input) {
      message
    }
  }
`;

export const PRODUCT_GROUP_RESTORE = gql`
  mutation productGroupRestore($input: InputIds!) {
    productGroupRestore(input: $input) {
      message
    }
  }
`;

export const PRODUCT_GROUP = gql`
  mutation productGroup($input: InputId!) {
    productGroup(input: $input) {
      id
      name
      description
      markup
      created
      updated
      products {
        id
      }
    }
  }
`;

export const M_PRODUCT_GROUPS = gql`
  mutation productGroups($input: InputProductGroups!) {
    productGroups(input: $input) {
      count
      rows {
        id
        index
        name
        description
        markup
        created
        updated
        products {
          id
        }
      }
    }
  }
`;

export const M_PRODUCT_GROUPS_RECYCLED = gql`
  mutation productGroupsRecycled($input: InputProductGroups!) {
    productGroupsRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        description
        markup
        created
        updated
        recycled
        products {
          id
        }
      }
    }
  }
`;

export const M_PRODUCT_GROUPS_MINI = gql`
  mutation productGroups($input: InputProductGroups!) {
    productGroups(input: $input) {
      count
      rows {
        id
        name
        markup
      }
    }
  }
`;
