import { gql } from '@apollo/client';

export const SALES_GIVEAWAY_CONFIG_CREATE = gql`
  mutation salesGiveawayConfigCreate($input: InputSalesGiveawayConfigCreate!) {
    salesGiveawayConfigCreate(input: $input) {
      message
    }
  }
`;

export const SALES_GIVEAWAY_CONFIG_UPDATE = gql`
  mutation salesGiveawayConfigUpdate($input: InputSalesGiveawayConfigUpdate!) {
    salesGiveawayConfigUpdate(input: $input) {
      message
    }
  }
`;

export const SALES_GIVEAWAY_CONFIG_RECYCLE = gql`
  mutation salesGiveawayConfigRecycle($input: InputIds!) {
    salesGiveawayConfigRecycle(input: $input) {
      message
    }
  }
`;

export const SALES_GIVEAWAY_CONFIG_RESTORE = gql`
  mutation salesGiveawayConfigRestore($input: InputIds!) {
    salesGiveawayConfigRestore(input: $input) {
      message
    }
  }
`;

export const SALES_GIVEAWAY_CONFIG = gql`
  mutation salesGiveawayConfig($input: InputId!) {
    salesGiveawayConfig(input: $input) {
      id
      salePackaging {
        id
        unitQuantity
        product {
          id
          name
        }
        unit {
          id
          name
        }
      }
      giveawayPackaging {
        id
        unitQuantity
        product {
          id
          name
        }
        unit {
          id
          name
        }
      }
      saleUnits
      giveawayUnits
      created
      updated
    }
  }
`;

export const SALES_GIVEAWAY_CONFIGS_ACTIVE = gql`
  mutation salesGiveawayConfigs($input: InputSalesGiveawayConfigs!) {
    salesGiveawayConfigs(input: $input) {
      count
      rows {
        id
        index
        salePackaging {
          id
          unitQuantity
          product {
            name
          }
          unit {
            name
          }
        }
        giveawayPackaging {
          id
          unitQuantity
          product {
            name
          }
          unit {
            name
          }
        }
        saleUnits
        giveawayUnits
        created
        updated
      }
    }
  }
`;

export const SALES_GIVEAWAY_CONFIGS_RECYCLED = gql`
  mutation salesGiveawayConfigsRecycled($input: InputSalesGiveawayConfigs!) {
    salesGiveawayConfigsRecycled(input: $input) {
      count
      rows {
        id
        index
        salePackaging {
          id
          unitQuantity
          product {
            name
          }
          unit {
            name
          }
        }
        giveawayPackaging {
          id
          unitQuantity
          product {
            name
          }
          unit {
            name
          }
        }
        saleUnits
        giveawayUnits
        recycled
      }
    }
  }
`;

export const SALES_GIVEAWAY_SURVEY = gql`
  mutation salesGiveawaySurvey($input: InputSurvey!) {
    salesGiveawaySurvey(input: $input) {
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

export const SALES_GIVEAWAY_SURVEY_UPSERT = gql`
  mutation salesGiveawaySurveyUpsert($input: InputSalesGiveawaySurveyUpsert!) {
    salesGiveawaySurveyUpsert(input: $input) {
      message
    }
  }
`;

export const AGENT_SALES_GIVEAWAY_CONFIGURATIONS = gql`
  mutation agentSalesGiveawayConfigs($input: InputAgentAllocations!) {
    agentSalesGiveawayConfigs(input: $input) {
      index
      id
      giveaway {
        totalUnlocked
        totalIssued
        packaging {
          id
          unitQuantity
          product {
            id
            name
            photos {
              id
            }
          }
          unit {
            id
            name
          }
        }
      }
      # target {
      #   packaging {
      #     unitQuantity
      #     product {
      #       id
      #       name
      #       photos {
      #         id
      #       }
      #     }
      #     unit {
      #       id
      #       name
      #     }
      #   }
      #   units
      # }
    }
  }
`;

export const SALES_GIVEAWAY_REPORT_CREATE = gql`
  mutation salesGiveawayReportCreate($input: InputSalesGiveawaySurveyReportCreate!) {
    salesGiveawayReportCreate(input: $input) {
      message
    }
  }
`;
