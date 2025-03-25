import { gql } from '@apollo/client';

export const M_DOCUMENT_NAME = gql`
  mutation document($input: InputId!) {
    document(input: $input) {
      originalName
      fileName
    }
  }
`;

export const M_RUN_REPORTS_SUMMARY = gql`
  mutation runReportsSummary($input: InputRunReportsSummary!) {
    runReportsSummary(input: $input) {
      survey
      surveyId
      surveySales
      salesSurveyId
      surveyGiveaway
      salesGiveawaySurveyId
      surveySampling
      freeGiveawaySurveyId
    }
  }
`;

export const M_AGENTS_RUN_OFFERS = gql`
  mutation agentsRunOffers {
    agentsRunOffers {
      index
      agent {
        user {
          name
        }
      }
      runs {
        name
      }
    }
  }
`;
