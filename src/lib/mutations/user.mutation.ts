import { gql } from '@apollo/client';

export const USER_CREATE_SELF = gql`
  mutation userCreateSelf($input: InputUserCreateSelf!) {
    userCreateSelf(input: $input) {
      message
    }
  }
`;

export const USER_UPDATE_SELF = gql`
  mutation userUpdateAccountSelf($input: InputUserAccountUpdateSelf!) {
    userUpdateAccountSelf(input: $input) {
      message
    }
  }
`;

export const USER_AC_RESET = gql`
  mutation resetPassword($input: InputPasswordReset!) {
    resetPassword(input: $input) {
      message
    }
  }
`;

export const USER_AC_RECOVER = gql`
  mutation recoverAccount($input: InputRecoverAccount!) {
    recoverAccount(input: $input) {
      message
    }
  }
`;

export const USER_LOGIN = gql`
  mutation login($input: InputLogin!) {
    login(input: $input) {
      message
    }
  }
`;

export const USER_LOGOUT = gql`
  mutation logout {
    logout {
      message
    }
  }
`;

export const USER_LOCK = gql`
  mutation sessionLock {
    sessionLock {
      message
    }
  }
`;

export const USER_UN_LOCK = gql`
  mutation sessionUnlock($input: InputUnlock!) {
    sessionUnlock(input: $input) {
      message
    }
  }
`;

export const USER_RECYCLE = gql`
  mutation userRecycle($input: InputIds!) {
    userRecycle(input: $input) {
      message
    }
  }
`;

export const USER_RESTORE = gql`
  mutation userRestore($input: InputIds!) {
    userRestore(input: $input) {
      message
    }
  }
`;

export const USER_SUSPEND = gql`
  mutation userSuspend($input: InputIds!) {
    userSuspend(input: $input) {
      message
    }
  }
`;

export const USER_ACTVATE = gql`
  mutation userActivate($input: InputIds!) {
    userActivate(input: $input) {
      message
    }
  }
`;

export const USER_CREATE_ALIEN = gql`
  mutation userCreateAlien($input: InputUserCreateAlien!) {
    userCreateAlien(input: $input) {
      message
    }
  }
`;

export const USER_UPDATE_ROLE = gql`
  mutation userRoleUpdate($input: InputUserRoleUpdate!) {
    userRoleUpdate(input: $input) {
      message
    }
  }
`;

export const M_USERS_MINI = gql`
  mutation m_usersActive($input: InputUsers!) {
    m_usersActive(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;

export const M_USERS_ACTIVE = gql`
  mutation m_usersActive($input: InputUsers!) {
    m_usersActive(input: $input) {
      count
      rows {
        index
        id
        name
        accountNo
        phone
        email
        state
        created
        role {
          name
        }
        profile {
          photo {
            fileName
          }
        }
      }
    }
  }
`;

export const M_USERS_RECYCLED = gql`
  mutation m_usersRecycled($input: InputUsers!) {
    m_usersRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        accountNo
        phone
        email
        state
        created
        role {
          name
        }
        profile {
          photo {
            fileName
          }
        }
      }
    }
  }
`;

export const M_USER = gql`
  mutation user($input: InputId!) {
    user(input: $input) {
      id
      name
      role {
        id
        name
      }
    }
  }
`;

// export const Q_USERS_ACTIVE = gql`
//   query usersActive($input: InputUsers!) {
//     usersActive(input: $input) {
//       count
//       rows {
//         index
//         id
//         name
//         accountNo
//         phone
//         email
//         state
//         created
//         role {
//           name
//         }
//         profile {
//           photo {
//             fileName
//           }
//         }
//       }
//     }
//   }
// `;

// export const Q_USERS_RECYCLED = gql`
//   query usersRecycled($input: InputUsers!) {
//     usersRecycled(input: $input) {
//       count
//       rows {
//         index
//         id
//         name
//         accountNo
//         phone
//         email
//         state
//         recycled
//         role {
//           name
//         }
//         profile {
//           photo {
//             fileName
//           }
//         }
//       }
//     }
//   }
// `;
