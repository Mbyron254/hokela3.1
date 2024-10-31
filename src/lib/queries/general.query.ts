import { gql } from '@apollo/client';

export const Q_PERMISSIONS = gql`
  query permissions($input: InputPaginatedRecords!) {
    permissions(input: $input) {
      count
      rows {
        id
        index
        name
        category
        action
        resource
        errormsg
        t0
        t0Default
        t1
        t1Default
        t2
        t2Default
        roles {
          id
        }
      }
    }
  }
`;

export const Q_PERMISSIONS_MINI = gql`
  query permissions($input: InputPaginatedRecords!) {
    permissions(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
