'use client';

import { FC, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, InputAdornment } from '@mui/material';

import { GQLMutation } from 'src/lib/client';
import { IAgentFreeGiveawayAllocations } from 'src/lib/interface/campaign.interface';
import {
  FREE_GIVEAWAY_REPORT_CREATE,
  FREE_GIVEAWAY_SURVEY,
  FREE_GIVEAWAY_SURVEY_4_AGENT,
  M_FREE_GIVEAWAY_AGENT_ALLOCATIONS,
} from 'src/lib/mutations/free-giveaway.mutation';
import { sourceImage } from 'src/lib/server';
import { LOCATION_PING_INTERVAL_MS, TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { LoadingSpan } from 'src/components/LoadingSpan';
import {
  IAnswerDropdownOption,
  IChoice,
  IGeoLocation,
  InputFreeGiveawaySurveyReportCreate,
  InputSurveyResponse,
  IQuestionnairField,
} from 'src/lib/interface/general.interface';
import { QuestionnaireForm } from 'src/components/QuestionnaireForm';
import { getGeoLocation } from 'src/lib/helpers';
import { LoadingDiv } from 'src/components/LoadingDiv';
import PhoneNumberInput from '../PhoneNumberInput';

export const GiveawayReportFree: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: getAllocations,
    loading: loadingAllocations,
    data: FGAllocations,
  } = GQLMutation({
    mutation: M_FREE_GIVEAWAY_AGENT_ALLOCATIONS,
    resolver: 'agentFreeGiveawayAllocations',
    toastmsg: false,
  });
  const {
    action: getSurvey,
    loading: loadingSurvey,
    data: survey,
  } = GQLMutation({
    mutation: FREE_GIVEAWAY_SURVEY_4_AGENT,
    resolver: 'freeGiveawaySurvey4Agent',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: FREE_GIVEAWAY_REPORT_CREATE,
    resolver: 'freeGiveawayReportCreate',
    toastmsg: true,
  });

  const [input, setInput] = useState<InputFreeGiveawaySurveyReportCreate>({
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
    freeGiveawayAllocationId: undefined,
    quantityGiven: undefined,
  });
  const [allocations, setAllocations] = useState<IAgentFreeGiveawayAllocations[]>([]);
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();
  
  const handleCreate = (e: FormEvent<Element>) => {
    e.preventDefault();

    if (survey?.id && geoLocation?.lat && geoLocation?.lng) {
      const _responses: InputSurveyResponse[] = [];

      for (let i = 0; i < questionnaireFields.length; i+=1) {
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: questionnaireFields[i].feedback || {},
        });
      }

      create({
        variables: {
          input: { ...input, lat: geoLocation.lat, lng: geoLocation.lng, responses: _responses },
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
    if (runId) {
      getAllocations({ variables: { input: { runId } } });
    }
  }, [runId, getAllocations]);
  useEffect(() => {
    if (FGAllocations) {
      const _allocations: IAgentFreeGiveawayAllocations[] = [];

      for (let i = 0; i < FGAllocations.length; i+=1) {
        _allocations.push({
          index: FGAllocations[i].index,
          id: FGAllocations[i].id,
          quantityAllocated: FGAllocations[i].quantityAllocated,
          quantityGiven: FGAllocations[i].quantityGiven,
          product: {
            name: FGAllocations[i].product?.name,
            photo: FGAllocations[i].product?.photos[0]?.fileName,
            package: `${FGAllocations[i].packaging?.unitQuantity} ${FGAllocations[i].packaging?.unit?.name}`,
          },
        });
      }
      setAllocations(_allocations);
    }
  }, [FGAllocations]);
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
    if (created) {
      window.location.reload();
    }
  }, [created]);

  return (
    <Card>
      {geoLocation?.lat && geoLocation?.lng && (
        <CardContent>
          {!allocations?.length ? (
            <Typography variant="body1" align="center">
              You have not been allocated any giveaway products!
            </Typography>
          ) : (
            <>
              <Typography variant="h5" component="div" gutterBottom>
                <span className="text-uppercase">Products Allocations</span>
                {loadingAllocations ? <LoadingSpan /> : undefined}
              </Typography>

              <hr className="mt-0 mb-1" />

              {allocations?.map((allocation: any, index: number) => (
                <div key={`allocation-${index}`}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item md={7}>
                      <div className="d-flex align-items-start">
                        <Image
                          className="me-2 mt-1 mb-1"
                          src={sourceImage(allocation.product.photo)}
                          loader={() => sourceImage(allocation.product.photo)}
                          alt=""
                          width={TABLE_IMAGE_WIDTH}
                          height={TABLE_IMAGE_HEIGHT}
                        />
                        <div>
                          <Typography variant="h6" component="div">{allocation.product.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{allocation.product.package}</Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={5}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        disabled
                        placeholder={`Given away: ${allocation.quantityGiven} / ${allocation.quantityAllocated}`}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  setInput({
                                    ...input,
                                    freeGiveawayAllocationId: allocation.id,
                                  })
                                }
                              >
                                Give
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <hr className="mt-0 mb-1" />
                </div>
              ))}
            </>
          )}
        </CardContent>
      )}

      <Dialog
        open={Boolean(input.freeGiveawayAllocationId)}
        onClose={() => setInput({ ...input, freeGiveawayAllocationId: undefined })}
        aria-labelledby="new-report-modal"
      >
        <DialogTitle id="new-report-modal">New Free Giveaway Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                required={survey?.requireRespondentName}
                defaultValue={input.respondentName}
                onChange={(e) =>
                  setInput({
                    ...input,
                    respondentName: e.target.value === '' ? undefined : e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PhoneNumberInput
                phonekey="respondentPhone"
                required={survey?.requireRespondentPhone}
                input={input}
                onChange={setInput}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Customer Email"
                required={survey?.requireRespondentEmail}
                defaultValue={input.respondentEmail}
                onChange={(e) =>
                  setInput({
                    ...input,
                    respondentEmail: e.target.value === '' ? undefined : e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Giveaway Quantity"
                type="number"
                required
                defaultValue={input.quantityGiven}
                onChange={(e) =>
                  setInput({
                    ...input,
                    quantityGiven: parseInt(e.target.value, 10),
                  })
                }
              />
            </Grid>
          </Grid>

          <hr className="mt-1 mb-1" />

          {loadingSurvey && <LoadingDiv label="Please wait..." />}

          <QuestionnaireForm
            questionnaireFields={questionnaireFields}
            setQuestionnaireFields={setQuestionnaireFields}
            submitting={creating}
            handleSubmit={(e: FormEvent<Element>) => handleCreate(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInput({ ...input, freeGiveawayAllocationId: undefined })} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary" disabled={creating}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
