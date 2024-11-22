import { gql } from '@apollo/client';

export const SURVEY_UPSERT = gql`
  mutation surveyUpsert($input: InputSurveyUpsert!) {
    surveyUpsert(input: $input) {
      message
    }
  }
`;

export const SURVEY_REPORT_CREATE = gql`
  mutation surveyReportCreate($input: InputSurveyReportCreate!) {
    surveyReportCreate(input: $input) {
      message
    }
  }
`;

export const M_SURVEY = gql`
  mutation survey($input: InputSurvey!) {
    survey(input: $input) {
      id
      name
      description
      updated
      clientTier2 {
        id
        name
      }
      campaignRun {
        id
        code
      }
      questionnaireFields {
        id
        question
        isRequired
        noDuplicateResponse
        feedbackType
        allowMultipleFileUploads
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

export const M_SURVEY_MINI = gql`
  mutation survey($input: InputSurvey!) {
    survey(input: $input) {
      id
      name
      description
      created
      updated
      questionnaireFields {
        id
      }
      reports {
        id
      }
    }
  }
`;

export const M_SURVEY_REPORTS = gql`
  mutation surveyReports($input: InputSurveyReports!) {
    surveyReports(input: $input) {
      count
      rows {
        index
        id
        respondentName
        respondentPhone
        respondentEmail
        created
        agent {
          user {
            name
            accountNo
            profile {
              photo {
                fileName
              }
            }
          }
        }
        responses {
          questionnaireFieldId
          question
          feedbackType
          feedback {
            _string
            _stringArray
            _choice {
              text
              documentId
            }
            _choiceArray {
              text
              documentId
            }
          }
        }
      }
    }
  }
`;

export const SURVEY_REPORT_TARGET_CREATE = gql`
  mutation surveyReportTargetCreate($input: InputSurveyReportTargetCreate!) {
    surveyReportTargetCreate(input: $input) {
      message
    }
  }
`;

export const M_SURVEY_REPORT_AGENTS_TARGET = gql`
  mutation surveyReportAgentsTarget($input: InputSurveyReportTargetAgents!) {
    surveyReportAgentsTarget(input: $input) {
      count
      rows {
        index
        target
        filled
        agent {
          id
          user {
            name
            accountNo
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

export const M_SURVEY_REPORT_AGENT_TARGET = gql`
  mutation surveyReportAgentTarget($input: InputSurveyReportTargetAgent!) {
    surveyReportAgentTarget(input: $input) {
      target
      filled
    }
  }
`;

export const M_SURVEY_REPORTS_AGENT = gql`
  mutation surveyReports($input: InputSurveyReports!) {
    surveyReports(input: $input) {
      count
      rows {
        index
        respondentName
        created
      }
    }
  }
`;

export const SURVEY_OPEN_CREATE = gql`
  mutation surveyCreateOpen($input: InputSurveyCreateOpen!) {
    surveyCreateOpen(input: $input) {
      message
    }
  }
`;

export const SURVEY_OPEN_UPDATE = gql`
  mutation surveyUpdateOpen($input: InputSurveyUpdateOpen!) {
    surveyUpdateOpen(input: $input) {
      message
    }
  }
`;

export const SURVEY_OPEN_RECYCLE = gql`
  mutation surveyRecycle($input: InputIds!) {
    surveyRecycle(input: $input) {
      message
    }
  }
`;

export const SURVEY_OPEN_RESTORE = gql`
  mutation surveyRestore($input: InputIds!) {
    surveyRestore(input: $input) {
      message
    }
  }
`;

export const M_SURVEY_OPEN = gql`
  mutation survey($input: InputSurvey!) {
    survey(input: $input) {
      id
      name
      description
      created
      updated
      clientTier2 {
        id
        name
      }
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

export const M_SURVEYS_OPEN = gql`
  mutation surveys($input: InputSurveys!) {
    surveys(input: $input) {
      count
      rows {
        index
        id
        name
        description
        created
        updated
        clientTier2 {
          id
          name
        }
        questionnaireFields {
          id
        }
        reports {
          id
        }
      }
    }
  }
`;

export const M_SURVEYS_OPEN_RECYCLED = gql`
  mutation surveysRecycled($input: InputSurveys!) {
    surveysRecycled(input: $input) {
      count
      rows {
        index
        id
        name
        description
        created
        recycled
        clientTier2 {
          id
          name
        }
        questionnaireFields {
          id
        }
        reports {
          id
        }
      }
    }
  }
`;
