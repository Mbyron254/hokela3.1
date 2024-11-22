import { gql } from '@apollo/client';

export const M_ADD_AGENTS_TO_CAMPAIGN_RUN = gql`
  mutation addAgentsToCampaignRun($input: InputAddAgentsToCampaignRun!) {
    addAgentsToCampaignRun(input: $input) {
      message
    }
  }
`;

export const M_CAMPAIGN_RUN_OFFERS = gql`
  mutation m_campaignRunOffers($input: InputCampaignRunOffers!) {
    m_campaignRunOffers(input: $input) {
      count
      rows {
        index
        id
        created
        agent {
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

export const M_CAMPAIGN_RUN_OFFER = gql`
  mutation m_campaignRunOffer($input: InputId!) {
    m_campaignRunOffer(input: $input) {
      id
      created
      agent {
        user {
          id
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
        dateStart
        dateStop
        checkInAt
        checkOutAt
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
`;

export const M_CAMPAIGN_AGENTS = gql`
  mutation m_campaignRunOffers($input: InputCampaignRunOffers!) {
    m_campaignRunOffers(input: $input) {
      count
      rows {
        index
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
      }
    }
  }
`;
