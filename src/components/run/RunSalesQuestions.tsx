'use client';

import { IAnswerDropdownOption, IChoice, IQuestionnairField } from '@/lib/interface/general.interface';
import { FC, useEffect, useState } from 'react';
import { QuestionnaireSetup } from '../QuestionnaireSetup';
import { GQLMutation } from '@/lib/client';
import { SALES_SURVEY, SALES_SURVEY_UPSERT } from '@/lib/mutations/sales-survey.mutation';
import { InputSalesSurveyUpdate } from '@/lib/interface/survey-sales.interface';
import { CHOICE_MULTIPLE, CHOICE_SINGLE, DROPDOWN } from '@/lib/constant';

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

  const loadSurvey = () => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  };
  const handleSurveyUpsert = () => {
    if (runId && questionnaireFields.length) {
      for (let i = 0; i < questionnaireFields.length; i++) {
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

  useEffect(() => loadSurvey(), [upsertedSurvey]);
  useEffect(() => {
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i++) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceSingle.length; k++) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k++) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsDropdown.length; k++) {
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
                <label className="form-check-label" htmlFor="hideRespondentFields">
                  Hide Respondent Fields
                </label>
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
                <label className="form-check-label" htmlFor="requireRespondentName">
                  Require Respondent Name
                </label>
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
                <label className="form-check-label" htmlFor="requireRespondentPhone">
                  Require Respondent Phone
                </label>
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
                <label className="form-check-label" htmlFor="requireRespondentEmail">
                  Require Respondent Email
                </label>
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
                <label className="form-check-label" htmlFor="blockSameLocationReportsGlobally">
                  Block Same Location Reports Globally
                </label>
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
                <label className="form-check-label" htmlFor="blockSameLocationReportsPerAgent">
                  Block Same Location Reports Per Agent
                </label>
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
