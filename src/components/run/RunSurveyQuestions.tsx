'use client';

import { FC, useEffect, useState } from 'react';
import {
  IChoice,
  IAnswerDropdownOption,
  IQuestionnairField,
  InputSurveyUpdate,
} from 'src/lib/interface/general.interface';
import { GQLMutation } from 'src/lib/client';
import { M_SURVEY, SURVEY_UPSERT } from 'src/lib/mutations/survey.mutation';
import { RunSurveyTargetReports } from './RunSurveyTargetReports';
import { QuestionnaireSetup } from '../QuestionnaireSetup';
import { DROPDOWN, CHOICE_SINGLE, CHOICE_MULTIPLE } from 'src/lib/constant';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

export const RunSurveyQuestions: FC<{
  clientTier2Id: string;
  runId: string;
}> = ({ clientTier2Id, runId }) => {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: M_SURVEY,
    resolver: 'survey',
    toastmsg: true,
  });
  const {
    action: upsert,
    loading: upserting,
    data: upserted,
  } = GQLMutation({
    mutation: SURVEY_UPSERT,
    resolver: 'surveyUpsert',
    toastmsg: true,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [input, setInput] = useState<InputSurveyUpdate>({
    name: undefined,
    description: undefined,
    hideRespondentFields: undefined,
    requireRespondentName: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
    questionnaireFields: [],
  });
  const [tabIndex, setTabIndex] = useState(0);

  const handleUpsert = () => {
    if (clientTier2Id && runId && questionnaireFields) {
      for (let i = 0; i < questionnaireFields.length; i += 1) {
        switch (questionnaireFields[i].feedbackType) {
          case DROPDOWN:
            delete questionnaireFields[i].optionsChoiceSingle;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;

          case CHOICE_SINGLE:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;

          case CHOICE_MULTIPLE:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceSingle;
            break;

          default:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceSingle;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;
        }
      }

      upsert({ variables: { input: { ...input, clientTier2Id, runId, questionnaireFields } } });
    }
  };

  useEffect(() => getSurvey({ variables: { input: { runId } } }), [getSurvey, runId]);
  useEffect(() => {
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i += 1) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceSingle.length; k += 1) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k += 1) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsDropdown.length; k += 1) {
          _dropdown.push({
            value: survey.questionnaireFields[i].optionsDropdown[k].value,
            label: survey.questionnaireFields[i].optionsDropdown[k].label,
          });
        }

        _fields.push({
          id: survey.questionnaireFields[i].id,
          isRequired: survey.questionnaireFields[i].isRequired,
          noDuplicateResponse: survey.questionnaireFields[i].noDuplicateResponse,
          question: survey.questionnaireFields[i].question,
          feedbackType: survey.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: survey.questionnaireFields[i].allowMultipleFileUploads,
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
        });
      }

      setInput({
        ...input,
        name: survey.name,
        description: survey.description,
        hideRespondentFields: survey.hideRespondentFields,
        requireRespondentName: survey.requireRespondentName,
        requireRespondentPhone: survey.requireRespondentPhone,
        requireRespondentEmail: survey.requireRespondentEmail,
        blockSameLocationReportsGlobally: survey.blockSameLocationReportsGlobally,
        blockSameLocationReportsPerAgent: survey.blockSameLocationReportsPerAgent,
      });
      setQuestionnaireFields(_fields);
    }
  }, [survey, input]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} aria-label="survey tabs">
        <Tab label="Questionnaire" />
        <Tab label="Target Reports" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Survey Details
              </Typography>
              <TextField
                fullWidth
                label="Survey Name"
                variant="outlined"
                margin="normal"
                defaultValue={input.name}
                onChange={(e) =>
                  setInput({
                    ...input,
                    name: e.target.value === '' ? undefined : e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Survey Description"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                defaultValue={input.description}
                onChange={(e) =>
                  setInput({
                    ...input,
                    description: e.target.value === '' ? undefined : e.target.value,
                  })
                }
              />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Survey Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={input.hideRespondentFields}
                    onChange={() =>
                      setInput({
                        ...input,
                        hideRespondentFields: !input.hideRespondentFields,
                      })
                    }
                  />
                }
                label="Hide Respondent Fields"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={input.requireRespondentName}
                    onChange={() =>
                      setInput({
                        ...input,
                        requireRespondentName: !input.requireRespondentName,
                      })
                    }
                  />
                }
                label="Require Respondent Name"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={input.requireRespondentPhone}
                    onChange={() =>
                      setInput({
                        ...input,
                        requireRespondentPhone: !input.requireRespondentPhone,
                      })
                    }
                  />
                }
                label="Require Respondent Phone"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={input.requireRespondentEmail}
                    onChange={() =>
                      setInput({
                        ...input,
                        requireRespondentEmail: !input.requireRespondentEmail,
                      })
                    }
                  />
                }
                label="Require Respondent Email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={input.blockSameLocationReportsGlobally}
                    onChange={() =>
                      setInput({
                        ...input,
                        blockSameLocationReportsGlobally: !input.blockSameLocationReportsGlobally,
                      })
                    }
                  />
                }
                label="Block Same Location Reports Globally"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={input.blockSameLocationReportsPerAgent}
                    onChange={() =>
                      setInput({
                        ...input,
                        blockSameLocationReportsPerAgent: !input.blockSameLocationReportsPerAgent,
                      })
                    }
                  />
                }
                label="Block Same Location Reports Per Agent"
              />
            </CardContent>
          </Card>

          <Box sx={{ mt: 3 }}>
            <QuestionnaireSetup
              questionnaireFields={questionnaireFields}
              setQuestionnaireFields={setQuestionnaireFields}
              mutating={upserting}
              mutation={handleUpsert}
            />
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          {survey?.id ? <RunSurveyTargetReports surveyId={survey.id} /> : undefined}
        </Box>
      )}
    </Box>
  );
};
