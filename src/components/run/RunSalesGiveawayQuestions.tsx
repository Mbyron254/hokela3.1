'use client';

import { FC, useEffect, useState } from 'react';
import { InputSalesGiveawaySurveyUpdate } from 'src/lib/interface/survey-sales-giveaway.interface';
import { IAnswerDropdownOption, IChoice, IQuestionnairField } from 'src/lib/interface/general.interface';
import { GQLMutation } from 'src/lib/client';
import {
  SALES_GIVEAWAY_SURVEY,
  SALES_GIVEAWAY_SURVEY_UPSERT,
} from 'src/lib/mutations/sales-giveaway.mutation';
import { CHOICE_MULTIPLE, CHOICE_SINGLE, DROPDOWN } from 'src/lib/constant';
import { Checkbox, FormControlLabel, Card, CardContent, Grid, Alert } from '@mui/material';
import { QuestionnaireSetup } from '../QuestionnaireSetup';

export const RunSalesGiveawayQuestions: FC<{
  runId: string;
}> = ({ runId }) => {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY,
    resolver: 'salesGiveawaySurvey',
    toastmsg: false,
  });
  const {
    action: upsertSurvey,
    loading: upsertingSurvey,
    data: upsertedSurvey,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY_UPSERT,
    resolver: 'salesGiveawaySurveyUpsert',
    toastmsg: true,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [inputSurvey, setInputSurvey] = useState<InputSalesGiveawaySurveyUpdate>({
    hideRespondentFields: undefined,
    requireRespondentName: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
  });

  const handleSurveyUpsert = () => {
    if (runId && questionnaireFields.length) {
      for (let i = 0; i < questionnaireFields.length; i+=1) {
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
        variables: { input: { ...inputSurvey, runId, questionnaireFields } },
      });
    }
  };

  useEffect(() => {
    if (runId) getSurvey({ variables: { input: { runId } } });
  }, [runId, getSurvey]);
  useEffect(() => {
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i+=1) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceSingle.length; k+=1) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k+=1) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsDropdown.length; k+=1) {
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
      setInputSurvey({
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
      {!survey && (
        <Alert severity="warning" className="text-center">
          Questionnaire not set. Agents will not be able to submit sales giveaway reports!
        </Alert>
      )}
      <Card variant="outlined" className="border-primary">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputSurvey.hideRespondentFields}
                    onChange={() =>
                      setInputSurvey({
                        ...inputSurvey,
                        hideRespondentFields: !inputSurvey.hideRespondentFields,
                      })
                    }
                    name="hideRespondentFieldsFreeGiveaway"
                  />
                }
                label="Hide Respondent Fields"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputSurvey.requireRespondentName}
                    onChange={() =>
                      setInputSurvey({
                        ...inputSurvey,
                        requireRespondentName: !inputSurvey.requireRespondentName,
                      })
                    }
                    name="requireRespondentNameSalesGiveaway"
                  />
                }
                label="Require Respondent Name"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputSurvey.requireRespondentPhone}
                    onChange={() =>
                      setInputSurvey({
                        ...inputSurvey,
                        requireRespondentPhone: !inputSurvey.requireRespondentPhone,
                      })
                    }
                    name="requireRespondentPhoneSalesGiveaway"
                  />
                }
                label="Require Respondent Phone"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputSurvey.requireRespondentEmail}
                    onChange={() =>
                      setInputSurvey({
                        ...inputSurvey,
                        requireRespondentEmail: !inputSurvey.requireRespondentEmail,
                      })
                    }
                    name="requireRespondentEmailSalesGiveaway"
                  />
                }
                label="Require Respondent Email"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputSurvey.blockSameLocationReportsGlobally}
                    onChange={() =>
                      setInputSurvey({
                        ...inputSurvey,
                        blockSameLocationReportsGlobally: !inputSurvey.blockSameLocationReportsGlobally,
                      })
                    }
                    name="blockSameLocationReportsGloballySalesGiveaway"
                  />
                }
                label="Block Same Location Reports Globally"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inputSurvey.blockSameLocationReportsPerAgent}
                    onChange={() =>
                      setInputSurvey({
                        ...inputSurvey,
                        blockSameLocationReportsPerAgent: !inputSurvey.blockSameLocationReportsPerAgent,
                      })
                    }
                    name="blockSameLocationReportsPerAgentSalesGiveaway"
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
