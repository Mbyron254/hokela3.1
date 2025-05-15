'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';

import { M_JANTA } from 'src/lib/mutations/run-offer.mutation';
import { M_AGENT_ALLOCATIONS, M_UPDATE_SALE } from 'src/lib/mutations/inventory-allocation.mutation';
import {
  SALES_GIVEAWAY_REPORT_CREATE,
  SALES_GIVEAWAY_SURVEY,
} from 'src/lib/mutations/sales-giveaway.mutation';
import {
  IAnswerDropdownOption,
  IChoice,
  IGeoLocation,
  InputSalesGiveawaySurveyReportCreate,
  InputSurveyResponse,
  IQuestionnairField,
} from 'src/lib/interface/general.interface';
import { IAgentAllocation, IInputSale, IInputSaleSurvey } from 'src/lib/interface/campaign.interface';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography, Tabs, Tab, Alert } from '@mui/material';
import PhoneNumberInput from 'src/components/PhoneNumberInput';
import { useCart } from 'react-use-cart';
import { RunCartSales } from 'src/components/run/RunCartSales';
import { RunAgentHistoricSales } from 'src/components/run/RunAgentHistoricSales';
import { SurveyReport } from 'src/components/run/SurveyReport';
import { GiveawayReportFree } from 'src/components/run/GiveawayReportFree';
import { QuestionnaireForm } from 'src/components/QuestionnaireForm';
import { commafy, formatDate, formatTimeTo12Hr, getGeoLocation } from 'src/lib/helpers';

