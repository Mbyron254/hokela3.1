import { gql } from '@apollo/client';

export const CAMPAIGN_RUN_CREATE = gql`
mutation runCreate($input: InputRunCreate!) {
  runCreate(input: $input) {
    message
  }
}
`;

export const CAMPAIGN_RUN_UPDATE = gql`
  mutation campaignRunUpdate($input: InputCampaignRunUpdate!) {
    campaignRunUpdate(input: $input) {
      message
    }
  }
`;

export const CAMPAIGN_RUN_RECYCLE = gql`
  mutation campaignRunRecycle($input: InputIds!) {
    campaignRunRecycle(input: $input) {
      message
    }
  }
`;

export const CAMPAIGN_RUN_RESTORE = gql`
  mutation campaignRunRestore($input: InputIds!) {
    campaignRunRestore(input: $input) {
      message
    }
  }
`;

export const M_CAMPAIGN_RUN = gql`
  mutation m_campaignRun($input: InputCampaignRun!) {
    m_campaignRun(input: $input) {
      id
      code
      dateStart
      dateStop
      checkInAt
      checkOutAt
      closeAdvertOn
      forceClose
      created
      project {
        id
        name
      }
      campaign {
        id
        name
        clientTier2 {
          id
          name
          clientTier1 {
            id
            name
          }
        }
      }
      runType {
        id
        name
      }
      manager {
        id
        name
      }
      applications {
        id
      }
      offers {
        id
      }
    }
  }
`;

export const M_CAMPAIGN_RUNS_ACTIVE = gql`
  mutation m_campaignRuns($input: InputCampaignRuns!) {
    m_campaignRuns(input: $input) {
      count
      rows {
        index
        id
        code
        dateStart
        dateStop
        checkInAt
        checkOutAt
        closeAdvertOn
        forceClose
        created
        project {
          id
          name
        }
        campaign {
          id
          name
        }
        runType {
          id
          name
        }
        manager {
          id
          name
        }
        applications {
          id
        }
        offers {
          id
        }
      }
    }
  }
`;

export const M_CAMPAIGN_RUNS_RECYCLED = gql`
  mutation m_campaignRunsRecycled($input: InputCampaignRuns!) {
    m_campaignRunsRecycled(input: $input) {
      count
      rows {
        index
        id
        code
        dateStart
        dateStop
        checkInAt
        checkOutAt
        closeAdvertOn
        forceClose
        recycled
        project {
          id
          name
        }
        campaign {
          id
          name
        }
        runType {
          id
          name
        }
        manager {
          id
          name
        }
        applications {
          id
        }
        offers {
          id
        }
      }
    }
  }
`;

export const M_OPEN_JOBS = gql`
  mutation openJobs($input: InputOpenJobs!) {
    openJobs(input: $input) {
      count
      rows {
        index
        id
        closeAdvertOn
        campaign {
          id
          name
          jobDescription
          jobQualification
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

export const M_OPEN_JOB = gql`
  mutation openJob($input: InputId!) {
    openJob(input: $input) {
      id
      closeAdvertOn
      campaign {
        id
        name
        jobDescription
        jobQualification
        clientTier2 {
          name
          clientTier1 {
            name
          }
        }
      }
    }
  }
`;
