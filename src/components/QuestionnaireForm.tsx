'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ReactStars from 'react-stars';
import Webcam from 'react-webcam';

import {
  CHOICE_MULTIPLE,
  CHOICE_SINGLE,
  DATE,
  DROPDOWN,
  EMAIL,
  GEOLOCATION,
  MULTIMEDIA,
  NUMBER,
  PHONE_NUMBER,
  PICTURE,
  RATING,
  TEXT_LONG,
  TEXT_SHORT,
  URL,
} from 'src/lib/constant';
import {
  IPictureUpload,
  IQuestionnaireForm,
  IQuestionnairField,
} from 'src/lib/interface/general.interface';
import {
  editFeedback,
  editFeedbackMultiChoice,
  editFeedbackSingleChoice,
  findFeedback,
  removeDocumentFeedback,
} from 'src/lib/survey.utils';
import { MutationButton } from 'src/components/MutationButton';
import { IDocumentWrapper } from 'src/lib/interface/dropzone.type';
import { DropZone } from 'src/components/dropzone/DropZone';
import { sourceImage, uploadPhoto } from 'src/lib/server';
import PhoneNumberInputLegacy from './PhoneNumberInputLegacy';


export const QuestionnaireForm = ({
  questionnaireFields,
  setQuestionnaireFields,
  submitting,
  handleSubmit,
}: IQuestionnaireForm) => {
  const webcamRef = useRef<Webcam>(null);

  const [documents, setDocuments] = useState<IDocumentWrapper[]>([]);
  const [picture, setPicture] = useState<IPictureUpload>({
    id: undefined,
    reference: undefined,
    loading: false,
  });

  const capture = useCallback(
    (fieldId: string) => {
      uploadPhoto(webcamRef?.current?.getScreenshot(), setPicture, fieldId);
    },
    [webcamRef],
  );

  useEffect(() => {
    if (documents.length) {
      for (let i = 0; i < documents.length; i+=1) {
        if (documents[i].meta?.id && documents[i].meta?.reference) {
          const feedback = findFeedback(documents[i].meta?.reference, questionnaireFields);
          const documentIds = feedback ? (feedback as string[]) : [];
          const index = documentIds.findIndex((id) => id === documents[i].meta?.id);

          if (index === -1) {
            documentIds.push(documents[i].meta?.id);
          }

          editFeedback(
            documents[i].meta?.reference,
            documentIds,
            questionnaireFields,
            setQuestionnaireFields,
          );
        }
      }
    }
  }, [documents, questionnaireFields, setQuestionnaireFields]);

  useEffect(() => {
    if (picture.id && picture.reference) {
      editFeedback(picture.reference, picture.id, questionnaireFields, setQuestionnaireFields);
    }
  }, [picture.id, picture.reference, questionnaireFields, setQuestionnaireFields]);

  return (
    <div className="row">
      <form className="col-md-12" onSubmit={handleSubmit as any}>
        {questionnaireFields?.map((element: IQuestionnairField, i: number) => (
          <div className="row" key={`element-${i}`}>
            {element.feedbackType === TEXT_SHORT && (
              <div className="col-md-12 mb-3">
                <p className="form-label">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <input
                  type="text"
                  className="form-control"
                  id={`text-short-${element.id}`}
                  required={element.isRequired}
                  aria-describedby="error-log"
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === TEXT_LONG && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <textarea
                  className="form-control"
                  id={`text-long-${element.id}`}
                  required={element.isRequired}
                  aria-describedby="error-log"
                  placeholder=" "
                  style={{ height: '110px' }}
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === NUMBER && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <input
                  type="number"
                  className="form-control"
                  placeholder=""
                  id={`text-number-${element.id}`}
                  required={element.isRequired}
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === PHONE_NUMBER && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <PhoneNumberInputLegacy
                  required={element.isRequired}
                  value={element.feedback?._string as string}
                  onChange={(value: string) =>
                    editFeedback(element.id, value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === DATE && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  id={`date-${element.id}`}
                  required={element.isRequired}
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === EMAIL && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <input
                  type="email"
                  className="form-control"
                  id={`text-email-${element.id}`}
                  required={element.isRequired}
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === URL && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <input
                  type="url"
                  className="form-control"
                  id={`text-email-${element.id}`}
                  required={element.isRequired}
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === RATING && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <ReactStars
                  edit
                  half
                  count={5}
                  size={25}
                  value={parseFloat(element.feedback as string)}
                  color1="#bac6cb"
                  color2="#ff7000"
                  onChange={(weight) =>
                    editFeedback(
                      element.id,
                      weight.toFixed(1),
                      questionnaireFields,
                      setQuestionnaireFields,
                    )
                  }
                />
              </div>
            )}

            {element.feedbackType === CHOICE_SINGLE && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>

                <div className="row mt-2">
                  {element.optionsChoiceSingle?.map((option, index: number) => (
                    <div className="col-md-4" key={`option-${index}`}>
                      <div className="border rounded mb-0 p-0">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-check">
                              <input
                                name={`customRadio${element.id}`}
                                type="radio"
                                className="form-check-input"
                                id={`radio-${index}-${element.id}`}
                                onClick={() =>
                                  editFeedbackSingleChoice(
                                    element.id,
                                    option,
                                    questionnaireFields,
                                    setQuestionnaireFields,
                                  )
                                }
                              />
                              <p className="form-check-label font-16 fw-bold">
                                {option.text}
                              </p>
                            </div>
                            {option.documentId && (
                              <div className="mb-0 ps-3 pt-1">
                                <Image
                                  className="me-2 mt-1 mb-1"
                                  src={sourceImage(option.documentId)}
                                  loader={() => sourceImage(option.documentId)}
                                  alt=""
                                  width={60}
                                  height={40}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {element.feedbackType === CHOICE_MULTIPLE && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>

                <div className="row mt-2">
                  {element.optionsChoiceMultiple?.map((option, index: number) => (
                    <div className="col-md-4" key={`multichoice-option-${element.id}-${index}`}>
                      <div className="border p-0 mb-0 rounded">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`multichoice-check-${element.id}-${index}`}
                                value={option.text}
                                onClick={() =>
                                  editFeedbackMultiChoice(
                                    element.id,
                                    option,
                                    questionnaireFields,
                                    setQuestionnaireFields,
                                  )
                                }
                              />
                              <p className="form-check-label font-16 fw-bold">
                                {option.text}
                              </p>
                            </div>

                            {option.documentId && (
                              <div className="mb-0 ps-3 pt-1">
                                <Image
                                  className="me-2 mt-1 mb-1"
                                  src={sourceImage(option.documentId)}
                                  loader={() => sourceImage(option.documentId)}
                                  alt=""
                                  width={60}
                                  height={40}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {element.feedbackType === DROPDOWN && (
              <div className="col-md-12 mb-3">
                <p className="mb-1">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </p>
                <select
                  className="form-select"
                  id={`text-dropdown-${element.id}`}
                  required={element.isRequired}
                  aria-label="Dropdown"
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                >
                  <option value="">Select Option</option>
                  {element.optionsDropdown?.map((option, index: number) => (
                    <option key={`dropdown-option-${index}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {element.feedbackType === PICTURE && (
              <div className="col-md-12 mb-3">
                <div className="card">
                  <div className="row g-0 align-items-center">
                    <div className="col-md-4">
                      <Webcam
                        screenshotFormat="image/jpeg"
                        ref={webcamRef}
                        mirrored
                        disablePictureInPicture
                        forceScreenshotSourceSize
                        imageSmoothing={false}
                        audio={false}
                        videoConstraints={{
                          // facingMode: { exact: 'user' },
                          facingMode: { exact: 'environment' },
                          width: 200,
                          height: 150,
                        }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">
                          {element.question}
                          {element.isRequired && <span className="text-warning ms-1">*</span>}
                        </h5>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary mt-2 mb-0"
                          disabled={picture.loading}
                          onClick={() => capture(element.id)}
                        >
                          {picture.loading ? 'Please wait...' : 'Take Photo'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {element.feedbackType === MULTIMEDIA && (
              <div className="col-md-12">
                <DropZone
                  name="files"
                  classes="dropzone text-center mt-2 mb-2"
                  acceptedImageTypes={['.png', '.jpeg', '.jpg']}
                  maxSize={1375000000} // 1 GB
                  multiple={element.allowMultipleFileUploads}
                  reference={element.id}
                  hideProgressBar
                  files={documents}
                  setFiles={setDocuments}
                />

                {element.feedback && (
                  <div className="row mx-n1 g-0">
                    {(element.feedback as string[]).map((documentId: string) => (
                      <div className="col-xxl-3 col-lg-6" key={`document-${documentId}`}>
                        <div className="card m-1 shadow-none border">
                          <div className="p-2">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <div className="avatar-sm">
                                  <Image
                                    className="me-2 mt-1 mb-1"
                                    src={sourceImage(documentId)}
                                    loader={() => sourceImage(documentId)}
                                    alt=""
                                    width={60}
                                    height={40}
                                  />

                                  {/*
                                      <span className='avatar-title bg-light text-secondary rounded'>
                                        <i className='mdi mdi-folder-zip font-16'></i>
                                      </span>
                                    */}
                                </div>
                              </div>
                              <div className="col ps-0">
                                {/* <a
                                    href='javascript:void(0);'
                                    className='text-muted fw-bold'
                                  >
                                    {documentId}
                                  </a> */}
                                <p className="mb-0 font-13">
                                  {/* 2.3 MB */}
                                  <span
                                    className="float-end text-danger"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      removeDocumentFeedback(
                                        element.id,
                                        documentId,
                                        questionnaireFields,
                                        setQuestionnaireFields,
                                      )
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        removeDocumentFeedback(
                                          element.id,
                                          documentId,
                                          questionnaireFields,
                                          setQuestionnaireFields,
                                        );
                                      }
                                    }}
                                  >
                                    <i className="mdi mdi-cancel text-danger me-2" />
                                    Remove
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {element.feedbackType === GEOLOCATION && <div className="col-md-12"/>}
          </div>
        ))}

        <MutationButton
          type="submit"
          className="btn btn-primary float-end mt-2"
          size="sm"
          label="Submit"
          icon="mdi mdi-plus"
          loading={submitting}
        />
        <button
          type="button"
          className="btn btn-outline-danger btn-sm float-end mt-2 me-3"
          onClick={() => window.location.reload()}
        >
          Close
        </button>
      </form>

      {/* <pre>{JSON.stringify(questionnaireFields, null, 2)}</pre> */}
    </div>
  );
};
