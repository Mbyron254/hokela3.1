import { gql } from '@apollo/client';

export const Q_PROJECTS_ACTIVE = gql`
  query projects($input: InputProjects!) {
    projects(input: $input) {
      count
      rows {
        id
        index
        name
        dateStart
        dateStop
        description
        created
        clientTier2 {
          id
          name
        }
        manager {
          id
          name
        }
        campaigns {
          id
        }
      }
    }
  }
`;

export const Q_PROJECTS_RECYCLED = gql`
  query projectsRecycled($input: InputProjects!) {
    projectsRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        dateStart
        dateStop
        description
        created
        clientTier2 {
          id
          name
        }
        manager {
          id
          name
        }
        campaigns {
          id
        }
      }
    }
  }
`;

export const Q_PROJECTS_MINI = gql`
  query projects($input: InputProjects!) {
    projects(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
