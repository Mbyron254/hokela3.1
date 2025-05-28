'use client';

import Image from 'next/image';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, TextField, Card, CardContent, Grid } from '@mui/material';

import { commafy } from 'src/lib/helpers';
import { FC, useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import { sourceImage } from 'src/lib/server';
import { MutationButton } from 'src/components/MutationButton';
import { IInputSale, IInputSaleItem, IInputSaleSurvey } from 'src/lib/interface/campaign.interface';
import {
  IAnswerDropdownOption,
  IChoice,
  InputSalesGiveawaySurveyReportCreate,
  InputSurveyResponse,
  IQuestionnairField,
} from 'src/lib/interface/general.interface';
import { GQLMutation } from 'src/lib/client';
import { M_UPDATE_SALE } from 'src/lib/mutations/inventory-allocation.mutation';
import { M_SHOPS_MINI } from 'src/lib/mutations/shop.mutation';
import { SALES_SURVEY } from 'src/lib/mutations/sales-survey.mutation';
import PhoneNumberInput from '../PhoneNumberInput';
import { QuestionnaireForm } from '../QuestionnaireForm';

export const RunCartSales: FC<{
  runId: string;
  lat: number;
  lng: number;
  open: boolean;
  onClose: () => void;
}> = ({ runId, lat, lng, open, onClose }) => {
  const {
    isEmpty,
    cartTotal,
    totalUniqueItems,
    totalItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart,
  } = useCart();
 
  const { action: getSurveySales, data: surveySales } = GQLMutation({
    mutation: SALES_SURVEY,
    resolver: 'salesSurvey',
    toastmsg: false,
  });
  const {
    action: sendReport,
    loading: sendingReport,
    data: sentReport,
  } = GQLMutation({
    mutation: M_UPDATE_SALE,
    resolver: 'updateSale',
    toastmsg: true,
  });

  const _inputSaleSurvey = {
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
    responses: undefined,
  };

  const [inputSaleSurvey, setInputSaleSurvey] = useState<IInputSaleSurvey>(_inputSaleSurvey);
  const [questionnaireFieldsSales, setQuestionnaireFieldsSales] = useState<IQuestionnairField[]>([]);
  const [salesReportOpen, setSalesReportOpen] = useState(false);

  const handleCheckOut = () => {
    setSalesReportOpen(true);
  };

  const handleCloseSalesReport = () => {
    setSalesReportOpen(false);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();

    const _responses: InputSurveyResponse[] = [];

    for (let i = 0; i < questionnaireFieldsSales.length; i+=1) {
      _responses.push({
        questionnaireFieldId: questionnaireFieldsSales[i].id,
        feedback: questionnaireFieldsSales[i].feedback || {},
      });
    }

    const _items: IInputSaleItem[] = [];

    for (let i = 0; i < items.length; i+=1) {
      _items.push({
        allocationId: items[i].id,
        quantitySold: items[i].quantity,
      });
    }

    sendReport({
      variables: {
        input: {
          runId,
          items: _items,
          survey: surveySales
            ? {
                ...inputSaleSurvey,
                lat,
                lng,
                responses: _responses,
              }
            : undefined,
        },
      },
    });
  };

  useEffect(() => {
    if (runId) {
      getSurveySales({ variables: { input: { runId } } });
    }
  }, [runId, getSurveySales]);
  useEffect(() => {
    if (surveySales) {
      const _fields = [];

      for (let i = 0; i < surveySales.questionnaireFields.length; i+=1) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < surveySales.questionnaireFields[i].optionsChoiceSingle.length; k+=1) {
          _singlechoice.push({
            text: surveySales.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: surveySales.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < surveySales.questionnaireFields[i].optionsChoiceMultiple.length; k+=1) {
          _multichoice.push({
            text: surveySales.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: surveySales.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < surveySales.questionnaireFields[i].optionsDropdown.length; k+=1) {
          _dropdown.push({
            value: surveySales.questionnaireFields[i].optionsDropdown[k].value,
            label: surveySales.questionnaireFields[i].optionsDropdown[k].label,
          });
        }

        _fields.push({
          id: surveySales.questionnaireFields[i].id,
          isRequired: surveySales.questionnaireFields[i].isRequired,
          noDuplicateResponse: surveySales.questionnaireFields[i].noDuplicateResponse,
          question: surveySales.questionnaireFields[i].question,
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
          feedbackType: surveySales.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: surveySales.questionnaireFields[i].allowMultipleFileUploads,
        });
      }
      setQuestionnaireFieldsSales(_fields);
    }
  }, [surveySales]);
  useEffect(() => {
    if (sentReport) {
      emptyCart();
      setSalesReportOpen(false);
      window.location.reload();
    }
  }, [sentReport, emptyCart]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Cart</DialogTitle>
        <DialogContent>
          {isEmpty ? (
            <Typography variant="body1" color="textSecondary">
              Oops! It looks like your cart is empty.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {items.map((item: any, i: number) => (
                    <TableRow key={`item-${i}`}>
                      <TableCell>
                        <a href={`/marketplace/${item.id}`}>
                          <Image
                            className="rounded m-0"
                            loader={() => sourceImage(item.image)}
                            src={sourceImage(item.image)}
                            alt=""
                            width={65}
                            height={70}
                          />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          <a href={`/marketplace/${item.id}`} className="text-primary">
                            {item.name}
                          </a>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Price: {commafy(item.price)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total: {commafy(item.price * item.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button color="secondary" onClick={() => removeItem(item.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
          {!isEmpty && (
            <Button onClick={handleCheckOut} color="primary" variant="contained">
              Check Out
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Sales Report Modal */}
      <Dialog 
        open={salesReportOpen} 
        onClose={handleCloseSalesReport} 
        fullWidth 
        maxWidth="lg"
      >
        <DialogTitle>New Sales Report</DialogTitle>
        <DialogContent>
          {surveySales && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                {!surveySales.hideRespondentFields && (
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            Customer Name
                            {surveySales?.requireRespondentName && (
                              <span style={{ color: '#ff9800', marginLeft: 4 }}>*</span>
                            )}
                          </>
                        }
                        required={surveySales?.requireRespondentName}
                        value={inputSaleSurvey.respondentName || ''}
                        onChange={(e) =>
                          setInputSaleSurvey({
                            ...inputSaleSurvey,
                            respondentName: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <div>
                        <Typography variant="body2" component="label" sx={{ mb: 1, display: 'block' }}>
                          Customer Phone
                          {surveySales?.requireRespondentPhone && (
                            <span style={{ color: '#ff9800', marginLeft: 4 }}>*</span>
                          )}
                        </Typography>
                        <PhoneNumberInput
                          phonekey="respondentPhone"
                          required={surveySales?.requireRespondentPhone}
                          input={inputSaleSurvey}
                          onChange={setInputSaleSurvey}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            Customer Email
                            {surveySales?.requireRespondentEmail && (
                              <span style={{ color: '#ff9800', marginLeft: 4 }}>*</span>
                            )}
                          </>
                        }
                        type="email"
                        required={surveySales?.requireRespondentEmail}
                        value={inputSaleSurvey.respondentEmail || ''}
                        onChange={(e) =>
                          setInputSaleSurvey({
                            ...inputSaleSurvey,
                            respondentEmail: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                )}
                <QuestionnaireForm
                  questionnaireFields={questionnaireFieldsSales}
                  setQuestionnaireFields={setQuestionnaireFieldsSales}
                  submitting={sendingReport}
                  handleSubmit={handleSendReport}
                />
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSalesReport} disabled={sendingReport}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReport} 
            variant="contained" 
            disabled={sendingReport}
            color="primary"
          >
            {sendingReport ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
