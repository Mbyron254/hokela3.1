import { gql } from '@apollo/client';

export const Q_CLIENTS_T1 = gql`
  query tier1Clients($input: InputClientsTier1!) {
    tier1Clients(input: $input) {
      count
      rows {
        index
        id
        name
        clientNo
        created
        clientType {
          id
          name
        }
      }
    }
  }
`;

export const Q_CLIENTS_T1_RECYCLED = gql`
  query tier1ClientsRecycled($input: InputClientsTier1!) {
    tier1ClientsRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        clientNo
        recycled
        clientType {
          name
        }
      }
    }
  }
`;

export const Q_CLIENTS_T1_MINI = gql`
  query tier1Clients($input: InputClientsTier1!) {
    tier1Clients(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
