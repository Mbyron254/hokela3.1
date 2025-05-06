import { gql } from '@apollo/client';

export const M_RUN_PAYROLL = gql`
  mutation runPayroll($input: InputRunPayroll!) {
    runPayroll(input: $input) {
      count
      rows {
        index
        offerType
        checkedInDates
        agent {
          user {
            id
            name
            phone
            email
            state
            profile {
              photo {
                fileName
              }
            }
          }
        }
        team {
          name
          leader {
            user {
              id
            }
          }
        }
      }
    }
  }
`;
