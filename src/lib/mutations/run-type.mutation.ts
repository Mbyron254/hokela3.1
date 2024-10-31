import { gql } from '@apollo/client';

export const M_RUN_TYPE_MINI = gql`
  mutation m_runTypes($input: InputPaginatedRecords!) {
    m_runTypes(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
