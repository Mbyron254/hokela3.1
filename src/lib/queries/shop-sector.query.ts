import { gql } from '@apollo/client';

export const Q_SHOP_SECTORS_ACTIVE = gql`
  query shopSectors($input: InputPaginatedRecords!) {
    shopSectors(input: $input) {
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

export const Q_SHOP_SECTORS_MINI = gql`
  query shopSectors($input: InputPaginatedRecords!) {
    shopSectors(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;

export const Q_SHOP_SECTORS_RECYCLED = gql`
  query shopSectorsRecycled($input: InputPaginatedRecords!) {
    shopSectorsRecycled(input: $input) {
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
