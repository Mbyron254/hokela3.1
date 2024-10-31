import { gql } from '@apollo/client';

export const M_CAMPAIGN_RUN_APPLY = gql`
  mutation applyAgencyJob($input: InputCampaignRunApply!) {
    applyAgencyJob(input: $input) {
      message
    }
  }
`;

export const M_CAMPAIGN_RUN_APPLICATIONS = gql`
  mutation m_campaignRunApplications($input: InputCampaignRunApplications!) {
    m_campaignRunApplications(input: $input) {
      count
      rows {
        index
        id
        created
        agent {
          id
          user {
            name
            profile {
              photo {
                fileName
              }
            }
          }
        }
        campaignRun {
          id
          code
          closeAdvertOn
          project {
            name
          }
          campaign {
            name
            clientTier2 {
              name
              clientTier1 {
                name
              }
            }
          }
        }
      }
    }
  }
`;
