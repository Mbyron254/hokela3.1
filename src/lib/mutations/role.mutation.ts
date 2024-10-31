import { gql } from '@apollo/client';

export const ROLE_CREATE = gql`
  mutation roleCreate($input: InputRoleCreate!) {
    roleCreate(input: $input) {
      message
    }
  }
`;

export const ROLE_UPDATE = gql`
  mutation roleUpdate($input: InputRoleUpdate!) {
    roleUpdate(input: $input) {
      message
    }
  }
`;

export const ROLE_ASSIGN_PERMISSIONS = gql`
  mutation roleAssignPermissions($input: InputAssociation!) {
    roleAssignPermissions(input: $input) {
      message
    }
  }
`;

export const ROLE_RECYCLE = gql`
  mutation roleRecycle($input: InputIds!) {
    roleRecycle(input: $input) {
      message
    }
  }
`;

export const ROLE_RESTORE = gql`
  mutation roleRestore($input: InputIds!) {
    roleRestore(input: $input) {
      message
    }
  }
`;

export const ROLE = gql`
  mutation role($input: InputId!) {
    role(input: $input) {
      id
      name
      created
      permissions {
        id
        name
      }
      users {
        id
      }
      clientTier1 {
        name
      }
      clientTier2 {
        name
      }
    }
  }
`;

export const M_ROLES_MINI = gql`
  mutation m_roles($input: InputRoles!) {
    m_roles(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;

export const M_ROLES_ACTIVE = gql`
  mutation m_roles($input: InputRoles!) {
    m_roles(input: $input) {
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

export const M_ROLES_RECYCLED = gql`
  mutation m_rolesRecycled($input: InputRoles!) {
    m_rolesRecycled(input: $input) {
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
