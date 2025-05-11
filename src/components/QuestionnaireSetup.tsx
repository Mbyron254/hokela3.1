'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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
import { slugify } from 'src/lib/helpers';
import { IChoice, IQuestionnaireSetup } from 'src/lib/interface/general.interface';
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
      for (let i = 0; i < documentsSingleChoice.length; i+=1) {
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
      for (let i = 0; i < documentsMultiChoice.length; i+=1) {
        if (documentsMultiChoice[i].meta?.id) {
          setMultichoice({
            ...multichoice,
            documentId: documentsMultiChoice[i].meta.id,
          });
        }
      }
    }
  }, [documentsMultiChoice, setMultichoice, multichoice]);

  return (
    <>
      <div className="accordion custom-accordion" id="questionnaire-setup">
        {questionnaireFields.map((element, i: number) => (
          <div className="card mb-0" key={`element-${i}`}>
            <div className="card-header" id={`heading-${i}`}>
              <h5 className="m-0">
                <a
                  className={`custom-accordion-title d-block py-1 ${i !== 0 ? 'collapsed' : ''}`}
                  data-bs-toggle="collapse"
                  href={`#collapse-${i}`}
                  aria-expanded="true"
                  aria-controls={`collapse-${i}`}
                >
                  <span className="me-1">{i + 1}.</span>
                  {element.question}
                  <span className="text-warning">{element.isRequired ? '*' : ''}</span>
                  <i className="mdi mdi-chevron-down accordion-arrow" />
                </a>
              </h5>
            </div>

            <div
              id={`collapse-${i}`}
              className={`collapse ${i === 0 ? 'show' : ''}`}
              aria-labelledby={`heading-${i}`}
              data-bs-parent="#questionnaire-setup"
            >
              <div className="card-body">
                <div className="row" key={`element-${element.id}`}>
                  <div className="col-md-8">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="question"
                        placeholder=""
                        defaultValue={element.question}
                        onChange={(e) =>
                          formElementQuestionEdit(
                            element.id,
                            e.target.value,
                            questionnaireFields,
                            setQuestionnaireFields,
                          )
                        }
                      />
                      <p>Question</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating mb-2">
                      <select
                        id={`feedback-type-${element.id}`}
                        className="form-select"
                        aria-label="Answer Type"
                        defaultValue={element.feedbackType}
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
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <p>Answer Type</p>
                    </div>
                  </div>

                  <div className="col-md-12">
                    {element.feedbackType === CHOICE_SINGLE && (
                      <>
                        <DropZone
                          name="photo"
                          classes="dropzone text-center mt-2"
                          acceptedImageTypes={['.png', '.jpeg', '.jpg']}
                          maxSize={1375000000} // 1 GB
                          multiple={false}
                          reference={element.id}
                          // hideProgressBar={true}
                          files={documentsSingleChoice}
                          setFiles={setDocumentsSingleChoice}
                        />
                        <div className="input-group mt-2">
                          <input
                            type="text"
                            className="form-control"
                            aria-label="Single choice option"
                            placeholder="Single choice option"
                            value={singleChoice.text}
                            onChange={(e) =>
                              setSingleChoice({
                                ...singleChoice,
                                text: e.target.value,
                              })
                            }
                          />
                          <button
                            className="btn btn-dark"
                            type="button"
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
                          </button>
                        </div>

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
                          // hideProgressBar={true}
                          files={documentsMultiChoice}
                          setFiles={setDocumentsMultiChoice}
                        />
                        <div className="input-group mt-2">
                          <input
                            type="text"
                            className="form-control"
                            aria-label="Multichoice"
                            placeholder="Multichoice"
                            value={multichoice.text}
                            onChange={(e) =>
                              setMultichoice({
                                ...multichoice,
                                text: e.target.value,
                              })
                            }
                          />
                          <button
                            className="btn btn-dark"
                            type="button"
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
                          </button>
                        </div>

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
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            aria-label="Dropdown Option"
                            placeholder="Dropdown option"
                            value={dropDownOption}
                            onChange={(e) => setDropdownOption(e.target.value)}
                          />
                          <button
                            className="btn btn-dark"
                            type="button"
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
                          </button>
                        </div>

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
                                <i className="mdi mdi-cancel text-warning" />
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-check form-check-inline mt-0 mb-2">
                      <input
                        type="checkbox"
                        id={`compulsory-${element.id}`}
                        className="form-check-input"
                        defaultChecked={element.isRequired}
                        onClick={() =>
                          editFormElementIsRequired(
                            element.id,
                            !element.isRequired,
                            questionnaireFields,
                            setQuestionnaireFields,
                          )
                        }
                      />
                      <p>Compulsory</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    {element.feedbackType === TEXT_SHORT ||
                    element.feedbackType === NUMBER ||
                    element.feedbackType === PHONE_NUMBER ||
                    element.feedbackType === DATE ||
                    element.feedbackType === EMAIL ||
                    element.feedbackType === URL ||
                    element.feedbackType === RATING ||
                    element.feedbackType === GEOLOCATION ? (
                      <div className="form-check form-check-inline mt-0 mb-2">
                        <input
                          type="checkbox"
                          id={`no-duplicate-${element.id}`}
                          className="form-check-input"
                          defaultChecked={element.noDuplicateResponse}
                          onClick={() =>
                            editFormElementNoDuplicateResponse(
                              element.id,
                              !element.noDuplicateResponse,
                              questionnaireFields,
                              setQuestionnaireFields,
                            )
                          }
                        />
                        <p>No Duplicate Responses</p>
                      </div>
                    ) : undefined}
                  </div>
                </div>
                <hr className="mt-0" />
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm mb-0"
                  onClick={() =>
                    formElementRemove(element.id, questionnaireFields, setQuestionnaireFields)
                  }
                >
                  <i className="mdi mdi-cancel me-1" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-sm btn-primary mt-3"
        onClick={() => formElementAdd(questionnaireFields, setQuestionnaireFields)}
      >
        <i className="mdi mdi-plus me-1"/>Add Question
      </button>

      <MutationButton
        type="button"
        className="btn btn-success float-end mt-3"
        size="sm"
        label="Submit"
        icon="mdi mdi-cloud-upload"
        loading={mutating}
        onClick={mutation}
      />
    </>
  );
};
