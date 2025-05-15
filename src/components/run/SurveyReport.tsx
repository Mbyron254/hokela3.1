'use client';

import { FC, useEffect, useState } from 'react';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  IChoice,
  IAnswerDropdownOption,
  InputSurveyReportCreate,
  InputSurveyResponse,
  IQuestionnairField,
  IGeoLocation,
} from 'src/lib/interface/general.interface';
import {
  M_SURVEY_4_AGENT,
  M_SURVEY_REPORT_AGENT_TARGET,
  SURVEY_REPORT_CREATE,
} from 'src/lib/mutations/survey.mutation';
// Material UI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { QuestionnaireForm } from 'src/components/QuestionnaireForm';
import { getGeoLocation } from 'src/lib/helpers';
import { LOCATION_PING_INTERVAL_MS } from 'src/lib/constant';
import PhoneNumberInput from '../PhoneNumberInput';


export const SurveyReport: FC<{ runId: string }> = ({ runId }) => {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const {
    action: getSurvey,
    loading: loadingSurvey,
    data: survey,
  } = GQLMutation({
    mutation: M_SURVEY_4_AGENT,
    resolver: 'survey4Agent',
    toastmsg: false,
  });
  const {
    action: getAgentTarget,
    loading: loadingTarget,
    data: agentTarget,
  } = GQLMutation({
    mutation: M_SURVEY_REPORT_AGENT_TARGET,
    resolver: 'surveyReportAgentTarget',
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

  const _inputCreate: InputSurveyReportCreate = {
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
  };
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [inputCreate, setInputCreate] = useState(_inputCreate);
  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();
  const [openDialog, setOpenDialog] = useState(false);

  const handleCreate = (e: Event) => {
    e.preventDefault();

    if (survey.id && session?.user?.agent?.id && geoLocation?.lat && geoLocation?.lng) {
      const _responses: InputSurveyResponse[] = [];

      for (let i = 0; i < questionnaireFields.length; i += 1) {
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: questionnaireFields[i].feedback || {},
        });
      }

      create({
        variables: {
          input: {
            ...inputCreate,
            agentId: session.user.agent.id,
            surveyId: survey.id,
            lat: geoLocation.lat,
            lng: geoLocation.lng,
            responses: _responses,
          },
        },
      });
    }
  };

  const handleCreateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (survey.id && session?.user?.agent?.id && geoLocation?.lat && geoLocation?.lng) {
      const _responses: InputSurveyResponse[] = [];

      for (let i = 0; i < questionnaireFields.length; i += 1) {
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: questionnaireFields[i].feedback || {},
        });
      }

      create({
        variables: {
          input: {
            ...inputCreate,
            agentId: session.user.agent.id,
            surveyId: survey.id,
            lat: geoLocation.lat,
            lng: geoLocation.lng,
            responses: _responses,
          },
        },
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getGeoLocation(setGeoLocation);
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  }, [runId, getSurvey]);
  useEffect(() => {
    if (survey?.id && session?.user?.agent?.id) {
      getAgentTarget({
        variables: {
          input: { surveyId: survey.id, agentId: session.user.agent.id },
        },
      });
    }
  }, [survey?.id, session?.user?.agent?.id, getAgentTarget]);
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
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
          feedbackType: survey.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: survey.questionnaireFields[i].allowMultipleFileUploads,
        });
      }
      setQuestionnaireFields(_fields);
    }
  }, [survey]);
  useEffect(() => {
    if (created) window.location.reload();
  }, [created]);

  return (
    <>
      {geoLocation?.lat && geoLocation?.lng && (
        <>
          {loadingSurvey ? (
            <CircularProgress />
          ) : (
            survey && (
              <Grid container spacing={2}>
                <Grid item md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4">{survey?.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {survey?.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item md={4}>
                  <Card>
                    <CardContent>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                        startIcon={<i className="mdi mdi-plus" />}
                      >
                        New Report
                      </Button>

                      <Box mt={2}>
                        <Typography variant="subtitle1">Target</Typography>
                        {loadingTarget ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Typography variant="body2">
                            <b className="me-1 text-warning">{agentTarget?.target}</b> Reports
                          </Typography>
                        )}
                      </Box>
                      <Box mt={1}>
                        <Typography variant="subtitle1">Submitted</Typography>
                        {loadingTarget ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Typography variant="body2">
                            <b className="me-1 text-success">{agentTarget?.filled}</b> Reports
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )
          )}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
            <DialogTitle>New Survey Report</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    required={survey?.requireRespondentName}
                    value={inputCreate.respondentName}
                    onChange={(e) =>
                      setInputCreate({
                        ...inputCreate,
                        respondentName: e.target.value === '' ? undefined : e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item md={4}>
                  <PhoneNumberInput
                    phonekey="respondentPhone"
                    required={survey?.requireRespondentPhone}
                    input={inputCreate}
                    onChange={setInputCreate}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
                    label="Customer Email"
                    required={survey?.requireRespondentEmail}
                    value={inputCreate.respondentEmail}
                    onChange={(e) =>
                      setInputCreate({
                        ...inputCreate,
                        respondentEmail: e.target.value === '' ? undefined : e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>

              <QuestionnaireForm
                questionnaireFields={questionnaireFields}
                setQuestionnaireFields={setQuestionnaireFields}
                submitting={creating}
                handleSubmit={handleCreate}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleCreateButton} color="primary" disabled={creating}>
                {creating ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};
