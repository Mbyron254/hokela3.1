import { gql } from '@apollo/client';

export const CLIENT_T1_CREATE = gql`
  mutation tier1ClientCreate($input: InputClientTier1Create!) {
    tier1ClientCreate(input: $input) {
      message
    }
  }
`;

export const CLIENT_T1_UPDATE = gql`
  mutation tier1ClientUpdate($input: InputClientTier1Update!) {
    tier1ClientUpdate(input: $input) {
      message
    }
  }
`;

export const CLIENT_T1_RECYCLE = gql`
  mutation tier1ClientRecycle($input: InputIds!) {
    tier1ClientRecycle(input: $input) {
      message
    }
  }
`;

export const CLIENT_T1_RESTORE = gql`
  mutation tier1ClientRestore($input: InputIds!) {
    tier1ClientRestore(input: $input) {
      message
    }
  }
`;

export const M_CLIENT_T1 = gql`
  mutation tier1Client($input: InputId!) {
    tier1Client(input: $input) {
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
`;
