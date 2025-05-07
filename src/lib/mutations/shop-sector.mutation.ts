import { gql } from '@apollo/client';

export const SHOP_SECTOR_CREATE = gql`
  mutation shopSectorCreate($input: InputShopSectorCreate!) {
    shopSectorCreate(input: $input) {
      message
    }
  }
`;

export const SHOP_SECTOR_UPDATE = gql`
  mutation shopSectorUpdate($input: InputShopSectorUpdate!) {
    shopSectorUpdate(input: $input) {
      message
    }
  }
`;

export const SHOP_SECTOR_RECYCLE = gql`
  mutation shopSectorRecycle($input: InputIds!) {
    shopSectorRecycle(input: $input) {
      message
    }
  }
`;

export const SHOP_SECTOR_RESTORE = gql`
  mutation shopSectorRestore($input: InputIds!) {
    shopSectorRestore(input: $input) {
      message
    }
  }
`;

export const SHOP_SECTOR = gql`
  mutation m_shopSector($input: InputId!) {
    m_shopSector(input: $input) {
      id
      name
      created
      shops {
        id
      }
    }
  }
`;

export const M_SHOP_SECTORS = gql`
  mutation m_shopSectors($input: InputPaginatedRecords!) {
    m_shopSectors(input: $input) {
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
