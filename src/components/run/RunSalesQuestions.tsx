'use client';

import { IAnswerDropdownOption, IChoice, IQuestionnairField } from 'src/lib/interface/general.interface';
import { FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { SALES_SURVEY, SALES_SURVEY_UPSERT } from 'src/lib/mutations/sales-survey.mutation';
import { InputSalesSurveyUpdate } from 'src/lib/interface/survey-sales.interface';
import { CHOICE_MULTIPLE, CHOICE_SINGLE, DROPDOWN } from 'src/lib/constant';
import { QuestionnaireSetup } from '../QuestionnaireSetup';

export const RunSalesQuestions: FC<{ runId: string }> = ({ runId }) => {
  const {
    action: upsertSurvey,
    loading: upsertingSurvey,
    data: upsertedSurvey,
  } = GQLMutation({
    mutation: SALES_SURVEY_UPSERT,
    resolver: 'salesSurveyUpsert',
    toastmsg: true,
  });
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: SALES_SURVEY,
    resolver: 'salesSurvey',
    toastmsg: false,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [input, setInput] = useState<InputSalesSurveyUpdate>({
    hideRespondentFields: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
  });

  const handleSurveyUpsert = () => {
    if (runId && questionnaireFields.length) {
      for (let i = 0; i < questionnaireFields.length; i += 1) {
        switch (questionnaireFields[i].feedbackType) {
          case DROPDOWN:
            delete questionnaireFields[i].optionsChoiceSingle;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;

          case CHOICE_SINGLE:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;

          case CHOICE_MULTIPLE:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceSingle;
            break;

          default:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceSingle;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;
        }
      }
      upsertSurvey({
        variables: { input: { ...input, runId, questionnaireFields } },
      });
    }
  };

  useEffect(() => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  }, [upsertedSurvey, getSurvey, runId]);
  useEffect(() => {
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i += 1) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceSingle.length; k += 1) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k += 1) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsDropdown.length; k += 1) {
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
          feedbackType: survey.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: survey.questionnaireFields[i].allowMultipleFileUploads,
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
        });
      }

      setQuestionnaireFields(_fields);
      setInput({
        hideRespondentFields: survey.hideRespondentFields,
        requireRespondentName: survey.requireRespondentName,
        requireRespondentPhone: survey.requireRespondentPhone,
        requireRespondentEmail: survey.requireRespondentEmail,
        blockSameLocationReportsGlobally: survey.blockSameLocationReportsGlobally,
        blockSameLocationReportsPerAgent: survey.blockSameLocationReportsPerAgent,
      });
    }
  }, [survey]);

  return (
    <>
      <div className="card border-primary border">
        <div className="card-body pb-0">
          <div className="row">
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="hideRespondentFields"
                  checked={input.hideRespondentFields}
                  onClick={() =>
                    setInput({
                      ...input,
                      hideRespondentFields: !input.hideRespondentFields,
                    })
                  }
                />
                <p className="form-check-label">
                  Hide Respondent Fields
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requireRespondentName"
                  checked={input.requireRespondentName}
                  onClick={() =>
                    setInput({
                      ...input,
                      requireRespondentName: !input.requireRespondentName,
                    })
                  }
                />
                <p className="form-check-label">
                  Require Respondent Name
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requireRespondentPhone"
                  checked={input.requireRespondentPhone}
                  onClick={() =>
                    setInput({
                      ...input,
                      requireRespondentPhone: !input.requireRespondentPhone,
                    })
                  }
                />
                <p className="form-check-label">
                  Require Respondent Phone
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requireRespondentEmail"
                  checked={input.requireRespondentEmail}
                  onClick={() =>
                    setInput({
                      ...input,
                      requireRespondentEmail: !input.requireRespondentEmail,
                    })
                  }
                />
                <p className="form-check-label">
                  Require Respondent Email
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="blockSameLocationReportsGlobally"
                  checked={input.blockSameLocationReportsGlobally}
                  onClick={() =>
                    setInput({
                      ...input,
                      blockSameLocationReportsGlobally: !input.blockSameLocationReportsGlobally,
                    })
                  }
                />
                <p className="form-check-label">
                  Block Same Location Reports Globally
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="blockSameLocationReportsPerAgent"
                  checked={input.blockSameLocationReportsPerAgent}
                  onClick={() =>
                    setInput({
                      ...input,
                      blockSameLocationReportsPerAgent: !input.blockSameLocationReportsPerAgent,
                    })
                  }
                />
                <p className="form-check-label">
                  Block Same Location Reports Per Agent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuestionnaireSetup
        questionnaireFields={questionnaireFields}
        setQuestionnaireFields={setQuestionnaireFields}
        mutating={upsertingSurvey}
        mutation={handleSurveyUpsert}
      />
    </>
  );
};
