import type { IChoice, IQuestionnairField, InputSurveyResponse, IAnswerDropdownOption, InputSurveyReportCreate } from 'src/lib/interface/general.interface';

import { useState, useEffect, useCallback } from 'react';

import { Box, Card, Grid, Stack, Button, Typography, CardContent } from '@mui/material';

  import { GQLQuery, GQLMutation } from 'src/lib/client';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import {
    M_SURVEY,
    SURVEY_REPORT_CREATE,
    M_SURVEY_REPORTS_AGENT,
    M_SURVEY_REPORT_AGENT_TARGET,
  } from 'src/lib/mutations/survey.mutation';

import { Iconify } from 'src/components/iconify';

interface SurveyReportsProps {
  campaignRunId: string | undefined;
}

export default function SurveyReports({ campaignRunId }: SurveyReportsProps) {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: M_SURVEY,
    resolver: 'survey',
    toastmsg: false,
  });
  const { action: getAgentTarget, data: agentTarget } = GQLMutation({
    mutation: M_SURVEY_REPORT_AGENT_TARGET,
    resolver: 'surveyReportAgentTarget',
    toastmsg: false,
  });
  const { action: getReports, data: reports } = GQLMutation({
    mutation: M_SURVEY_REPORTS_AGENT,
    resolver: 'surveyReports',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: SURVEY_REPORT_CREATE,
    resolver: 'surveyReportCreate',
    toastmsg: true,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<
  IQuestionnairField[]
>([]);
const [inputCreate, setInputCreate] = useState<InputSurveyReportCreate>({
  respondentName: undefined,
  respondentPhone: undefined,
  respondentEmail: undefined,
});

const loadSurvey = useCallback(() => {
    if (campaignRunId) getSurvey({ variables: { input: { campaignRunId } } });
  }, [campaignRunId, getSurvey]);

  const loadTarget = useCallback(() => {
    if (survey?.id && session?.user?.agent?.id) {
      getAgentTarget({
        variables: {
          input: { surveyId: survey.id, agentId: session.user.agent.id },
        },
      });
    }
  }, [survey?.id, session?.user?.agent?.id, getAgentTarget]);

  const loadReports = useCallback(() => {
    if (survey?.id && session?.user?.agent?.id) {
      getReports({
        variables: {
          input: { surveyId: survey.id, agentId: session.user.agent.id },
        },
      });
    }
  }, [survey?.id, session?.user?.agent?.id, getReports]);
  const handleCreate = (e: Event) => {
    e.preventDefault();

    if (survey.id && session?.user?.agent?.id) {
      const _responses: InputSurveyResponse[] = [];

      let _string: undefined | string;
      let _stringArray: undefined | string[];

      for (let i = 0; i < questionnaireFields.length; i += 1) {
        if (Array.isArray(questionnaireFields[i].feedback)) {
          _stringArray = questionnaireFields[i].feedback as string[];
        } else if (questionnaireFields[i].feedback) {
            _string = questionnaireFields[i].feedback as string;
          }
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: { _string, _stringArray },
        });
      }
      create({
        variables: {
          input: {
            ...inputCreate,
            agentId: session.user.agent.id,
            surveyId: survey.id,
            responses: _responses,
          },
        },  
      });
    }
  };

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);
  useEffect(() => {
    loadTarget();
    loadReports();
  }, [survey?.id, session?.user?.agent?.id, loadTarget, loadReports]);
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
            documentId:
              survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k += 1) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId:
              survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
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

    for (let i = 0; i < _questionnaireFields.length; i += 1) {
      _questionnaireFields[i].feedback = undefined;
    }
    setQuestionnaireFields(_questionnaireFields);
    loadTarget();
    loadReports();
  }, [created, questionnaireFields, loadTarget, loadReports]);

  console.log('SURVEY',survey);
 

  return (
    <Box>
      {!survey ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              You have no surveys available.
             </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {survey?.name || 'Survey Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {survey?.description || 'Survey Description'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mdi:plus" />}
                    onClick={() => {}}
                    sx={{ mb: 2 }}
                  >
                    New Report
                  </Button>

                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Target:
                      </Typography>
                      <Typography variant="body2" color="warning.main">
                        {agentTarget?.target} Reports
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Submitted:
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {agentTarget?.filled} Reports
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
