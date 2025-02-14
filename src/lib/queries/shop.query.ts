import { gql } from '@apollo/client';

export const Q_SHOPS_ACTIVE = gql`
  query shops($input: InputPaginatedRecords!) {
    shops(input: $input) {
      count
      rows {
        id
        index
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

export const Q_SHOPS_RECYCLED = gql`
  query shopsRecycled($input: InputPaginatedRecords!) {
    shopsRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        lat
        lng
        approved
        recycled
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

export const Q_SHOPS_MINI = gql`
  query shops($input: InputPaginatedRecords!) {
    shops(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
