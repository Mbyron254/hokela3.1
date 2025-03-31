import { gql } from '@apollo/client';

export const SHOP_CREATE = gql`
  mutation shopCreate($input: InputShopCreate!) {
    shopCreate(input: $input) {
      message
    }
  }
`;

export const SHOP_UPDATE = gql`
  mutation shopUpdate($input: InputShopUpdate!) {
    shopUpdate(input: $input) {
      message
    }
  }
`;

export const SHOPS_APPROVE = gql`
  mutation shopApprove($input: InputIds!) {
    shopApprove(input: $input) {
      message
    }
  }
`;

export const SHOPS_REVOKE = gql`
  mutation shopRevoke($input: InputIds!) {
    shopRevoke(input: $input) {
      message
    }
  }
`;

export const SHOP_RECYCLE = gql`
  mutation shopRecycle($input: InputIds!) {
    shopRecycle(input: $input) {
      message
    }
  }
`;

export const SHOP_RESTORE = gql`
  mutation shopRestore($input: InputIds!) {
    shopRestore(input: $input) {
      message
    }
  }
`;

export const SHOP = gql`
  mutation m_shop($input: InputId!) {
    m_shop(input: $input) {
      id
      name
      lat
      lng
      approved
      created
      user {
        name
      }
      category {
        id
        name
      }
      sector {
        id
        name
      }
    }
  }
`;

export const M_SHOPS = gql`
  mutation m_shops($input: InputPaginatedRecords!) {
    m_shops(input: $input) {
      count
      rows {
        id
        name
        lat
        lng
        approved
        created
        user {
          name
        }
        category {
          id
          name
        }
        sector {
          id
          name
        }
      }
    }
  }
`;

export const M_SHOPS_MINI = gql`
  mutation m_shops($input: InputPaginatedRecords!) {
    m_shops(input: $input) {
      count
      rows {
        id
        name
        lat
        lng
      }
    }
  }
`;
