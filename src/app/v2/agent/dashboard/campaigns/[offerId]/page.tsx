'use client';

import Image from 'next/image';
import PhoneNumberInput from 'src/components/PhoneNumberInput';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Fragment, useEffect, useState } from 'react';
import { M_JANTA } from 'src/lib/mutations/run-offer.mutation';
import { commafy, formatDate, formatTimeTo12Hr, getGeoLocation } from 'src/lib/helpers';
import { M_AGENT_ALLOCATIONS, M_UPDATE_SALE } from 'src/lib/mutations/inventory-allocation.mutation';
import { sourceImage } from 'src/lib/server';
import {
  LOCATION_PING_INTERVAL_MS,
  RUN_ACTIVITY_ROAD_SHOW,
  RUN_ACTIVITY_SALES,
  RUN_ACTIVITY_SAMPLING,
  RUN_ACTIVITY_STOCK_MAPPING,
  RUN_ACTIVITY_SURVEY,
  TABLE_IMAGE_HEIGHT,
  TABLE_IMAGE_WIDTH,
} from 'src/lib/constant';
import {
  IAnswerDropdownOption,
  IChoice,
  IGeoLocation,
  InputSalesGiveawaySurveyReportCreate,
  InputSurveyResponse,
  IQuestionnairField,
} from 'src/lib/interface/general.interface';
import { IAgentAllocation, IInputSale, IInputSaleSurvey } from 'src/lib/interface/campaign.interface';
import { SurveyReport } from 'src/components/run/SurveyReport';
import { GiveawayReportFree } from 'src/components/run/GiveawayReportFree';
import { M_SHOPS_MINI } from 'src/lib/mutations/shop.mutation';
import { Q_SHOP_SECTORS_MINI } from 'src/lib/queries/shop-sector.query';
import { Q_SHOP_CATEGORIES_MINI } from 'src/lib/queries/shop-category.query';
import { QuestionnaireForm } from 'src/components/QuestionnaireForm';
import {
  SALES_GIVEAWAY_REPORT_CREATE,
  SALES_GIVEAWAY_SURVEY,
} from 'src/lib/mutations/sales-giveaway.mutation';
import { SALES_SURVEY } from 'src/lib/mutations/sales-survey.mutation';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { RunCartSales } from 'src/components/run/RunCartSales';
import { useCart } from 'react-use-cart';
import { AGENT_RUN_SALES } from 'src/lib/mutations/inventory.mutation';
import { RunSampling } from 'src/components/run/RunSampling';
import { RunAgentHistoricSales } from 'src/components/run/RunAgentHistoricSales';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Box, Grid, Typography, Button, Card, CardContent, Alert, Tab, Tabs } from '@mui/material';

