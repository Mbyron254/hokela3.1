import { gql } from '@apollo/client';

export const Q_CLIENT_TYPES_MINI = gql`
  query clientTypes($input: InputPaginatedRecords!) {
    clientTypes(input: $input) {
      rows {
        id
        name
      }
    }
  }
`;

export const Q_ACCOUNT_MANAGERS = gql`
  query clientAccountManagers($input: InputAccountManagers!) {
    clientAccountManagers(input: $input) {
      count
      rows {
        id
        name
        accountNo
        state
        profile {
          photo {
            fileName
          }
        }
      }
    }
  }
`;
