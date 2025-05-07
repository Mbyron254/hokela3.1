import { gql } from '@apollo/client';

export const SALES_SURVEY_UPSERT = gql`
  mutation salesSurveyUpsert($input: InputSalesSurveyUpsert!) {
    salesSurveyUpsert(input: $input) {
      message
    }
  }
`;

export const SALES_SURVEY = gql`
  mutation salesSurvey($input: InputSurvey!) {
    salesSurvey(input: $input) {
      id
      hideRespondentFields
      requireRespondentName
      requireRespondentPhone
      requireRespondentEmail
      blockSameLocationReportsGlobally
      blockSameLocationReportsPerAgent
      created
      updated
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
    }
  }
`;
