'use client';

import { InputSalesGiveawaySurveyUpdate } from '@/lib/interface/survey-sales-giveaway.interface';
import { FC, useEffect, useState } from 'react';
import { QuestionnaireSetup } from '../QuestionnaireSetup';
import { IAnswerDropdownOption, IChoice, IQuestionnairField } from '@/lib/interface/general.interface';
import { GQLMutation } from '@/lib/client';
import {
  SALES_GIVEAWAY_SURVEY,
  SALES_GIVEAWAY_SURVEY_UPSERT,
} from '@/lib/mutations/sales-giveaway.mutation';
import { CHOICE_MULTIPLE, CHOICE_SINGLE, DROPDOWN } from '@/lib/constant';

export const RunSalesGiveawayQuestions: FC<{
  runId: string;
}> = ({ runId }) => {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY,
    resolver: 'salesGiveawaySurvey',
    toastmsg: false,
  });
  const {
    action: upsertSurvey,
    loading: upsertingSurvey,
    data: upsertedSurvey,
  } = GQLMutation({
    mutation: SALES_GIVEAWAY_SURVEY_UPSERT,
    resolver: 'salesGiveawaySurveyUpsert',
    toastmsg: true,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [inputSurvey, setInputSurvey] = useState<InputSalesGiveawaySurveyUpdate>({
    hideRespondentFields: undefined,
    requireRespondentName: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
  });

  const loadSurvey = () => {
    if (runId) getSurvey({ variables: { input: { runId } } });
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
        variables: { input: { ...inputSurvey, runId, questionnaireFields } },
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
      setInputSurvey({
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
      {!survey && (
        <div className="alert alert-warning text-warning bg-transparent text-center" role="alert">
          Questionnaire not set. Agents will not be able to submit sales giveaway reports!
        </div>
      )}
      <div className="card border-primary border">
        <div className="card-body pb-0">
          <div className="row">
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="hideRespondentFieldsFreeGiveaway"
                  checked={inputSurvey.hideRespondentFields}
                  onClick={() =>
                    setInputSurvey({
                      ...inputSurvey,
                      hideRespondentFields: !inputSurvey.hideRespondentFields,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="hideRespondentFieldsFreeGiveaway">
                  Hide Respondent Fields
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requireRespondentNameSalesGiveaway"
                  checked={inputSurvey.requireRespondentName}
                  onClick={() =>
                    setInputSurvey({
                      ...inputSurvey,
                      requireRespondentName: !inputSurvey.requireRespondentName,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="requireRespondentNameSalesGiveaway">
                  Require Respondent Name
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requireRespondentPhoneSalesGiveaway"
                  checked={inputSurvey.requireRespondentPhone}
                  onClick={() =>
                    setInputSurvey({
                      ...inputSurvey,
                      requireRespondentPhone: !inputSurvey.requireRespondentPhone,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="requireRespondentPhoneSalesGiveaway">
                  Require Respondent Phone
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requireRespondentEmailSalesGiveaway"
                  checked={inputSurvey.requireRespondentEmail}
                  onClick={() =>
                    setInputSurvey({
                      ...inputSurvey,
                      requireRespondentEmail: !inputSurvey.requireRespondentEmail,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="requireRespondentEmailSalesGiveaway">
                  Require Respondent Email
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="blockSameLocationReportsGloballySalesGiveaway"
                  checked={inputSurvey.blockSameLocationReportsGlobally}
                  onClick={() =>
                    setInputSurvey({
                      ...inputSurvey,
                      blockSameLocationReportsGlobally: !inputSurvey.blockSameLocationReportsGlobally,
                    })
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="blockSameLocationReportsGloballySalesGiveaway"
                >
                  Block Same Location Reports Globally
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="blockSameLocationReportsPerAgentSalesGiveaway"
                  checked={inputSurvey.blockSameLocationReportsPerAgent}
                  onClick={() =>
                    setInputSurvey({
                      ...inputSurvey,
                      blockSameLocationReportsPerAgent: !inputSurvey.blockSameLocationReportsPerAgent,
                    })
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="blockSameLocationReportsPerAgentSalesGiveaway"
                >
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
