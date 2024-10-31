import { gql } from '@apollo/client';

export const ADD_GUEST_AS_ACCOUNT_MANAGER = gql`
  mutation addGuestAsAccountManager($input: InputAddGuestAsAccountManager!) {
    addGuestAsAccountManager(input: $input) {
      message
    }
  }
`;

export const REMOVE_ACCOUNT_MANAGER = gql`
  mutation removeAccountManager($input: InputRemoveAccountManager!) {
    removeAccountManager(input: $input) {
      message
    }
  }
`;
