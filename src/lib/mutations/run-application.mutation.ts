import { gql } from '@apollo/client';

export const M_CAMPAIGN_RUN_APPLY = gql`
  mutation applyAgencyJob($input: InputRunApply!) {
    applyAgencyJob(input: $input) {
      message
    }
  }
`;

export const M_CAMPAIGN_RUN_APPLICATIONS = gql`
  mutation m_runApplications($input: InputRunApplications!) {
    m_runApplications(input: $input) {
      count
      rows {
        index
        id
        status
        created
        agent {
          id
          user {
            name
            email
            profile {
              photo {
                fileName
              }
            }
          }
        }
        run {
          id
          code
          name
          closeAdvertOn
          poster {
            fileName
          }
          campaign {
            project {
              clientTier2 {
                clientTier1 {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
