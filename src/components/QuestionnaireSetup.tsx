'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
// import { Icon } from '@iconify/react';
// import expandMore from '@iconify/icons-mdi/chevron-down';
// import addIcon from '@iconify/icons-mdi/plus';
// import deleteIcon from '@iconify/icons-mdi/delete';
// import cloudUpload from '@iconify/icons-mdi/cloud-upload';

import {
  CHOICE_MULTIPLE,
  CHOICE_SINGLE,
  DATE,
  DROPDOWN,
  EMAIL,
  FORM_ANSWER_TYPES,
  GEOLOCATION,
  MULTIMEDIA,
  NUMBER,
  PHONE_NUMBER,
  PICTURE,
  RATING,
  TEXT_SHORT,
  URL,
} from 'src/lib/constant';
import { generateShortUUIDV4, slugify } from 'src/lib/helpers';
import { IChoice, IQuestionnaireSetup, IQuestionnairField } from 'src/lib/interface/general.interface';
import {
  answerTypeEdit,
  editFormElementAllowMultipleFileUploads,
  editFormElementIsRequired,
  editFormElementNoDuplicateResponse,
  formElementAdd,
  formElementDropDownOptionAdd,
  formElementDropDownOptionRemove,
  formElementMultichoiceAdd,
  formElementMultiplechoiceRemove,
  formElementQuestionEdit,
  formElementRemove,
  singleChoiceAdd,
  singleChoiceRemove,
} from 'src/lib/survey.utils';
import { sourceImage } from 'src/lib/server';
import { IDocumentWrapper } from 'src/lib/interface/dropzone.type';
import { DropZone } from './dropzone/DropZone';
import { MutationButton } from './MutationButton';
import { Iconify } from './iconify/iconify';

