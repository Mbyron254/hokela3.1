import { gql } from '@apollo/client';

export const UNIT_CREATE = gql`
  mutation unitCreate($input: InputUnitCreate!) {
    unitCreate(input: $input) {
      message
    }
  }
`;

export const UNIT_UPDATE = gql`
  mutation unitUpdate($input: InputUnitUpdate!) {
    unitUpdate(input: $input) {
      message
    }
  }
`;

export const UNIT_RECYCLE = gql`
  mutation unitRecycle($input: InputIds!) {
    unitRecycle(input: $input) {
      message
    }
  }
`;

export const UNIT_RESTORE = gql`
  mutation unitRestore($input: InputIds!) {
    unitRestore(input: $input) {
      message
    }
  }
`;

export const UNIT = gql`
  mutation m_unit($input: InputId!) {
    m_unit(input: $input) {
      id
      name
      abbreviation
      created
      packagings {
        id
      }
    }
  }
`;

export const M_UNITS_MINI = gql`
  mutation m_units($input: InputPaginatedRecords!) {
    m_units(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
