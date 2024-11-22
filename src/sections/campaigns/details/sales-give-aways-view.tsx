import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { GQLMutation } from 'src/lib/client';
import { FC, useEffect, useState } from 'react';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
// import { QuestionnaireForm } from '../QuestionnaireForm';
import {
  AGENT_SALES_GIVEAWAY_CONFIGURATIONS,
  SALES_GIVEAWAY_REPORT_CREATE,
  SALES_GIVEAWAY_SURVEY,
} from 'src/lib/mutations/sales-giveaway.mutation';
import {
    IAnswerDropdownOption,
    IChoice,
    InputSalesGiveawaySurveyReportCreate,
    InputSurveyResponse,
    IQuestionnairField,
  } from 'src/lib/interface/general.interface';

interface Allocation {
  id: string;
  productName: string;
  quantityAllocated: number;
  quantitySold: number;
}

interface SalesGiveAwayViewProps {
  campaignRunId: string;
}

const SalesGiveAwayView: React.FC<SalesGiveAwayViewProps> = ({ campaignRunId }) => {
    
  const { action: getSalesConfigs, data: configs } = GQLMutation({
    mutation: AGENT_SALES_GIVEAWAY_CONFIGURATIONS,
    resolver: 'agentSalesGiveawayConfigs',
    toastmsg: false,
  });
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY,
    resolver: 'salesGiveawaySurvey',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_REPORT_CREATE,
    resolver: 'salesGiveawayReportCreate',
    toastmsg: true,
  });

  console.log("CONFIGS",configs);
  const [input, setInput] = useState<InputSalesGiveawaySurveyReportCreate>({
    salesGiveawayConfigId: undefined,
    quantityGiven: undefined,
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
  });
  const [questionnaireFields, setQuestionnaireFields] = useState<
    IQuestionnairField[]
  >([]);

  const loadSalesConfigs = () => {
    if (campaignRunId) {
      getSalesConfigs({ variables: { input: { campaignRunId } } });
    }
  };

  
  const loadSurvey = () => {
    if (campaignRunId) {
      getSurvey({ variables: { input: { campaignRunId } } });
    }
  };
  const handleCreate = (e: Event) => {
    e.preventDefault();

    if (survey.id) {
      const _responses: InputSurveyResponse[] = [];

      let _string: undefined | string = undefined;
      let _stringArray: undefined | string[] = undefined;

      for (let i = 0; i < questionnaireFields.length; i++) {
        if (Array.isArray(questionnaireFields[i].feedback)) {
          _stringArray = questionnaireFields[i].feedback as string[];
        } else {
          if (questionnaireFields[i].feedback) {
            _string = questionnaireFields[i].feedback as string;
          }
        }
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: { _string, _stringArray },
        });
      }
      create({ variables: { input: { ...input, responses: _responses } } });
    }
  };

  useEffect(() => {
    loadSurvey();
    loadSalesConfigs();
  }, [campaignRunId]);
  useEffect(() => {
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i++) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (
          let k = 0;
          k < survey.questionnaireFields[i].optionsChoiceSingle.length;
          k++
        ) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId:
              survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (
          let k = 0;
          k < survey.questionnaireFields[i].optionsChoiceMultiple.length;
          k++
        ) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId:
              survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (
          let k = 0;
          k < survey.questionnaireFields[i].optionsDropdown.length;
          k++
        ) {
          _dropdown.push({
            value: survey.questionnaireFields[i].optionsDropdown[k].value,
            label: survey.questionnaireFields[i].optionsDropdown[k].label,
          });
        }

        _fields.push({
          id: survey.questionnaireFields[i].id,
          isRequired: survey.questionnaireFields[i].isRequired,
          noDuplicateResponse:
            survey.questionnaireFields[i].noDuplicateResponse,
          question: survey.questionnaireFields[i].question,
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
          feedbackType: survey.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads:
            survey.questionnaireFields[i].allowMultipleFileUploads,
        });
      }
      setQuestionnaireFields(_fields);
    }
  }, [survey]);
  useEffect(() => {
    const _questionnaireFields = questionnaireFields;

    for (let i = 0; i < _questionnaireFields.length; i++) {
      _questionnaireFields[i].feedback = undefined;
    }
    setQuestionnaireFields(_questionnaireFields);
    loadSalesConfigs();
    loadSurvey();
  }, [created]);
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
        Sales Giveaways
      </Typography>
      {configs?.length ? (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {configs.map((config: { id: React.Key | null | undefined; giveaway: { packaging: { product: { name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; }; totalUnlocked: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined; totalIssued: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined; }; }) => (
            <Box
              key={config.id}
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                {config.giveaway.packaging.product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Pieces Allocated: {config.giveaway.totalUnlocked}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Pieces Issued: {config.giveaway.totalIssued}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleGiveProduct(config.id)}
                disabled={config.giveaway.totalIssued >= config.giveaway.totalUnlocked}
              >
                Give Product
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No products available for giveaway.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SalesGiveAwayView;

