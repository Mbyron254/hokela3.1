'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ReactStars from 'react-stars';
import Webcam from 'react-webcam';
import { TextField, Button, Card, CardContent, Typography, FormControlLabel, Radio, RadioGroup, Checkbox, Select, MenuItem } from '@mui/material';

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

interface QuestionnaireFormProps {
  questionnaireFields: IQuestionnairField[];
  setQuestionnaireFields: React.Dispatch<React.SetStateAction<IQuestionnairField[]>>;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionnaireFields,
  setQuestionnaireFields,
  submitting,
  handleSubmit,
}) => {
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
      <form className="col-md-12" onSubmit={handleSubmit}>
        {questionnaireFields?.map((element: IQuestionnairField, i: number) => (
          <div className="row" key={`element-${i}`}>
            {element.feedbackType === TEXT_SHORT && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <TextField
                  type="text"
                  fullWidth
                  required={element.isRequired}
                  id={`text-short-${element.id}`}
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === TEXT_LONG && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  required={element.isRequired}
                  id={`text-long-${element.id}`}
                  placeholder=" "
                  rows={4}
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === NUMBER && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  required={element.isRequired}
                  id={`text-number-${element.id}`}
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === PHONE_NUMBER && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
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
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  required={element.isRequired}
                  id={`date-${element.id}`}
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === EMAIL && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <TextField
                  type="email"
                  fullWidth
                  required={element.isRequired}
                  id={`text-email-${element.id}`}
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === URL && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <TextField
                  type="url"
                  fullWidth
                  required={element.isRequired}
                  id={`text-url-${element.id}`}
                  placeholder=""
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                />
              </div>
            )}

            {element.feedbackType === RATING && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
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
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <RadioGroup
                  name={`customRadio${element.id}`}
                  onChange={(e) =>
                    editFeedbackSingleChoice(
                      element.id,
                      e.target.value,
                      questionnaireFields,
                      setQuestionnaireFields,
                    )
                  }
                >
                  {element.optionsChoiceSingle?.map((option, index: number) => (
                    <FormControlLabel
                      key={`option-${index}`}
                      value={option.text}
                      control={<Radio />}
                      label={option.text}
                    />
                  ))}
                </RadioGroup>
              </div>
            )}

            {element.feedbackType === CHOICE_MULTIPLE && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                {element.optionsChoiceMultiple?.map((option, index: number) => (
                  <FormControlLabel
                    key={`multichoice-option-${element.id}-${index}`}
                    control={
                      <Checkbox
                        onChange={() =>
                          editFeedbackMultiChoice(
                            element.id,
                            option,
                            questionnaireFields,
                            setQuestionnaireFields,
                          )
                        }
                      />
                    }
                    label={option.text}
                  />
                ))}
              </div>
            )}

            {element.feedbackType === DROPDOWN && (
              <div className="col-md-12 mb-3">
                <Typography variant="h6" component="p">
                  {element.question}
                  {element.isRequired && <span className="text-warning ms-1">*</span>}
                </Typography>
                <Select
                  fullWidth
                  required={element.isRequired}
                  id={`text-dropdown-${element.id}`}
                  onChange={(e) =>
                    editFeedback(element.id, e.target.value, questionnaireFields, setQuestionnaireFields)
                  }
                >
                  <MenuItem value="">
                    <em>Select Option</em>
                  </MenuItem>
                  {element.optionsDropdown?.map((option, index: number) => (
                    <MenuItem key={`dropdown-option-${index}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}

            {element.feedbackType === PICTURE && (
              <div className="col-md-12 mb-3">
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h5">
                      {element.question}
                      {element.isRequired && <span className="text-warning ms-1">*</span>}
                    </Typography>
                    <Webcam
                      screenshotFormat="image/jpeg"
                      ref={webcamRef}
                      mirrored
                      disablePictureInPicture
                      forceScreenshotSourceSize
                      imageSmoothing={false}
                      audio={false}
                      videoConstraints={{
                        facingMode: { exact: 'environment' },
                        width: 200,
                        height: 150,
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={picture.loading}
                      onClick={() => capture(element.id)}
                    >
                      {picture.loading ? 'Please wait...' : 'Take Photo'}
                    </Button>
                  </CardContent>
                </Card>
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
                        <Card className="m-1 shadow-none border">
                          <CardContent>
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <Image
                                  className="me-2 mt-1 mb-1"
                                  src={sourceImage(documentId)}
                                  loader={() => sourceImage(documentId)}
                                  alt=""
                                  width={60}
                                  height={40}
                                />
                              </div>
                              <div className="col ps-0">
                                <Typography variant="body2" component="p">
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
                                </Typography>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {element.feedbackType === GEOLOCATION && <div className="col-md-12"/>}
          </div>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="float-end mt-2"
          size="small"
          startIcon={<i className="mdi mdi-plus" />}
          disabled={submitting}
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          className="float-end mt-2 me-3"
          onClick={() => window.location.reload()}
        >
          Close
        </Button>
      </form>

      {/* <pre>{JSON.stringify(questionnaireFields, null, 2)}</pre> */}
    </div>
  );
};
