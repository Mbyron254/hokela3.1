import { gql } from '@apollo/client';

export const Q_CLIENTS_T2_ACTIVE = gql`
  query tier2Clients($input: InputClientsTier2!) {
    tier2Clients(input: $input) {
      count
      rows {
        index
        id
        clientNo
        name
        created
        clientType {
          id
          name
        }
        projects {
          id
          name
        }
      }
    }
  }
`;

export const Q_CLIENTS_T2_RECYCLED = gql`
  query tier2ClientsRecycled($input: InputClientsTier2!) {
    tier2ClientsRecycled(input: $input) {
      count
      rows {
        index
        id
        clientNo
        name
        created
        clientType {
          id
          name
        }
        projects {
          id
        }
      }
    }
  }
`;

export const Q_CLIENTS_T2_MINI = gql`
  query tier2Clients($input: InputClientsTier2!) {
    tier2Clients(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
