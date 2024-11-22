import { gql } from '@apollo/client';

export const M_AGENTS_MINI = gql`
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

export const M_AGENT = gql`
  mutation agent($input: InputId!) {
    agent(input: $input) {
      id
      nationalIdNo
      lockNin
      taxIdNo
      lockTin
      healthIdNo
      lockHin
      socialSecurityNo
      lockSsn
      nin {
        id
        originalName
      }
      tin {
        id
        originalName
      }
      hin {
        id
        originalName
      }
      ssn {
        id
        originalName
      }
      # user {
      #   id
      #   name
      #   accountNo
      #   profile {
      #     photo {
      #       id
      #     }
      #   }
      # }
    }
  }
`;

export const M_AGENT_UPDATE_SELF = gql`
  mutation agentUpdateSelf($input: InputAgentUpdateSelf!) {
    agentUpdateSelf(input: $input) {
      message
    }
  }
`;

export const M_AGENT_UPDATE_ALIEN = gql`
  mutation agentUpdateAlien($input: InputAgentUpdateAlien!) {
    agentUpdateAlien(input: $input) {
      message
    }
  }
`;
