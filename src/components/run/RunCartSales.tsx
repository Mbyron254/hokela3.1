'use client';

import Image from 'next/image';

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
}> = ({ runId, lat, lng }) => {
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
  //   const { action: getShops, data: shops } = GQLMutation({
  //     mutation: M_SHOPS_MINI,
  //     resolver: 'm_shops',
  //     toastmsg: false,
  //   });
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

  //   const _inputSale: IInputSale = {
  //     salesRef: undefined,
  //     shopId: undefined,
  //     newShop: undefined,
  //   };
  const _inputSaleSurvey = {
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
    responses: undefined,
  };

  //   const [inputSale, setInputSale] = useState<IInputSale>(_inputSale);
  const [inputSaleSurvey, setInputSaleSurvey] = useState<IInputSaleSurvey>(_inputSaleSurvey);
  const [questionnaireFieldsSales, setQuestionnaireFieldsSales] = useState<IQuestionnairField[]>([]);

  //   const loadShops = () => {
  //     getShops({ variables: { input: {} } });
  //   };
  const loadSurveySales = () => {
    if (runId) {
      getSurveySales({ variables: { input: { runId } } });
    }
  };
  const handleSendReport = (e: Event) => {
    e.preventDefault();

    const _responses: InputSurveyResponse[] = [];

    for (let i = 0; i < questionnaireFieldsSales.length; i++) {
      _responses.push({
        questionnaireFieldId: questionnaireFieldsSales[i].id,
        feedback: questionnaireFieldsSales[i].feedback || {},
      });
    }

    const _items: IInputSaleItem[] = [];

    for (let i = 0; i < items.length; i++) {
      _items.push({
        allocationId: items[i].id,
        quantitySold: items[i].quantity,
      });
    }

    sendReport({
      variables: {
        input: {
          //   ...inputSale,
          runId,
          items: _items,
          //   newShop: inputSale.newShop
          //     ? {
          //         ...inputSale.newShop,
          //         lat,
          //         lng,
          //       }
          //     : undefined,
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

  //   useEffect(() => loadShops(), []);
  useEffect(() => loadSurveySales(), [runId]);
  useEffect(() => {
    if (surveySales) {
      const _fields = [];

      for (let i = 0; i < surveySales.questionnaireFields.length; i++) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < surveySales.questionnaireFields[i].optionsChoiceSingle.length; k++) {
          _singlechoice.push({
            text: surveySales.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: surveySales.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < surveySales.questionnaireFields[i].optionsChoiceMultiple.length; k++) {
          _multichoice.push({
            text: surveySales.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: surveySales.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < surveySales.questionnaireFields[i].optionsDropdown.length; k++) {
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
      window.location.reload();
    }
  }, [sentReport]);

  return (
    <div
      tabIndex={-1}
      className="offcanvas offcanvas-end"
      id="sales-cart"
      aria-labelledby="offcanvasRightLabel"
    >
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel">CART</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body">
        {isEmpty ? (
          <>
            <div className="alert alert-primary" role="alert">
              <strong className="font-16">Oops! It looks like your cart is empty </strong>
              <hr />
              <ol>
                <li>Go to the products you want to report as sold.</li>
                <li>Click the &quot;Add to Cart&quot; button on the products you are interested in.</li>
                <li>click &quot;View Cart&quot; and double check the products in your cart.</li>
                {/* <li>Select the mode of payment the customer is using to pay.</li> */}
                <li>Click &quot;Check Out&quot;</li>
                <li>Answer subsequent questions, if there is any.</li>
                <li>Click &quot;Submit&quot; to send your report.</li>
              </ol>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                Hide Cart
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-borderless table-centered mb-0">
                <tbody>
                  {items.map((item: any, i: number) => (
                    <tr key={`item-${i}`}>
                      <td className="p-0" style={{ width: '10%' }}>
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
                      </td>
                      <td className="p-2" style={{ width: '90%' }}>
                        <p className="m-0 font-16">
                          <a href={`/marketplace/${item.id}`} className="text-primary">
                            {item.name}
                          </a>
                        </p>

                        <div className="table-responsive">
                          <table className="table table-borderless table-centered mb-0">
                            <tbody>
                              <tr>
                                <td className="p-0">
                                  <span style={{}}>Price</span>
                                  <br />
                                  <p className="mt-1 fw-bold text-secondary">{commafy(item.price)}</p>
                                </td>
                                <td className="p-0">
                                  <span
                                    style={{
                                      marginTop: '0px',
                                      marginBottom: '3px',
                                    }}
                                  >
                                    Quantity
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    style={{
                                      width: '77px',
                                      // height: '35px',
                                      // paddingLeft: '4px',
                                      // paddingRight: '2px',
                                    }}
                                    value={item.quantity}
                                    defaultValue={item.quantity}
                                    onChange={(e) =>
                                      updateItemQuantity(item.id, parseFloat(e.target.value))
                                    }
                                  />
                                </td>
                                <td className="p-0">
                                  <span style={{}}>Total</span>
                                  <br />
                                  <p className="mt-1 fw-bold text-secondary">
                                    {commafy(item.price * item.quantity)}
                                  </p>
                                </td>
                                <td className="p-0">
                                  <a href="#" className="" onClick={() => removeItem(item.id)}>
                                    <i className="mdi mdi-cancel font-size-20 text-danger"></i>
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border p-3 mt-3 mb-3 mt-lg-0 rounded">
              <h6 className="mb-2 text-uppercase text-secondary">Order Summary</h6>

              <hr className="mb-0" />

              <div className="table-responsive">
                <table className="table mb-0">
                  <tbody>
                    <tr>
                      <td>Items : </td>
                      <td className="float-end">
                        {totalUniqueItems} Item
                        {totalUniqueItems > 1 ? 's' : undefined}
                      </td>
                    </tr>
                    <tr>
                      <td>Quantity : </td>
                      <td className="float-end">
                        {totalItems} Unit{totalItems > 1 ? 's' : undefined}
                      </td>
                    </tr>
                    <tr>
                      <th>Total Amount :</th>
                      <th className="float-end">
                        <span className="me-2">ksh</span>
                        <span className="text-success">{commafy(cartTotal)}</span>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {items.length > 0 && (
              <>
                <button className="btn btn-sm btn-danger" onClick={emptyCart}>
                  <i className="mdi mdi-trash-can-outline me-2"></i>Clear Cart
                </button>

                <button
                  className="btn btn-sm btn-success float-end"
                  data-bs-toggle="modal"
                  data-bs-target="#sales-report-modal"
                >
                  Check Out<i className="mdi mdi-arrow-right ms-2"></i>
                </button>
              </>
            )}
          </>
        )}

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
                {surveySales && (
                  <div className="card border border-secondary">
                    <div className="card-body">
                      {!surveySales.hideRespondentFields && (
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
                      )}
                      <QuestionnaireForm
                        questionnaireFields={questionnaireFieldsSales}
                        setQuestionnaireFields={setQuestionnaireFieldsSales}
                        submitting={sendingReport}
                        handleSubmit={handleSendReport}
                      />
                    </div>
                  </div>
                )}

                {/* <div className="card border border-secondary">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
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
                      <div className="col-md-6">
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
                                        shopCategoryId:
                                          e.target.value === '' ? undefined : e.target.value,
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
