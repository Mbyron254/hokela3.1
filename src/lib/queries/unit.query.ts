import { gql } from '@apollo/client';

export const Q_UNITS_ACTIVE = gql`
  query units($input: InputPaginatedRecords!) {
    units(input: $input) {
      count
      rows {
        id
        index
        name
        abbreviation
        created
        packagings {
          id
        }
      }
    }
  }
`;

export const Q_UNITS_RECYCLED = gql`
  query unitsRecycled($input: InputPaginatedRecords!) {
    unitsRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        abbreviation
        recycled
        packagings {
          id
        }
      }
    }
  }
`;

export const Q_UNITS_MINI = gql`
  query units($input: InputPaginatedRecords!) {
    units(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
