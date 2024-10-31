import { gql } from '@apollo/client';

export const Q_ROLES_ACTIVE = gql`
  query roles($input: InputRoles!) {
    roles(input: $input) {
      count
      rows {
        index
        id
        name
        created
        permissions {
          id
        }
        users {
          id
        }
        clientTier1 {
          id
          name
        }
        clientTier2 {
          id
          name
        }
      }
    }
  }
`;

export const Q_ROLES_RECYCLED = gql`
  query rolesRecycled($input: InputRoles!) {
    rolesRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        recycled
        permissions {
          id
        }
        users {
          id
        }
        clientTier1 {
          id
          name
        }
        clientTier2 {
          id
          name
        }
      }
    }
  }
`;
