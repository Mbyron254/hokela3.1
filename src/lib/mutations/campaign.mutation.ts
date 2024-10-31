import { gql } from '@apollo/client';

export const CAMPAIGN_CREATE = gql`
  mutation campaignCreate($input: InputCampaignCreate!) {
    campaignCreate(input: $input) {
      message
    }
  }
`;

export const CAMPAIGN_UPDATE = gql`
  mutation campaignUpdate($input: InputCampaignUpdate!) {
    campaignUpdate(input: $input) {
      message
    }
  }
`;

export const CAMPAIGN_RECYCLE = gql`
  mutation campaignRecycle($input: InputIds!) {
    campaignRecycle(input: $input) {
      message
    }
  }
`;

export const CAMPAIGN_RESTORE = gql`
  mutation campaignRestore($input: InputIds!) {
    campaignRestore(input: $input) {
      message
    }
  }
`;

export const M_CAMPAIGN = gql`
  mutation m_campaign($input: InputId!) {
    m_campaign(input: $input) {
      id
      name
      jobDescription
      jobQualification
      created
      clientTier2 {
        id
        name
      }
      runs {
        id
      }
    }
  }
`;

export const M_CAMPAIGNS_ACTIVE = gql`
  mutation m_campaigns($input: InputCampaigns!) {
    m_campaigns(input: $input) {
      count
      rows {
        index
        id
        name
        jobDescription
        jobQualification
        created
        clientTier2 {
          id
          name
        }
        runs {
          id
        }
      }
    }
  }
`;

export const M_CAMPAIGNS_RECYCLED = gql`
  mutation m_campaignsRecycled($input: InputCampaigns!) {
    m_campaignsRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        jobDescription
        jobQualification
        recycled
        clientTier2 {
          id
          name
        }
        runs {
          id
        }
      }
    }
  }
`;

export const M_CAMPAIGNS_MINI = gql`
  mutation m_campaigns($input: InputCampaigns!) {
    m_campaigns(input: $input) {
      count
      rows {
        index
        id
        name
      }
    }
  }
`;