export const QuestionnaireSetup = ({
  questionnaireFields,
  setQuestionnaireFields,
  mutating,
  mutation,
}: IQuestionnaireSetup) => {
  const [singleChoice, setSingleChoice] = useState<IChoice>({
    text: undefined,
    documentId: undefined,
  });
  const [multichoice, setMultichoice] = useState<IChoice>({
    text: undefined,
    documentId: undefined,
  });
  const [dropDownOption, setDropdownOption] = useState<string>('');
  const [documentsSingleChoice, setDocumentsSingleChoice] = useState<IDocumentWrapper[]>([]);
  const [documentsMultiChoice, setDocumentsMultiChoice] = useState<IDocumentWrapper[]>([]);

  useEffect(() => {
    if (documentsSingleChoice.length) {
      for (let i = 0; i < documentsSingleChoice.length; i += 1) {
        if (documentsSingleChoice[i].meta?.id) {
          setSingleChoice({
            ...singleChoice,
            documentId: documentsSingleChoice[i].meta.id,
          });
        }
      }
    }
  }, [documentsSingleChoice, setSingleChoice, singleChoice]);

  useEffect(() => {
    if (documentsMultiChoice.length) {
      for (let i = 0; i < documentsMultiChoice.length; i += 1) {
        if (documentsMultiChoice[i].meta?.id) {
          setMultichoice({
            ...multichoice,
            documentId: documentsMultiChoice[i].meta.id,
          });
        }
      }
    }
  }, [documentsMultiChoice, setMultichoice, multichoice]);

  const addElement = () => {
    const formElement: IQuestionnairField = {
      id: generateShortUUIDV4(),
      question: '',
      isRequired: false,
      noDuplicateResponse: false,
      feedbackType: TEXT_SHORT,
      optionsChoiceSingle: [],
      optionsChoiceMultiple: [],
      optionsDropdown: [],
      allowMultipleFileUploads: false,
    };

    const updatedFields = [...questionnaireFields, formElement];
    console.log('UpdatedFields: ', updatedFields);
    setQuestionnaireFields(updatedFields);
  }

  return (
    <>
      <div>
        {questionnaireFields.map((element, i: number) => (
          <Accordion key={`element-${i}`} defaultExpanded={i === 0}>
            <AccordionSummary
              expandIcon={<Iconify icon="mdi:chevron-down" />}
              aria-controls={`panel${i}-content`}
              id={`panel${i}-header`}
            >
              <Typography variant="h6">
                {i + 1}. {element.question} {element.isRequired && <span style={{ color: 'orange' }}>*</span>}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <TextField
                  fullWidth
                  label="Question"
                  variant="outlined"
                  defaultValue={element.question}
                  onChange={(e) =>
                    formElementQuestionEdit(
                      element.id,
                      e.target.value,
                      questionnaireFields,
                      setQuestionnaireFields,
                    )
                  }
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Answer Type</InputLabel>
                  <Select
                    value={element.feedbackType}
                    onChange={(e) =>
                      answerTypeEdit(
                        element.id,
                        e.target.value,
                        questionnaireFields,
                        setQuestionnaireFields,
                      )
                    }
                  >
                    {FORM_ANSWER_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {element.feedbackType === CHOICE_SINGLE && (
                  <>
                    <DropZone
                      name="photo"
                      classes="dropzone text-center mt-2"
                      acceptedImageTypes={['.png', '.jpeg', '.jpg']}
                      maxSize={1375000000} // 1 GB
                      multiple={false}
                      reference={element.id}
                      files={documentsSingleChoice}
                      setFiles={setDocumentsSingleChoice}
                    />
                    <TextField
                      fullWidth
                      label="Single choice option"
                      variant="outlined"
                      value={singleChoice.text}
                      onChange={(e) =>
                        setSingleChoice({
                          ...singleChoice,
                          text: e.target.value,
                        })
                      }
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Iconify icon="mdi:plus" />}
                      onClick={() =>
                        singleChoiceAdd(
                          element.id,
                          singleChoice,
                          setSingleChoice,
                          questionnaireFields,
                          setQuestionnaireFields,
                        )
                      }
                    >
                      Add
                    </Button>
                    <div className="row mx-n1 g-0 mt-2 mb-0">
                      {element.optionsChoiceSingle?.map((option) => (
                        <div
                          className="col-xxl-12 col-lg-12"
                          key={`option-${slugify(option.text as string)}`}
                        >
                          <div className="card m-1 shadow-none border">
                            <div className="p-2">
                              <div className="row align-items-center">
                                <div className="col-auto">
                                  <div className="avatar-sm me-3">
                                    <Image
                                      className="me-2 mt-1 mb-1"
                                      src={sourceImage(option.documentId)}
                                      loader={() => sourceImage(option.documentId)}
                                      alt=""
                                      width={60}
                                      height={40}
                                    />
                                  </div>
                                </div>
                                <div className="col ps-0">
                                  <a
                                    href="#"
                                    className="text-muted fw-bold"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      singleChoiceRemove(
                                        element.id,
                                        option,
                                        setSingleChoice,
                                        questionnaireFields,
                                        setQuestionnaireFields,
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        singleChoiceRemove(
                                          element.id,
                                          option,
                                          setSingleChoice,
                                          questionnaireFields,
                                          setQuestionnaireFields,
                                        );
                                      }
                                    }}
                                  >
                                    {option.text}
                                  </a>
                                  <button
                                    type="button"
                                    className="btn btn-outline-warning btn-sm text-warning p-0 px-1 float-end"
                                    onClick={() =>
                                      singleChoiceRemove(
                                        element.id,
                                        option,
                                        setSingleChoice,
                                        questionnaireFields,
                                        setQuestionnaireFields,
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {element.feedbackType === CHOICE_MULTIPLE && (
                  <>
                    <DropZone
                      name="photo"
                      classes="dropzone text-center mt-2"
                      acceptedImageTypes={['.png', '.jpeg', '.jpg']}
                      maxSize={1375000000} // 1 GB
                      multiple={false}
                      reference={element.id}
                      files={documentsMultiChoice}
                      setFiles={setDocumentsMultiChoice}
                    />
                    <TextField
                      fullWidth
                      label="Multichoice"
                      variant="outlined"
                      value={multichoice.text}
                      onChange={(e) =>
                        setMultichoice({
                          ...multichoice,
                          text: e.target.value,
                        })
                      }
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Iconify icon="mdi:plus" />}
                      onClick={() =>
                        formElementMultichoiceAdd(
                          element.id,
                          multichoice,
                          setMultichoice,
                          questionnaireFields,
                          setQuestionnaireFields,
                        )
                      }
                    >
                      Add
                    </Button>
                    <div className="row mx-n1 g-0 mt-2 mb-2">
                      {element.optionsChoiceMultiple?.map((option) => (
                        <div
                          className="col-xxl-12 col-lg-12"
                          key={`option-${slugify(option.text as string)}`}
                        >
                          <div className="card m-1 shadow-none border">
                            <div className="p-2">
                              <div className="row align-items-center">
                                {option.documentId ? (
                                  <div className="col-auto">
                                    <div className="avatar-sm">
                                      <Image
                                        className="me-2 mt-1 mb-1"
                                        src={sourceImage(option.documentId)}
                                        loader={() => sourceImage(option.documentId)}
                                        alt=""
                                        width={60}
                                        height={40}
                                      />
                                    </div>
                                  </div>
                                ) : undefined}
                                <div className="col ps-0 ms-3">
                                  <a
                                    href="#"
                                    className="text-muted fw-bold"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                      singleChoiceRemove(
                                        element.id,
                                        option,
                                        setSingleChoice,
                                        questionnaireFields,
                                        setQuestionnaireFields,
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        singleChoiceRemove(
                                          element.id,
                                          option,
                                          setSingleChoice,
                                          questionnaireFields,
                                          setQuestionnaireFields,
                                        );
                                      }
                                    }}
                                  >
                                    {option.text}
                                  </a>
                                  <button
                                    type="button"
                                    className="btn btn-outline-warning btn-sm text-warning p-0 px-1 float-end"
                                    onClick={() =>
                                      singleChoiceRemove(
                                        element.id,
                                        option,
                                        setSingleChoice,
                                        questionnaireFields,
                                        setQuestionnaireFields,
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {element.feedbackType === DROPDOWN && (
                  <>
                    <TextField
                      fullWidth
                      label="Dropdown Option"
                      variant="outlined"
                      value={dropDownOption}
                      onChange={(e) => setDropdownOption(e.target.value)}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Iconify icon="mdi:plus" />}
                      onClick={() =>
                        formElementDropDownOptionAdd(
                          element.id,
                          dropDownOption,
                          setDropdownOption,
                          questionnaireFields,
                          setQuestionnaireFields,
                        )
                      }
                    >
                      Add
                    </Button>
                    <ul className="list-group list-group-vertical mt-3 mb-3">
                      {element.optionsDropdown?.map((option) => (
                        <li key={`option-${slugify(option.value)}`} className="list-group-item">
                          {option.label}
                          <button
                            type="button"
                            className="btn btn-link p-0 ms-2 float-end"
                            onClick={() =>
                              formElementDropDownOptionRemove(
                                element.id,
                                option.value,
                                setDropdownOption,
                                questionnaireFields,
                                setQuestionnaireFields,
                              )
                            }
                          >
                            <Iconify icon="mdi:delete" style={{ color: 'orange' }} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {element.feedbackType === MULTIMEDIA && (
                  <div className="form-check form-switch float-end">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="allowMultipleFilesUpload"
                      onClick={() =>
                        editFormElementAllowMultipleFileUploads(
                          element.id,
                          questionnaireFields,
                          setQuestionnaireFields,
                        )
                      }
                    />
                    <p>Allow Multiple Files Upload</p>
                  </div>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={element.isRequired}
                      onChange={() =>
                        editFormElementIsRequired(
                          element.id,
                          !element.isRequired,
                          questionnaireFields,
                          setQuestionnaireFields,
                        )
                      }
                    />
                  }
                  label="Compulsory"
                />

                {element.feedbackType === TEXT_SHORT ||
                  element.feedbackType === NUMBER ||
                  element.feedbackType === PHONE_NUMBER ||
                  element.feedbackType === DATE ||
                  element.feedbackType === EMAIL ||
                  element.feedbackType === URL ||
                  element.feedbackType === RATING ||
                  element.feedbackType === GEOLOCATION ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={element.noDuplicateResponse}
                        onChange={() =>
                          editFormElementNoDuplicateResponse(
                            element.id,
                            !element.noDuplicateResponse,
                            questionnaireFields,
                            setQuestionnaireFields,
                          )
                        }
                      />
                    }
                    label="No Duplicate Responses"
                  />
                ) : null}

                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Iconify icon="mdi:delete" />}
                  onClick={() =>
                    formElementRemove(element.id, questionnaireFields, setQuestionnaireFields)
                  }
                >
                  Remove
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mdi:plus" />}
        onClick={addElement}
        style={{ marginTop: '16px' }}
      >
        Add Question
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mdi:plus" />}
        disabled={mutating}
        onClick={mutation}
        style={{ marginTop: '16px' }}
      >
        Submit
      </Button>
    </>
  );
};
