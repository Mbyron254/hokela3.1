import { gql } from '@apollo/client';

export const M_AGENT_PERFORMANCE = gql`
  mutation agentRunPerformance($input: InputAgentRunPerformance!) {
    agentRunPerformance(input: $input) {
      index
      agent {
        id
        user {
          id
          name
          accountNo
          profile {
            photo {
              fileName
            }
          }
        }
      }
      clockedIn
      clockedOut
      overallPercentScore
      totalBasicEarned
      totalBonusEarned
      totalGrossEarned
      sales {
        targetUnits
        achievedUnits
        achievedPercentage
      }
      surveyReports {
        targetUnits
        achievedUnits
        achievedPercentage
      }
      salesGiveawayReports {
        targetUnits
        achievedUnits
        achievedPercentage
      }
      freeGiveawayReports {
        targetUnits
        achievedUnits
        achievedPercentage
      }
    }
  }
`;

export const M_AGENTS_PERFORMANCE = gql`
  mutation agentsRunPerformances($input: InputAgentsRunPerformances!) {
    agentsRunPerformances(input: $input) {
      count
      rows {
        index
        agent {
          id
          user {
            id
            name
            accountNo
            profile {
              photo {
                fileName
              }
            }
          }
        }
        clockedIn
        clockedOut
        overallPercentScore
        totalBasicEarned
        totalBonusEarned
        totalGrossEarned
        sales {
          targetUnits
          achievedUnits
          achievedPercentage
        }
        surveyReports {
          targetUnits
          achievedUnits
          achievedPercentage
        }
        salesGiveawayReports {
          targetUnits
          achievedUnits
          achievedPercentage
        }
        freeGiveawayReports {
          targetUnits
          achievedUnits
          achievedPercentage
        }
      }
    }
  }
`;

export const M_AGENTS_LAST_LOCATION = gql`
  mutation agentsLastLocation($input: InputAgentsLastLocation!) {
    agentsLastLocation(input: $input) {
      agent {
        user {
          name
          phone
        }
      }
      clockInAt
      clockOutAt
      lat
      lng
    }
  }
`;

export const M_AGENTS_REPORTS_DISTRIBUTION = gql`
  mutation surveyReportsDistribution($input: InputSurveyReportsDistribution!) {
    surveyReportsDistribution(input: $input) {
      lat
      lng
    }
  }
`;

export const M_RUN_SHOPS_DISTRIBUTION = gql`
  mutation analyzeRunShopsDistribution($input: InputAnalyzeRunShopsDistribution!) {
    analyzeRunShopsDistribution(input: $input) {
      lat
      lng
    }
  }
`;
