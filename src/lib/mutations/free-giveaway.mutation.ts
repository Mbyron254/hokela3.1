import { gql } from '@apollo/client';

export const FREE_GIVEAWAY_SURVEY_UPSERT = gql`
  mutation freeGiveawaySurveyUpsert($input: InputFreeGiveawaySurveyUpsert!) {
    freeGiveawaySurveyUpsert(input: $input) {
      message
    }
  }
`;

export const FREE_GIVEAWAY_SURVEY = gql`
  mutation freeGiveawaySurvey($input: InputSurvey!) {
    freeGiveawaySurvey(input: $input) {
      id
      questionnaireFields {
        id
        question
        isRequired
        noDuplicateResponse
        allowMultipleFileUploads
        feedbackType
        optionsChoiceSingle {
          text
          documentId
        }
        optionsChoiceMultiple {
          text
          documentId
        }
        optionsDropdown {
          value
          label
        }
      }
      reports {
        id
      }
      created
      updated
    }
  }
`;

export const M_FREE_GIVEAWAY_AGENT_ALLOCATIONS = gql`
  mutation agentFreeGiveawayAllocations($input: InputAgentAllocations!) {
    agentFreeGiveawayAllocations(input: $input) {
      index
      id
      quantityAllocated
      quantityGiven
      product {
        name
        photos {
          fileName
        }
      }
      packaging {
        unitQuantity
        unit {
          name
        }
      }
    }
  }
`;

export const FREE_GIVEAWAY_REPORT_CREATE = gql`
  mutation freeGiveawayReportCreate(
    $input: InputFreeGiveawaySurveyReportCreate!
  ) {
    freeGiveawayReportCreate(input: $input) {
      message
    }
  }
`;
