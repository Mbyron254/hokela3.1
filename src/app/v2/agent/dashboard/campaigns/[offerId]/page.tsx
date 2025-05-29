'use client';

import Image from 'next/image';
import PhoneNumberInput from 'src/components/PhoneNumberInput';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { Fragment, useEffect, useState } from 'react';
import { M_JANTA } from 'src/lib/mutations/run-offer.mutation';
import { M_AGENT_ALLOCATIONS, M_UPDATE_SALE } from 'src/lib/mutations/inventory-allocation.mutation';
import { commafy, formatDate, formatTimeTo12Hr, getGeoLocation } from 'src/lib/helpers';
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
import { Box, Grid, Typography, Button, Card, CardContent, Alert, Tab, Tabs, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { styled } from '@mui/material/styles';

const TabContent = styled('div')({
  padding: '16px',
});

const StyledCard = styled(Card)({
  marginBottom: '16px',
});

export default function Page({ params: { offerId } }: any) {
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
  console.log(addItem);

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
  const [tabValue, setTabValue] = useState('0');
  const [cartOpen, setCartOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [giveawayQuantity, setGiveawayQuantity] = useState<number | undefined>(undefined);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

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

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getGeoLocation(setGeoLocation);
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (offerId) {
      getJanta({ variables: { input: { id: offerId } } });
    }
  }, [offerId,getJanta]);
  useEffect(() => {
    if (offer?.run?.id) {
      getSurveySalesGiveaway({ variables: { input: { runId: offer.run.id } } });
      getSalesAllocations({
        variables: { input: { runId: offer.run.id } },
      });
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

        for (
          let k = 0;
          k < surveySalesGiveaway.questionnaireFields[i].optionsChoiceMultiple.length;
          k+=1
        ) {
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
    if (
      createdGiveawayReport
    )
      window.location.reload();
  }, [
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
          <StyledCard>
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
          </StyledCard>
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
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="activity tabs">
                {offer?.run?.types?.map((activity: any, i: number) => (
                  <Tab key={`run-type-${i}`} label={activity.name} value={String(i)} />
                ))}
              </TabList>
            </Box>
            {offer?.run?.types?.map((activity: any, i: number) => (
              <TabPanel key={`run-type-panel-${i}`} value={String(i)} sx={{ padding: '16px' }}>
                {(() => {
                  switch (activity.name) {
                    case RUN_ACTIVITY_SALES:
                      return (
                        <>
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
                                        <Button variant="contained" color="primary" onClick={handleCartOpen}>
                                          <i className="mdi mdi-cart-outline me-1"/>View Cart
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
                                            
                                            {allocation.giveaway.totalUnlocked - allocation.giveaway.totalIssued > 0 && (
                                              <Button
                                                variant="outlined"
                                                color="success"
                                                fullWidth
                                                onClick={() => {
                                                  setInputSalesGiveaway({
                                                    ...inputSalesGiveaway,
                                                    salesGiveawayConfigId: allocation.giveawayConfigId,
                                                  });
                                                  handleDialogOpen();
                                                }}
                                              >
                                                <span>
                                                Available Giveaways - {allocation.giveaway.totalUnlocked - allocation.giveaway.totalIssued}
                                                </span>
                                              </Button>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                    ))}

                                    <Grid item xs={12} className="text-center">
                                      <Button variant="contained" color="primary" onClick={handleCartOpen}>
                                        <i className="mdi mdi-cart-outline me-1"/>View Cart
                                      </Button>
                                    </Grid>
                                  </Grid>

                                  {offer?.run?.id && geoLocation?.lat && geoLocation?.lng && (
                                    <RunCartSales runId={offer.run.id} lat={geoLocation.lat} lng={geoLocation.lng} open={cartOpen} onClose={handleCartClose} />
                                  )}
                                </Grid>
                              </Grid>
                            )}
                          </div>

                          <div className="tab-pane" id={`activity-sales-history-${activity.id}`}>
                            {offer?.run?.id && <RunAgentHistoricSales runId={offer?.run?.id} />}
                          </div>
                        </>
                      );

                    case RUN_ACTIVITY_SAMPLING:
                      return (
                        <div>
                          {offer?.run?.id && <GiveawayReportFree runId={offer?.run?.id} />}
                        </div>
                      );

                    case RUN_ACTIVITY_SURVEY:
                      return (
                        <div>
                          {offer?.run?.id && <SurveyReport runId={offer.run.id} />}
                        </div>
                      );

                    case RUN_ACTIVITY_ROAD_SHOW:
                      return <p>Road show coming soon...</p>;

                    case RUN_ACTIVITY_STOCK_MAPPING:
                      return <p>Stock mapping coming soon...</p>;

                    default:
                      return <h4>No Activity</h4>;
                  }
                })()}
              </TabPanel>
            ))}
          </TabContext>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
        <DialogTitle>Sales Giveaway Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {!surveySalesGiveaway?.hideRespondentFields && (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="respondentName"
                    label="Customer Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    required={surveySalesGiveaway?.requireRespondentName}
                    value={inputSalesGiveaway.respondentName || ''}
                    onChange={(e) =>
                      setInputSalesGiveaway({
                        ...inputSalesGiveaway,
                        respondentName: e.target.value === '' ? undefined : e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <PhoneNumberInput
                    phonekey="respondentPhone"
                    required={surveySalesGiveaway?.requireRespondentPhone}
                    input={inputSalesGiveaway}
                    onChange={setInputSalesGiveaway}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    margin="dense"
                    id="respondentEmail"
                    label="Customer Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    required={surveySalesGiveaway?.requireRespondentEmail}
                    value={inputSalesGiveaway.respondentEmail || ''}
                    onChange={(e) =>
                      setInputSalesGiveaway({
                        ...inputSalesGiveaway,
                        respondentEmail: e.target.value === '' ? undefined : e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                id="giveawayUnits"
                label="Giveaway Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={inputSalesGiveaway.quantityGiven || ''}
                onChange={(e) =>
                  setInputSalesGiveaway({
                    ...inputSalesGiveaway,
                    quantityGiven: parseInt(e.target.value, 10),
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <QuestionnaireForm
            questionnaireFields={questionnaireFields}
            setQuestionnaireFields={setQuestionnaireFields}
            submitting={creatingGiveawayReport}
            handleSubmit={() => handleCreateGiveawayReport(new Event('submit'))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}