export default function Page({ params: { offerId } }: any) {
  // const { action: getShops, data: shops } = GQLMutation({
  //   mutation: M_SHOPS_MINI,
  //   resolver: 'm_shops',
  //   toastmsg: false,
  // });
  const {
    action: getJanta,
    loading: loadingJanta,
    data: offer,
  } = GQLMutation({
    mutation: M_JANTA,
    resolver: 'janta',
    toastmsg: false,
  });
  const {
    action: getSalesAllocations,
    loading: loadingAllocationSales,
    data: allocationSales,
  } = GQLMutation({
    mutation: M_AGENT_ALLOCATIONS,
    resolver: 'agentAllocations',
    toastmsg: false,
  });
  const { action: getSurveySalesGiveaway, data: surveySalesGiveaway } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY,
    resolver: 'salesGiveawaySurvey',
    toastmsg: false,
  });
  // const { action: getSurveySales, data: surveySales } = GQLMutation({
  //   mutation: SALES_SURVEY,
  //   resolver: 'salesSurvey',
  //   toastmsg: false,
  // });
  // const {
  //   action: updateSale,
  //   loading: updating,
  //   data: updatedSales,
  // } = GQLMutation({
  //   mutation: M_UPDATE_SALE,
  //   resolver: 'updateSale',
  //   toastmsg: true,
  // });
  // ----------
  // const { data: sectors } = GQLQuery({
  //   query: Q_SHOP_SECTORS_MINI,
  //   queryAction: 'shopSectors',
  //   variables: { input: {} },
  // });
  // const { data: categories } = GQLQuery({
  //   query: Q_SHOP_CATEGORIES_MINI,
  //   queryAction: 'shopCategories',
  //   variables: { input: {} },
  // });
  const {
    action: createGiveawayReport,
    loading: creatingGiveawayReport,
    data: createdGiveawayReport,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_REPORT_CREATE,
    resolver: 'salesGiveawayReportCreate',
    toastmsg: true,
  });

  const { addItem } = useCart();

  // const _inputSale: IInputSale = {
  //   allocationId: undefined,
  //   shopId: undefined,
  //   quantitySold: 0,
  //   salesRef: undefined,
  //   newShop: undefined,
  // };
  // const _inputSaleSurvey = {
  //   respondentName: undefined,
  //   respondentPhone: undefined,
  //   respondentEmail: undefined,
  //   responses: undefined,
  // };
  const [allocations, setAllocations] = useState<IAgentAllocation[]>([]);
  // const [inputSale, setInputSale] = useState<IInputSale>(_inputSale);
  // const [inputSaleSurvey, setInputSaleSurvey] = useState<IInputSaleSurvey>(_inputSaleSurvey);
  const [inputSalesGiveaway, setInputSalesGiveaway] = useState<InputSalesGiveawaySurveyReportCreate>({
    salesGiveawayConfigId: undefined,
    quantityGiven: undefined,
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
  });
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  // const [questionnaireFieldsSales, setQuestionnaireFieldsSales] = useState<IQuestionnairField[]>([]);
  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();

  // const loadShops = () => {
  //   getShops({ variables: { input: {} } });
  // };
  const loadJanta = () => {
    if (offerId) {
      getJanta({ variables: { input: { id: offerId } } });
    }
  };
  const loadSalesAllocations = () => {
    if (offer?.run?.id) {
      getSalesAllocations({
        variables: { input: { runId: offer.run.id } },
      });
    }
  };
  const loadSurveySalesGiveaway = () => {
    if (offer?.run?.id) {
      getSurveySalesGiveaway({ variables: { input: { runId: offer.run.id } } });
    }
  };
  // const loadSurveySales = () => {
  //   if (offer?.run?.id) {
  //     getSurveySales({ variables: { input: { runId: offer.run.id } } });
  //   }
  // };
  // const handleUpdateSale = (e: Event) => {
  //   e.preventDefault();

  //   if (geoLocation?.lat && geoLocation?.lng) {
  //     const _responses: InputSurveyResponse[] = [];

  //     for (let i = 0; i < questionnaireFieldsSales.length; i++) {
  //       _responses.push({
  //         questionnaireFieldId: questionnaireFieldsSales[i].id,
  //         feedback: questionnaireFieldsSales[i].feedback || {},
  //       });
  //     }

  //     updateSale({
  //       variables: {
  //         input: {
  //           ...inputSale,
  //           newShop: inputSale.newShop
  //             ? {
  //                 ...inputSale.newShop,
  //                 lat: geoLocation.lat,
  //                 lng: geoLocation.lng,
  //               }
  //             : undefined,
  //           survey: surveySales
  //             ? {
  //                 ...inputSaleSurvey,
  //                 lat: geoLocation.lat,
  //                 lng: geoLocation.lng,
  //                 responses: _responses,
  //               }
  //             : undefined,
  //         },
  //       },
  //     });
  //   }
  // };
  const handleCreateGiveawayReport = (e: Event) => {
    e.preventDefault();

    if (geoLocation?.lat && geoLocation?.lng) {
      const _responses: InputSurveyResponse[] = [];

      for (let i = 0; i < questionnaireFields.length; i++) {
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
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
  // useEffect(() => loadShops(), []);
  useEffect(() => loadJanta(), [offerId]);
  useEffect(() => {
    loadSurveySalesGiveaway();
    // loadSurveySales();
    loadSalesAllocations();
  }, [offer?.run?.id]);

  useEffect(() => {
    if (allocationSales) {
      const _allocations: IAgentAllocation[] = [];

      for (let i = 0; i < allocationSales.length; i++) {
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
  // useEffect(() => {
  //   if (surveySales) {
  //     const _fields = [];

  //     for (let i = 0; i < surveySales.questionnaireFields.length; i++) {
  //       const _dropdown: IAnswerDropdownOption[] = [];
  //       const _singlechoice: IChoice[] = [];
  //       const _multichoice: IChoice[] = [];

  //       for (let k = 0; k < surveySales.questionnaireFields[i].optionsChoiceSingle.length; k++) {
  //         _singlechoice.push({
  //           text: surveySales.questionnaireFields[i].optionsChoiceSingle[k].text,
  //           documentId: surveySales.questionnaireFields[i].optionsChoiceSingle[k].documentId,
  //         });
  //       }

  //       for (let k = 0; k < surveySales.questionnaireFields[i].optionsChoiceMultiple.length; k++) {
  //         _multichoice.push({
  //           text: surveySales.questionnaireFields[i].optionsChoiceMultiple[k].text,
  //           documentId: surveySales.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
  //         });
  //       }

  //       for (let k = 0; k < surveySales.questionnaireFields[i].optionsDropdown.length; k++) {
  //         _dropdown.push({
  //           value: surveySales.questionnaireFields[i].optionsDropdown[k].value,
  //           label: surveySales.questionnaireFields[i].optionsDropdown[k].label,
  //         });
  //       }

  //       _fields.push({
  //         id: surveySales.questionnaireFields[i].id,
  //         isRequired: surveySales.questionnaireFields[i].isRequired,
  //         noDuplicateResponse: surveySales.questionnaireFields[i].noDuplicateResponse,
  //         question: surveySales.questionnaireFields[i].question,
  //         optionsChoiceSingle: _singlechoice,
  //         optionsChoiceMultiple: _multichoice,
  //         optionsDropdown: _dropdown,
  //         feedbackType: surveySales.questionnaireFields[i].feedbackType,
  //         allowMultipleFileUploads: surveySales.questionnaireFields[i].allowMultipleFileUploads,
  //       });
  //     }
  //     setQuestionnaireFieldsSales(_fields);
  //   }
  // }, [surveySales]);
  useEffect(() => {
    if (surveySalesGiveaway) {
      const _fields = [];

      for (let i = 0; i < surveySalesGiveaway.questionnaireFields.length; i++) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < surveySalesGiveaway.questionnaireFields[i].optionsChoiceSingle.length; k++) {
          _singlechoice.push({
            text: surveySalesGiveaway.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: surveySalesGiveaway.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (
          let k = 0;
          k < surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple.length;
          k++
        ) {
          _multichoice.push({
            text: surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < surveySalesGiveaway.questionnaireFields[i].optionsDropdown.length; k++) {
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
    if (
      //updatedSales ||
      createdGiveawayReport
    )
      window.location.reload();
  }, [
    //updatedSales,
    createdGiveawayReport,
  ]);

  return (
    <Box sx={{ padding: 3 }}>
      <CustomBreadcrumbs
        heading="Campaign"
        links={[
          { name: 'Agent', href: '/agent' },
          { name: 'Campaigns', href: '/agent/campaigns' },
          { name: 'Campaign' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Name</Typography>
                <Typography>{offer?.run?.name}</Typography>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography variant="h6">From</Typography>
                <Typography>{formatDate(offer?.run?.dateStart, 'yyyy MMM dd')}</Typography>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography variant="h6">To</Typography>
                <Typography>{formatDate(offer?.run?.dateStop, 'yyyy MMM dd')}</Typography>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Checking</Typography>
                <Typography>
                  {formatTimeTo12Hr(offer?.run?.clockInTime)} to {formatTimeTo12Hr(offer?.run?.clockOutTime)}
                </Typography>
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
            <LoadingDiv label="Please wait..." />
          </Grid>
        )}

        <Grid item xs={12}>
          <Tabs value={0} aria-label="activity tabs">
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
          <div className="tab-content">
            {offer?.run?.types?.map((activity: any, i: number) => {
              switch (activity.name) {
                case RUN_ACTIVITY_SALES:
                  return (
                    <Fragment key={`run-type-${i}`}>
                      <div id={`activity-sales-${activity.id}`} className={`tab-pane ${i === 0 ? 'show active' : ''}`}>
                        {geoLocation?.lat && geoLocation?.lng && (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              {!allocations?.length ? (
                                <Alert severity="info">
                                  {loadingAllocationSales ? <p>Loading...</p> : undefined}
                                  <strong>Heads Up! - </strong> You have not been allocated products to sale. Kindly follow up with your team leader.
                                </Alert>
                              ) : undefined}

                              <Card>
                                <CardContent>
                                  <Grid container justifyContent="space-between">
                                    <Typography>Product search...</Typography>
                                    <Button variant="contained" color="primary" data-bs-toggle="offcanvas" data-bs-target="#sales-cart" aria-controls="sales-cart">
                                      <i className="mdi mdi-cart-outline me-1"></i>View Cart
                                    </Button>
                                  </Grid>
                                </CardContent>
                              </Card>

                              <Grid container spacing={2}>
                                {allocations?.map((allocation: any, index: number) => (
                                  <Grid item xs={12} md={4} key={`allocation-${index}`}>
                                    <Card>
                                      <CardContent>
                                        <Typography variant="h5">{allocation.product?.name}</Typography>
                                        <Typography>Packaging: {commafy(allocation.product.packaging)}</Typography>
                                        <Typography>Price: {commafy(allocation.unitPrice)} ksh</Typography>
                                        <Typography>Sold: {allocation.quantitySold} / {allocation.quantityAllocated} {allocation.product?.package}</Typography>
                                        <Button variant="outlined" color="info" fullWidth onClick={() => addItem({ sku: allocation.id, id: allocation.id, name: allocation.product?.name, price: parseFloat(allocation.unitPrice), image: allocation.product?.photo }, 1)}>
                                          <i className="mdi mdi-cart-plus me-1"></i>Add to Cart
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}

                                <Grid item xs={12} className="text-center">
                                  <Button variant="contained" color="primary" data-bs-toggle="offcanvas" data-bs-target="#sales-cart" aria-controls="sales-cart">
                                    <i className="mdi mdi-cart-outline me-1"></i>View Cart
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

                      <div className="tab-pane" id={`activity-sales-history-${activity.id}`}>
                        {offer?.run?.id && <RunAgentHistoricSales runId={offer?.run?.id} />}
                      </div>
                    </Fragment>
                  );

                case RUN_ACTIVITY_SAMPLING:
                  return (
                    <div
                      className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                      id={`activity-${activity.id}`}
                      key={`run-type-${i}`}
                    >
                      {offer?.run?.id && <GiveawayReportFree runId={offer?.run?.id} />}
                      {/* {offer?.run?.id && <RunSampling runId={offer?.run?.id} />} */}
                    </div>
                  );

                case RUN_ACTIVITY_SURVEY:
                  return (
                    <div
                      className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                      id={`activity-${activity.id}`}
                      key={`run-type-${i}`}
                    >
                      {offer?.run?.id && <SurveyReport runId={offer.run.id} />}
                    </div>
                  );

                case RUN_ACTIVITY_ROAD_SHOW:
                  return (
                    <div
                      className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                      id={`activity-${activity.id}`}
                      key={`run-type-${i}`}
                    >
                      <p>Road show coming soon...</p>
                    </div>
                  );

                case RUN_ACTIVITY_STOCK_MAPPING:
                  return (
                    <div
                      className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                      id={`activity-${activity.id}`}
                      key={`run-type-${i}`}
                    >
                      <p>Stock mapping coming soon...</p>
                    </div>
                  );

                default:
                  return (
                    <div
                      className={`tab-pane ${i === 0 ? 'show active' : ''}`}
                      id="no-activity"
                      key={`run-type-${i}`}
                    >
                      <h4>No Activity</h4>
                    </div>
                  );
              }
            })}
          </div>
        </Grid>
      </Grid>

      <div
        id="giveaway-report-modal"
        className="modal fade"
        role="dialog"
        aria-labelledby="new-report-modal"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="new-report-modal">
                Sales Giveaway Report
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="row">
                {!surveySalesGiveaway?.hideRespondentFields && (
                  <>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="respondentName" className="form-label">
                          Customer Name
                          {surveySalesGiveaway?.requireRespondentName ? (
                            <span className="text-warning ms-1">*</span>
                          ) : undefined}
                        </label>
                        <input
                          type="text"
                          id="respondentName"
                          className="form-control"
                          placeholder=""
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
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="respondentPhone" className="form-label">
                          Customer Phone
                          {surveySalesGiveaway?.requireRespondentPhone ? (
                            <span className="text-warning ms-1">*</span>
                          ) : undefined}
                        </label>
                        <PhoneNumberInput
                          phonekey="respondentPhone"
                          required={surveySalesGiveaway?.requireRespondentPhone}
                          input={inputSalesGiveaway}
                          onChange={setInputSalesGiveaway}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="respondentEmail" className="form-label">
                          Customer Email
                          {surveySalesGiveaway?.requireRespondentEmail ? (
                            <span className="text-warning ms-1">*</span>
                          ) : undefined}
                        </label>
                        <input
                          type="text"
                          id="respondentEmail"
                          className="form-control"
                          placeholder=""
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
                    </div>
                  </>
                )}
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="giveawayUnits" className="form-label">
                      Giveaway Quantity<span className="text-warning ms-1">*</span>
                    </label>
                    <input
                      type="number"
                      id="giveawayUnits"
                      className="form-control"
                      placeholder=""
                      defaultValue={inputSalesGiveaway.quantityGiven}
                      onChange={(e) =>
                        setInputSalesGiveaway({
                          ...inputSalesGiveaway,
                          quantityGiven: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <QuestionnaireForm
                questionnaireFields={questionnaireFields}
                setQuestionnaireFields={setQuestionnaireFields}
                submitting={creatingGiveawayReport}
                handleSubmit={handleCreateGiveawayReport}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

/*
  <div className="mb-2">
    {allocations?.map((allocation: any, index: number) => (
      <div key={`allocation-${index}`}>
        <dl className="row mb-0">
          <dt className="col-md-7">
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
                <h5 className="mt-0 mb-0">{allocation.product.name}</h5>
                <span className="font-12">
                  {allocation.product.package}
                  <i className="mdi mdi-at text-muted mx-1"></i>
                  <span className="text-muted me-1">ksh:</span>
                  {commafy(allocation.unitPrice)}
                </span>
              </div>
            </div>
          </dt>
          <dd className="col-md-5">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control font-14"
                disabled={true}
                placeholder={`Sold: ${allocation.quantitySold} / ${allocation.quantityAllocated}`}
              />
              {surveySalesGiveaway?.id &&
                allocation.giveaway.totalUnlocked -
                  allocation.giveaway.totalIssued >
                  0 && (
                  <button
                    className="btn btn-outline-success btn-sm"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#giveaway-report-modal"
                    style={{ padding: '0 8px 0px 8px' }}
                    onClick={() =>
                      setInputSalesGiveaway({
                        ...inputSalesGiveaway,
                        salesGiveawayConfigId: allocation.giveawayConfigId,
                      })
                    }
                  >
                    <span className="me-1">
                      {allocation.giveaway.totalUnlocked -
                        allocation.giveaway.totalIssued}
                    </span>
                    Giveaway
                  </button>
                )}
              <button
                className="btn btn-outline-info btn-sm"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#sales-report-modal"
                style={{ padding: '0 8px 0px 8px' }}
                onClick={(e) =>
                  setInputSale({
                    ...inputSale,
                    allocationId: allocation.id,
                    shopId: undefined,
                    quantitySold: 0,
                  })
                }
                disabled={updating}
              >
                Sales Report
              </button>
            </div>
          </dd>
        </dl>
      </div>
    ))}
  </div>
*/

/*
  <div
    id="sales-report-modal"
    className="modal fade"
    role="dialog"
    aria-labelledby="sales-report-modal"
    aria-hidden="true"
    tabIndex={-1}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="sales-report-modal">
            New Sales Report
          </h4>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
        </div>
        <div className="modal-body">
          <div className="card border border-secondary">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-2">
                    <label htmlFor="quantity" className="form-label">
                      Quantity<span className="text-warning ms-1">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      value={inputSale.quantitySold}
                      onChange={(e) =>
                        setInputSale({
                          ...inputSale,
                          quantitySold: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label htmlFor="refNo" className="form-label">
                      Receipt / Other Reference No.
                    </label>
                    <input
                      type="text"
                      id="refNo"
                      className="form-control"
                      defaultValue={inputSale.salesRef}
                      onChange={(e) =>
                        setInputSale({
                          ...inputSale,
                          salesRef: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label htmlFor="shop" className="form-label">
                      Shop
                    </label>
                    <div className="input-group">
                      <select
                        id="shop"
                        className="form-select"
                        aria-label="Shop"
                        value={inputSale.shopId}
                        onChange={(e) =>
                          setInputSale({
                            ...inputSale,
                            shopId: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option></option>
                        {shops?.rows.map((shop: any, index: number) => (
                          <option value={shop.id} key={`shop-${index}`}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                      <a
                        className={`btn btn-outline-${inputSale.newShop ? 'danger' : 'secondary'}`}
                        data-bs-toggle="collapse"
                        href="#collapseNewShop"
                        aria-expanded="false"
                        aria-controls="collapseNewShop"
                        onClick={() => setInputSale({ ...inputSale, newShop: undefined })}
                      >
                        {inputSale.newShop ? 'Cancel Shop' : 'Create Shop'}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="collapse" id="collapseNewShop">
                    <h5 className="card-title text-uppercase text-muted">New Shop</h5>
                    <hr className="mt-0 mb-3" />

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={inputSale.newShop?.name}
                            onChange={(e) =>
                              setInputSale({
                                ...inputSale,
                                newShop: {
                                  ...inputSale.newShop,
                                  name: e.target.value,
                                },
                              })
                            }
                          />
                          <label htmlFor="name">Name</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <select
                            id="sector"
                            className="form-select"
                            value={inputSale.newShop?.shopSectorId}
                            onChange={(e) =>
                              setInputSale({
                                ...inputSale,
                                newShop: {
                                  ...inputSale.newShop,
                                  shopSectorId: e.target.value === '' ? undefined : e.target.value,
                                },
                              })
                            }
                          >
                            <option></option>
                            {sectors?.rows.map((sector: any, index: number) => (
                              <option value={sector.id} key={`sector-${index}`}>
                                {sector.name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="sector">Business Sector</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating mb-3">
                          <select
                            id="category"
                            className="form-select"
                            value={inputSale.newShop?.shopCategoryId}
                            onChange={(e) =>
                              setInputSale({
                                ...inputSale,
                                newShop: {
                                  ...inputSale.newShop,
                                  shopCategoryId: e.target.value === '' ? undefined : e.target.value,
                                },
                              })
                            }
                          >
                            <option></option>
                            {categories?.rows.map((category: any, index: number) => (
                              <option value={category.id} key={`category-${index}`}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="category">Category</label>
                        </div>
                      </div>
                    </div>


                    <a
                      className="btn btn-outline-danger btn-sm float-end"
                      data-bs-toggle="collapse"
                      href="#collapseNewShop"
                      aria-expanded="false"
                      aria-controls="collapseNewShop"
                      onClick={() => setInputSale({ ...inputSale, newShop: undefined })}
                    >
                      Cancel Shop Creation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {geoLocation?.lat && geoLocation?.lng && surveySales && (
            <div className="card border border-secondary">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="respondentName" className="form;-label">
                        Customer Name
                        {surveySales?.requireRespondentName ? (
                          <span className="text-warning ms-1">*</span>
                        ) : (
                          ''
                        )}
                      </label>
                      <input
                        type="text"
                        id="respondentName"
                        className="form-control"
                        placeholder=""
                        required={surveySales?.requireRespondentName}
                        defaultValue={inputSaleSurvey.respondentName}
                        onChange={(e) =>
                          setInputSaleSurvey({
                            ...inputSaleSurvey,
                            respondentName: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="respondentPhone" className="form-label">
                        Customer Phone
                        {surveySales?.requireRespondentPhone ? (
                          <span className="text-warning ms-1">*</span>
                        ) : (
                          ''
                        )}
                      </label>
                      <PhoneNumberInput
                        phonekey="respondentPhone"
                        required={surveySales?.requireRespondentPhone}
                        input={inputSaleSurvey}
                        onChange={setInputSaleSurvey}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="respondentEmail" className="form-label">
                        Customer Email
                        {surveySales?.requireRespondentEmail ? (
                          <span className="text-warning ms-1">*</span>
                        ) : (
                          ''
                        )}
                      </label>
                      <input
                        type="text"
                        id="respondentEmail"
                        className="form-control"
                        placeholder=""
                        required={surveySales?.requireRespondentEmail}
                        defaultValue={inputSaleSurvey.respondentEmail}
                        onChange={(e) =>
                          setInputSaleSurvey({
                            ...inputSaleSurvey,
                            respondentEmail: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <QuestionnaireForm
                  questionnaireFields={questionnaireFieldsSales}
                  setQuestionnaireFields={setQuestionnaireFieldsSales}
                  submitting={updating}
                  handleSubmit={handleUpdateSale}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
*/
