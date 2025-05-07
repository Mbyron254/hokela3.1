'use client';

import { DROPDOWN, CHOICE_SINGLE, CHOICE_MULTIPLE } from '@/lib/constant';
import {
  IChoice,
  IAnswerDropdownOption,
  IQuestionnairField,
  InputSurveyUpdate,
} from '@/lib/interface/general.interface';
import { FC, useEffect, useState } from 'react';
import { GQLMutation } from '@/lib/client';
import { M_SURVEY, SURVEY_UPSERT } from '@/lib/mutations/survey.mutation';
import { RunSurveyTargetReports } from './RunSurveyTargetReports';
import { QuestionnaireSetup } from '../QuestionnaireSetup';

export const RunSurveyQuestions: FC<{
  clientTier2Id: string;
  runId: string;
}> = ({ clientTier2Id, runId }) => {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: M_SURVEY,
    resolver: 'survey',
    toastmsg: true,
  });
  const {
    action: upsert,
    loading: upserting,
    data: upserted,
  } = GQLMutation({
    mutation: SURVEY_UPSERT,
    resolver: 'surveyUpsert',
    toastmsg: true,
  });

  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [input, setInput] = useState<InputSurveyUpdate>({
    name: undefined,
    description: undefined,
    hideRespondentFields: undefined,
    requireRespondentName: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
    questionnaireFields: [],
  });

  const loadSurvey = () => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  };
  const handleUpsert = () => {
    if (clientTier2Id && runId && questionnaireFields) {
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

      upsert({ variables: { input: { ...input, clientTier2Id, runId, questionnaireFields } } });
    }
  };

  useEffect(() => loadSurvey(), [upserted]);
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

      setInput({
        ...input,
        name: survey.name,
        description: survey.description,
        hideRespondentFields: survey.hideRespondentFields,
        requireRespondentName: survey.requireRespondentName,
        requireRespondentPhone: survey.requireRespondentPhone,
        requireRespondentEmail: survey.requireRespondentEmail,
        blockSameLocationReportsGlobally: survey.blockSameLocationReportsGlobally,
        blockSameLocationReportsPerAgent: survey.blockSameLocationReportsPerAgent,
      });
      setQuestionnaireFields(_fields);
    }
  }, [survey]);

  return (
    <>
      <ul className="nav nav-tabs nav-bordered mb-3">
        <li className="nav-item">
          <a
            href="#survey-questions"
            data-bs-toggle="tab"
            aria-expanded="true"
            className="nav-link active"
          >
            <span className="d-md-block">Questionnaire</span>
          </a>
        </li>
        <li className="nav-item">
          <a href="#target-reports" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
            <span className="d-md-block">Target Reports</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="survey-questions">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-primary border">
                <div className="card-body">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      id="surveyName"
                      className="form-control"
                      placeholder=""
                      defaultValue={input.name}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          name: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    />
                    <label htmlFor="surveyName" className="form-label">
                      Survey Name
                    </label>
                  </div>
                  <div className="form-floating">
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder=""
                      style={{ height: '100px' }}
                      defaultValue={input.description}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          description: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    />
                    <label htmlFor="description">Survey Description</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-primary border">
                <div className="card-body">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="hideRespondentFieldsSurvey"
                      checked={input.hideRespondentFields}
                      onClick={() =>
                        setInput({
                          ...input,
                          hideRespondentFields: !input.hideRespondentFields,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="hideRespondentFieldsSurvey">
                      Hide Respondent Fields
                    </label>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireRespondentNameSurvey"
                      checked={input.requireRespondentName}
                      onClick={() =>
                        setInput({
                          ...input,
                          requireRespondentName: !input.requireRespondentName,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="requireRespondentNameSurvey">
                      Require Respondent Name
                    </label>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireRespondentPhoneSurvey"
                      checked={input.requireRespondentPhone}
                      onClick={() =>
                        setInput({
                          ...input,
                          requireRespondentPhone: !input.requireRespondentPhone,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="requireRespondentPhoneSurvey">
                      Require Respondent Phone
                    </label>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireRespondentEmailSurvey"
                      checked={input.requireRespondentEmail}
                      onClick={() =>
                        setInput({
                          ...input,
                          requireRespondentEmail: !input.requireRespondentEmail,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="requireRespondentEmailSurvey">
                      Require Respondent Email
                    </label>
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="blockSameLocationReportsGloballySurvey"
                      checked={input.blockSameLocationReportsGlobally}
                      onClick={() =>
                        setInput({
                          ...input,
                          blockSameLocationReportsGlobally: !input.blockSameLocationReportsGlobally,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="blockSameLocationReportsGloballySurvey">
                      Block Same Location Reports Globally
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="blockSameLocationReportsPerAgentSurvey"
                      checked={input.blockSameLocationReportsPerAgent}
                      onClick={() =>
                        setInput({
                          ...input,
                          blockSameLocationReportsPerAgent: !input.blockSameLocationReportsPerAgent,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="blockSameLocationReportsPerAgentSurvey">
                      Block Same Location Reports Per Agent
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8">
              <QuestionnaireSetup
                questionnaireFields={questionnaireFields}
                setQuestionnaireFields={setQuestionnaireFields}
                mutating={upserting}
                mutation={handleUpsert}
              />
            </div>
          </div>
        </div>

        <div className="tab-pane" id="target-reports">
          {survey?.id ? <RunSurveyTargetReports surveyId={survey.id} /> : undefined}
        </div>
      </div>
    </>
  );
};
