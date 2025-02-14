import { gql } from '@apollo/client';

export const Q_SESSION = gql`
  query sessionAlien($input: InputId!) {
    sessionAlien(input: $input) {
      id
      name
      locked
      user {
        id
        accountNo
        name
        state
        role {
          id
          name
          clientTier1 {
            id
            clientType {
              id
              name
            }
          }
          clientTier2 {
            id
            clientType {
              id
              name
            }
          }
        }
        profile {
          id
          darkTheme
          photo {
            fileName
          }
        }
      }
    }
  }
`;

export const Q_SESSIONS = gql`
  query sessions($input: InputPaginatedRecords!) {
    sessions(input: $input) {
      count
      rows {
        index
        id
        locked
        expireString
        created
        user {
          id
          name
          accountNo
          profile {
            darkTheme
            photo {
              fileName
            }
          }
          role {
            name
            clientTier1 {
              clientType {
                id
                name
              }
            }
            clientTier2 {
              clientType {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const Q_SESSION_SELF = gql`
  query sessionSelf {
    sessionSelf {
      user {
        id
        name
        phone
        email
        profile {
          photo {
            id
            fileName
          }
        }
        role {
          clientTier1 {
            id
          }
          clientTier2 {
            id
          }
        }
        agent {
          id
        }
      }
    }
  }
`;
