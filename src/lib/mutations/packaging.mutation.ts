import { gql } from '@apollo/client';

export const M_PACKAGINGS_MINI = gql`
  mutation m_packagings($input: InputPackagings!) {
    m_packagings(input: $input) {
      count
      rows {
        id
        unitQuantity
        unit {
          id
          name
          abbreviation
        }
      }
    }
  }
`;
