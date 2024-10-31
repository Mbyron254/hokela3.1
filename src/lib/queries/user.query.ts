import { gql } from '@apollo/client';

export const Q_USERS_ACTIVE = gql`
  query usersActive($input: InputUsers!) {
    usersActive(input: $input) {
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

export const Q_USERS_RECYCLED = gql`
  query usersRecycled($input: InputUsers!) {
    usersRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        accountNo
        phone
        email
        state
        recycled
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

export const Q_AGENT = gql`
  query userAlien($input: InputId!) {
    userAlien(input: $input) {
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
`;

export const Q_GUESTS_MINI = gql`
  query usersActive($input: InputUsers!) {
    usersActive(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
