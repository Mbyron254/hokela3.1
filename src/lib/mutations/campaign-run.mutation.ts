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
  mutation m_run($input: InputRun!) {
    m_run(input: $input) {
      id
      name
      code
      dateStart
      dateStop
      clockType
      clockInPhotoLabel
      clockOutPhotoLabel
      clockInTime
      clockOutTime
      locationPingFrequency
      closeAdvertOn
      forceClose
      created
      campaign {
        id
        name
        project {
          clientTier2 {
            id
            name
            clientTier1 {
              id
              name
            }
          }
        }
      }
      types {
        id
        name
      }
      manager {
        id
        name
      }
      poster {
        id
        fileName
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
  mutation m_runs($input: InputRuns!) {
    m_runs(input: $input) {
      count
      rows {
        index
        id
        name
        code
        dateStart
        dateStop
        clockType
        clockInPhotoLabel
        clockOutPhotoLabel
        clockInTime
        clockOutTime
        locationPingFrequency
        closeAdvertOn
        forceClose
        created
        campaign {
          id
          name
        }
        types {
          id
          name
        }
        manager {
          id
          name
        }
        poster {
          id
          fileName
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
  mutation m_runsRecycled($input: InputRuns!) {
    m_runsRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        code
        dateStart
        dateStop
        clockType
        clockInPhotoLabel
        clockOutPhotoLabel
        clockInTime
        clockOutTime
        locationPingFrequency
        closeAdvertOn
        forceClose
        recycled
        campaign {
          id
          name
        }
        types {
          id
          name
        }
        manager {
          id
          name
        }
        poster {
          id
          fileName
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