export default function Page({ params: { offerId } }: any) {
  const { action: getJanta, loading: loadingJanta, data: offer } = GQLMutation({
    mutation: M_JANTA,
    resolver: 'janta',
    toastmsg: false,
  });
  const { action: getSalesAllocations, loading: loadingAllocationSales, data: allocationSales } = GQLMutation({
    mutation: M_AGENT_ALLOCATIONS,
    resolver: 'agentAllocations',
    toastmsg: false,
  });
  const { action: getSurveySalesGiveaway, data: surveySalesGiveaway } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY,
    resolver: 'salesGiveawaySurvey',
    toastmsg: false,
  });
  const { action: createGiveawayReport, loading: creatingGiveawayReport, data: createdGiveawayReport } = GQLMutation({
    mutation: SALES_GIVEAWAY_REPORT_CREATE,
    resolver: 'salesGiveawayReportCreate',
    toastmsg: true,
  });

  const { addItem } = useCart();
  const [allocations, setAllocations] = useState<IAgentAllocation[]>([]);
  const [inputSalesGiveaway, setInputSalesGiveaway] = useState<InputSalesGiveawaySurveyReportCreate>({
    salesGiveawayConfigId: undefined,
    quantityGiven: undefined,
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
  });
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();

  const handleCreateGiveawayReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (geoLocation?.lat && geoLocation?.lng) {
      const _responses: InputSurveyResponse[] = [];

      for (let i = 0; i < questionnaireFields.length; i+=1) {
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: questionnaireFields[i].feedback || {},
        });
      }

      createGiveawayReport({
        variables: {
          input: {
            ...inputSalesGiveaway,
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
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (offerId) {
      getJanta({ variables: { input: { id: offerId } } });
    }
  }, [offerId, getJanta]);
  useEffect(() => {
    if (offer?.run?.id) {
      getSalesAllocations({
        variables: { input: { runId: offer.run.id } },
      });
      getSurveySalesGiveaway({ variables: { input: { runId: offer.run.id } } });

    }
  }, [offer?.run?.id,getSalesAllocations,getSurveySalesGiveaway]);

  useEffect(() => {
    if (allocationSales) {
      const _allocations: IAgentAllocation[] = [];

      for (let i = 0; i < allocationSales.length; i+=1) {
        _allocations.push({
          index: allocationSales[i].index,
          id: allocationSales[i].id,
          quantityAllocated: allocationSales[i].quantityAllocated,
          quantitySold: allocationSales[i].quantitySold,
          unitPrice: allocationSales[i].unitPrice,
          giveawayConfigId: allocationSales[i].giveawayConfigId,
          product: {
            name: allocationSales[i].packaging?.product?.name,
            photo: allocationSales[i].packaging?.product?.photos[0]?.fileName,
            package: allocationSales[i].packaging?.unit?.name,
            packaging: `${allocationSales[i].packaging?.unitQuantity} ${allocationSales[i].packaging?.unit?.name}`,
          },
          giveaway: {
            totalUnlocked: allocationSales[i].giveaway?.totalUnlocked,
            totalIssued: allocationSales[i].giveaway?.totalIssued,
            packaging: {
              id: allocationSales[i].giveaway?.packaging?.id,
              unitQuantity: allocationSales[i].giveaway?.packaging?.unitQuantity,
              product: {
                id: allocationSales[i].giveaway?.packaging?.product?.id,
                name: allocationSales[i].giveaway?.packaging?.product?.name,
                photos: allocationSales[i].giveaway?.packaging?.product?.photos,
              },
              unit: {
                id: allocationSales[i].giveaway?.packaging?.unit?.id,
                name: allocationSales[i].giveaway?.packaging?.unit?.name,
              },
            },
          },
        });
      }
      setAllocations(_allocations);
    }
  }, [allocationSales]);

  useEffect(() => {
    if (surveySalesGiveaway) {
      const _fields = [];

      for (let i = 0; i < surveySalesGiveaway.questionnaireFields.length; i+=1) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < surveySalesGiveaway.questionnaireFields[i].optionsChoiceSingle.length; k+=1) {
          _singlechoice.push({
            text: surveySalesGiveaway.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: surveySalesGiveaway.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple.length; k+=1) {
          _multichoice.push({
            text: surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < surveySalesGiveaway.questionnaireFields[i].optionsDropdown.length; k+=1) {
          _dropdown.push({
            value: surveySalesGiveaway.questionnaireFields[i].optionsDropdown[k].value,
            label: surveySalesGiveaway.questionnaireFields[i].optionsDropdown[k].label,
          });
        }

        _fields.push({
          id: surveySalesGiveaway.questionnaireFields[i].id,
          isRequired: surveySalesGiveaway.questionnaireFields[i].isRequired,
          noDuplicateResponse: surveySalesGiveaway.questionnaireFields[i].noDuplicateResponse,
          question: surveySalesGiveaway.questionnaireFields[i].question,
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
          feedbackType: surveySalesGiveaway.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: surveySalesGiveaway.questionnaireFields[i].allowMultipleFileUploads,
        });
      }
      setQuestionnaireFields(_fields);
    }
  }, [surveySalesGiveaway]);

  useEffect(() => {
    if (createdGiveawayReport) window.location.reload();
  }, [createdGiveawayReport]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Typography variant="h6">Name: {offer?.run?.name}</Typography>
                  <Typography variant="body2">From: {formatDate(offer?.run?.dateStart, 'yyyy MMM dd')}</Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body2">To: {formatDate(offer?.run?.dateStop, 'yyyy MMM dd')}</Typography>
                  <Typography variant="body2">
                    Checking: {formatTimeTo12Hr(offer?.run?.clockInTime)} to {formatTimeTo12Hr(offer?.run?.clockOutTime)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {(!offer || !geoLocation?.lat || !geoLocation?.lng) && (
          <Grid item xs={12}>
            <Alert severity="info">
              <ol>
                <li>
                  {geoLocation?.lat && geoLocation?.lng
                    ? 'Confirmed your location.'
                    : 'Confirming your location. Please wait...'}
                </li>
                <li>
                  {loadingJanta
                    ? 'Loading my campaign...'
                    : !offer
                    ? 'Please refresh this page to retry loading campaign'
                    : 'Loaded campaign metadata'}
                </li>
              </ol>
            </Alert>
          </Grid>
        )}

        {loadingJanta && (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          <Tabs>
            {offer?.run?.types?.map((activity: any, i: number) => (
              <Tab key={`run-type-${i}`} label={activity.name} />
            ))}
          </Tabs>
        </Grid>

        {geoLocation?.err && (
          <Grid item xs={12}>
            <Alert severity="error">
              <strong>DANGER:</strong> We are unable to ping your device location.
              <br />
              {geoLocation?.err}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <div>
            {offer?.run?.types?.map((activity: any, i: number) => {
              switch (activity.name) {
                case 'Sales':
                  return (
                    <Fragment key={`run-type-${i}`}>
                      <div>
                        {geoLocation?.lat && geoLocation?.lng && (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              {!allocations?.length ? (
                                <Alert severity="info">
                                  {loadingAllocationSales ? <CircularProgress size={20} /> : undefined}
                                  <strong>Heads Up! - </strong> You have not been allocated products to sale. Kindly
                                  follow up with your team leader.
                                </Alert>
                              ) : undefined}

                              <Card>
                                <CardContent>
                                  <Grid container spacing={2}>
                                    <Grid item md={10}>
                                      Product search...
                                    </Grid>
                                    <Grid item md={2} textAlign="center">
                                      <Button
                                        variant="contained"
                                        onClick={() => {
                                          // Handle view cart
                                        }}
                                      >
                                        View Cart
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>

                              <Grid container spacing={2}>
                                {allocations?.map((allocation: any, index: number) => (
                                  <Grid item md={4} key={`allocation-${index}`}>
                                    <Card>
                                      <CardContent>
                                        <Typography variant="h5">{allocation.product?.name}</Typography>
                                        <Typography variant="body2">
                                          Packaging: {commafy(allocation.product.packaging)}
                                        </Typography>
                                        <Typography variant="body2">
                                          Price: {commafy(allocation.unitPrice)} ksh
                                        </Typography>
                                        <Typography variant="body2">
                                          Sold: {allocation.quantitySold}/{allocation.quantityAllocated}{' '}
                                          {allocation.product?.package}
                                        </Typography>
                                        <Button
                                          variant="outlined"
                                          onClick={() =>
                                            addItem(
                                              {
                                                sku: allocation.id,
                                                id: allocation.id,
                                                name: allocation.product?.name,
                                                price: parseFloat(allocation.unitPrice),
                                                image: allocation.product?.photo,
                                              },
                                              1, // quantity
                                            )
                                          }
                                        >
                                          Add to Cart
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}

                                <Grid item xs={12} textAlign="center">
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      // Handle view cart
                                    }}
                                  >
                                    View Cart
                                  </Button>
                                </Grid>
                              </Grid>

                              {offer?.run?.id && geoLocation?.lat && geoLocation?.lng && (
                                <RunCartSales runId={offer.run.id} lat={geoLocation.lat} lng={geoLocation.lng} />
                              )}
                            </Grid>
                          </Grid>
                        )}
                      </div>

                      <div>
                        {offer?.run?.id && <RunAgentHistoricSales runId={offer?.run?.id} />}
                      </div>
                    </Fragment>
                  );

                case 'Sampling':
                  return (
                    <div key={`run-type-${i}`}>
                      {offer?.run?.id && <GiveawayReportFree runId={offer?.run?.id} />}
                    </div>
                  );

                case 'Survey':
                  return (
                    <div key={`run-type-${i}`}>
                      {offer?.run?.id && <SurveyReport runId={offer.run.id} />}
                    </div>
                  );

                default:
                  return (
                    <div key={`run-type-${i}`}>
                      <Typography variant="h4">No Activity</Typography>
                    </div>
                  );
              }
            })}
          </div>
        </Grid>
      </Grid>

      <div>
        <div>
          <div>
            <Typography variant="h4">Sales Giveaway Report</Typography>
            <Button onClick={() => {}}>Close</Button>
          </div>
          <div>
            <Grid container spacing={2}>
              {!surveySalesGiveaway?.hideRespondentFields && (
                <>
                  <Grid item md={4}>
                    <div>
                      <p>
                        Customer Name
                        {surveySalesGiveaway?.requireRespondentName ? <span>*</span> : undefined}
                      </p>
                      <input
                        type="text"
                        required={surveySalesGiveaway?.requireRespondentName}
                        defaultValue={inputSalesGiveaway.respondentName}
                        onChange={(e) =>
                          setInputSalesGiveaway({
                            ...inputSalesGiveaway,
                            respondentName: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item md={4}>
                    <div>
                      <p>
                        Customer Phone
                        {surveySalesGiveaway?.requireRespondentPhone ? <span>*</span> : undefined}
                      </p>
                      <PhoneNumberInput
                        phonekey="respondentPhone"
                        required={surveySalesGiveaway?.requireRespondentPhone}
                        input={inputSalesGiveaway}
                        onChange={setInputSalesGiveaway}
                      />
                    </div>
                  </Grid>
                  <Grid item md={4}>
                    <div>
                      <p>
                        Customer Email
                        {surveySalesGiveaway?.requireRespondentEmail ? <span>*</span> : undefined}
                      </p>
                      <input
                        type="text"
                        required={surveySalesGiveaway?.requireRespondentEmail}
                        defaultValue={inputSalesGiveaway.respondentEmail}
                        onChange={(e) =>
                          setInputSalesGiveaway({
                            ...inputSalesGiveaway,
                            respondentEmail: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      />
                    </div>
                  </Grid>
                </>
              )}
              <Grid item md={4}>
                <div>
                  <p>
                    Giveaway Quantity<span>*</span>
                  </p>
                  <input
                    type="number"
                    defaultValue={inputSalesGiveaway.quantityGiven}
                    onChange={(e) =>
                      setInputSalesGiveaway({
                        ...inputSalesGiveaway,
                        quantityGiven: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
              </Grid>
            </Grid>

            <QuestionnaireForm
              questionnaireFields={questionnaireFields}
              setQuestionnaireFields={setQuestionnaireFields}
              submitting={creatingGiveawayReport}
              handleSubmit={handleCreateGiveawayReport as any}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}
