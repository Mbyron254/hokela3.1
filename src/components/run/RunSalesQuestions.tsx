'use client';

import { IAnswerDropdownOption, IChoice, IQuestionnairField } from 'src/lib/interface/general.interface';
import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { SALES_SURVEY, SALES_SURVEY_UPSERT } from 'src/lib/mutations/sales-survey.mutation';
import { InputSalesSurveyUpdate } from 'src/lib/interface/survey-sales.interface';
import { CHOICE_MULTIPLE, CHOICE_SINGLE, DROPDOWN } from 'src/lib/constant';
import { QuestionnaireSetup } from '../QuestionnaireSetup';
import { Switch, FormControlLabel, Grid, Card, CardContent } from '@mui/material';

export const RunSalesQuestions: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: upsertSurvey,
    loading: upsertingSurvey,
    data: upsertedSurvey,
  } = GQLMutation({
    mutation: SALES_SURVEY_UPSERT,
    resolver: 'salesSurveyUpsert',
    toastmsg: true,
  });
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: SALES_SURVEY,
    resolver: 'salesSurvey',
    toastmsg: false,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [input, setInput] = useState<InputSalesSurveyUpdate>({
    hideRespondentFields: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
  });

  const handleSurveyUpsert = () => {
    if (runId && questionnaireFields.length) {
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
      upsertSurvey({
        variables: { input: { ...input, runId, questionnaireFields } },
      });
    }
  };

  useEffect(() => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  }, [upsertedSurvey, getSurvey, runId]);
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

      setQuestionnaireFields(_fields);
      setInput({
        hideRespondentFields: survey.hideRespondentFields,
        requireRespondentName: survey.requireRespondentName,
        requireRespondentPhone: survey.requireRespondentPhone,
        requireRespondentEmail: survey.requireRespondentEmail,
        blockSameLocationReportsGlobally: survey.blockSameLocationReportsGlobally,
        blockSameLocationReportsPerAgent: survey.blockSameLocationReportsPerAgent,
      });
    }
  }, [survey]);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
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
                    name="hideRespondentFields"
                  />
                }
                label="Hide Respondent Fields"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
                    name="requireRespondentName"
                  />
                }
                label="Require Respondent Name"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
                    name="requireRespondentPhone"
                  />
                }
                label="Require Respondent Phone"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
                    name="requireRespondentEmail"
                  />
                }
                label="Require Respondent Email"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
                    name="blockSameLocationReportsGlobally"
                  />
                }
                label="Block Same Location Reports Globally"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
                    name="blockSameLocationReportsPerAgent"
                  />
                }
                label="Block Same Location Reports Per Agent"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <QuestionnaireSetup
        questionnaireFields={questionnaireFields}
        setQuestionnaireFields={setQuestionnaireFields}
        mutating={upsertingSurvey}
        mutation={handleSurveyUpsert}
      />
    </>
  );
};
