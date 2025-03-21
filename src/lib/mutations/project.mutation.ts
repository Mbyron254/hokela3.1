import { gql } from '@apollo/client';

export const PROJECT_CREATE = gql`
  mutation projectCreate($input: InputProjectCreate!) {
    projectCreate(input: $input) {
      message
    }
  }
`;

export const PROJECT_UPDATE = gql`
  mutation projectUpdate($input: InputProjectUpdate!) {
    projectUpdate(input: $input) {
      message
    }
  }
`;

export const PROJECT_RECYCLE = gql`
  mutation projectRecycle($input: InputIds!) {
    projectRecycle(input: $input) {
      message
    }
  }
`;

export const PROJECT_RESTORE = gql`
  mutation projectRestore($input: InputIds!) {
    projectRestore(input: $input) {
      message
    }
  }
`;

export const PROJECT = gql`
  mutation project($input: InputId!) {
    project(input: $input) {
      id
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
    }
  }
`;

export const M_PROJECT_MINI = gql`
  mutation m_projects($input: InputProjects!) {
    m_projects(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
