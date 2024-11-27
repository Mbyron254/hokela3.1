import type { IQuestionnairField, InputSurveyResponse, InputSurveyReportCreate } from 'src/lib/interface/general.interface';

import { useState, useEffect, useCallback } from 'react';

import { Box, Card, Grid, Stack, Button, Dialog, Divider, TextField, Typography, CardContent, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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

interface ISurvey {
  id: string;
  name: string;
  description: string;
  updated: string;
  clientTier2: {
    id: string;
    name: string;
    __typename: string;
  };
  campaignRun: {
    id: string;
    code: string;
    __typename: string;
  };
  questionnaireFields: IQuestionnairField[];
  reports: any[];
  __typename: string;
}

// Add type safety for feedback handling
type FeedbackValue = string | string[] | undefined | null;

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

  // Update the state initialization with proper null checks
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
const [inputCreate, setInputCreate] = useState<InputSurveyReportCreate>({
  respondentName: '',
  respondentPhone: '',
  respondentEmail: '',
});

const [openDialog, setOpenDialog] = useState(false);
const [responses, setResponses] = useState<Record<string, FeedbackValue>>({});

const handleOpenDialog = () => setOpenDialog(true);
const handleCloseDialog = () => setOpenDialog(false);

const loadSurvey = useCallback(() => {
    if (campaignRunId) 
      console.log('campaignRunId', campaignRunId);

      getSurvey({ variables: { input: { campaignRunId } } });
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
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!survey?.id || !session?.user?.agent?.id) {
      console.warn('Missing required data: survey ID or agent ID');
      return;
    }
  
    const _responses: InputSurveyResponse[] = questionnaireFields.map((field) => {
      const feedback: FeedbackValue = responses[field.id];
      
      return {
        questionnaireFieldId: field.id,
        feedback: {
          _string: typeof feedback === 'string' ? feedback : undefined,
          _stringArray: Array.isArray(feedback) ? feedback : undefined,
        },
      };
    });
  
    create({
      variables: {
        input: {
          respondentName: inputCreate.respondentName || '',
          respondentPhone: inputCreate.respondentPhone || '',
          respondentEmail: inputCreate.respondentEmail || '',
          agentId: session.user.agent.id,
          surveyId: survey.id,
          responses: _responses,
        },
      },
    });
    handleCloseDialog();
  };

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);
  useEffect(() => {
    loadTarget();
    loadReports();
  }, [survey?.id, session?.user?.agent?.id, loadTarget, loadReports]);
  useEffect(() => {
    if (survey?.questionnaireFields) {
      const _fields = survey.questionnaireFields.map((field: IQuestionnairField) => ({
        id: field.id,
        isRequired: field.isRequired ?? false,
        noDuplicateResponse: field.noDuplicateResponse ?? false,
        question: field.question ?? '',
        optionsChoiceSingle: field.optionsChoiceSingle ?? [],
        optionsChoiceMultiple: field.optionsChoiceMultiple ?? [],
        optionsDropdown: field.optionsDropdown ?? [],
        feedbackType: field.feedbackType ?? 'text_short',
        allowMultipleFileUploads: field.allowMultipleFileUploads ?? false,
      }));
      setQuestionnaireFields(_fields);
    }
  }, [survey]);
  useEffect(() => {
    const _questionnaireFields = survey?.questionnaireFields;

    for (let i = 0; i < _questionnaireFields?.length; i += 1) {
      _questionnaireFields[i].feedback = undefined;
    }
    setQuestionnaireFields(_questionnaireFields);
    loadTarget();
    loadReports();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
   [created, questionnaireFields, loadTarget, loadReports]);

  console.log('SURVEY',questionnaireFields);
 

  const handleResponseChange = (fieldId: string, value: FeedbackValue) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {survey?.name || 'Loading...'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {survey?.description || 'Loading...'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mdi:plus" />}
                  onClick={handleOpenDialog}
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
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>New Survey Report</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Respondent Name"
                value={inputCreate.respondentName ?? ''}
                onChange={(e) => setInputCreate({ ...inputCreate, respondentName: e.target.value })}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={inputCreate.respondentPhone ?? ''}
                onChange={(e) => setInputCreate({ ...inputCreate, respondentPhone: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={inputCreate.respondentEmail ?? ''}
                onChange={(e) => setInputCreate({ ...inputCreate, respondentEmail: e.target.value })}
              />
            </Box>
            <Divider sx={{ my: 2 }}>Survey Questions</Divider>
            {Array.isArray(questionnaireFields) && questionnaireFields.map((field, index) => (
              <Box key={field.id}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {index + 1}. {field.question}
                  {field.isRequired && <Typography component="span" color="error.main">*</Typography>}
                </Typography>

                {field.feedbackType === 'text_short' && (
                  <TextField
                    fullWidth
                    placeholder="Enter your answer"
                    required={field.isRequired}
                    value={responses[field.id] || ''}
                    onChange={(e) => handleResponseChange(field.id, e.target.value)}
                  />
                )}

                {field.feedbackType === 'text_long' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Enter your answer"
                    required={field.isRequired}
                  />
                )}

                {field.feedbackType === 'number' && (
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter a number"
                    required={field.isRequired}
                  />
                )}

                {field.feedbackType === 'email' && (
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Enter email address"
                    required={field.isRequired}
                  />
                )}

                {field.feedbackType === 'phone_number' && (
                  <TextField
                    fullWidth
                    placeholder="Enter phone number"
                    required={field.isRequired}
                  />
                )}

                {field.feedbackType === 'date' && (
                  <TextField
                    fullWidth
                    type="date"
                    required={field.isRequired}
                  />
                )}

                {field.feedbackType === 'url' && (
                  <TextField
                    fullWidth
                    type="url" 
                    placeholder="Enter URL"
                    required={field.isRequired}
                  />
                )}

                {field.feedbackType === 'rating' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[1,2,3,4,5].map((rating) => (
                      <Button 
                        key={rating}
                        variant="outlined"
                        sx={{ minWidth: 40 }}
                      >
                        {rating}
                      </Button>
                    ))}
                  </Box>
                )}

                {field.feedbackType === 'dropdown' && field.optionsDropdown && (
                  <TextField
                    select
                    fullWidth
                    required={field.isRequired}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Select an option</option>
                    {field.optionsDropdown.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                )}

                {(field.feedbackType === 'single_choice' || field.feedbackType === 'multiple_choice') && (
                  <Stack spacing={1}>
                    {field.optionsChoiceSingle?.map((choice) => (
                      // @ts-ignore
                      <Box key={choice.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <input 
                          type={field.feedbackType === 'single_choice' ? 'radio' : 'checkbox'}
                          name={`question-${field.id}`}
                          required={field.isRequired}
                        />
                        {/* @ts-ignore */}
                        <Typography>{choice.value1}</Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={creating}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
