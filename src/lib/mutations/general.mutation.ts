import { gql } from '@apollo/client';

export const M_DOCUMENT_NAME = gql`
  mutation document($input: InputId!) {
    document(input: $input) {
      originalName
      fileName
    }
  }
`;
