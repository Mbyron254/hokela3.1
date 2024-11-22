import { gql } from '@apollo/client';

export const CLIENT_T2_CREATE = gql`
  mutation tier2ClientCreate($input: InputClientTier2Create!) {
    tier2ClientCreate(input: $input) {
      message
    }
  }
`;

export const CLIENT_T2_UPDATE = gql`
  mutation tier2ClientUpdate($input: InputClientTier2Update!) {
    tier2ClientUpdate(input: $input) {
      message
    }
  }
`;

export const CLIENT_T2_RECYCLE = gql`
  mutation tier2ClientRecycle($input: InputIds!) {
    tier2ClientRecycle(input: $input) {
      message
    }
  }
`;

export const CLIENT_T2_RESTORE = gql`
  mutation tier2ClientRestore($input: InputIds!) {
    tier2ClientRestore(input: $input) {
      message
    }
  }
`;

export const M_CLIENT_T2 = gql`
  mutation tier2Client($input: InputId!) {
    tier2Client(input: $input) {
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
`;

export const M_CLIENT_T2_MINI = gql`
  mutation m_tier2Clients($input: InputClientsTier2!) {
    m_tier2Clients(input: $input) {
      rows {
        id
        name
      }
    }
  }
`;
