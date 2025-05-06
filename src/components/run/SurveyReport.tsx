'use client';

import PhoneNumberInput from '../PhoneNumberInput';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import {
  IChoice,
  IAnswerDropdownOption,
  InputSurveyReportCreate,
  InputSurveyResponse,
  IQuestionnairField,
  IGeoLocation,
} from 'src/lib/interface/general.interface';
import {
  M_SURVEY,
  M_SURVEY_4_AGENT,
  M_SURVEY_REPORT_AGENT_TARGET,
  M_SURVEY_REPORTS_AGENT,
  SURVEY_REPORT_CREATE,
} from 'src/lib/mutations/survey.mutation';
import { FC, useEffect, useState } from 'react';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { QuestionnaireForm } from 'src/components/QuestionnaireForm';
import { LoadingDiv } from 'src/components/LoadingDiv';
import { LoadingSpan } from 'src/components/LoadingSpan';
import { getGeoLocation } from 'src/lib/helpers';
import { LOCATION_PING_INTERVAL_MS } from 'src/lib/constant';

export const SurveyReport: FC<{ runId: string }> = ({ runId }) => {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const {
    action: getSurvey,
    loading: loadingSurvey,
    data: survey,
  } = GQLMutation({
    mutation: M_SURVEY_4_AGENT,
    resolver: 'survey4Agent',
    toastmsg: false,
  });
  const {
    action: getAgentTarget,
    loading: loadingTarget,
    data: agentTarget,
  } = GQLMutation({
    mutation: M_SURVEY_REPORT_AGENT_TARGET,
    resolver: 'surveyReportAgentTarget',
    toastmsg: false,
  });
  // const {
  //   action: getReports,
  //   loading: loadingReports,
  //   data: reports,
  // } = GQLMutation({
  //   mutation: M_SURVEY_REPORTS_AGENT,
  //   resolver: 'surveyReports',
  //   toastmsg: false,
  // });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: SURVEY_REPORT_CREATE,
    resolver: 'surveyReportCreate',
    toastmsg: true,
  });

  const _inputCreate: InputSurveyReportCreate = {
    respondentName: undefined,
    respondentPhone: undefined,
    respondentEmail: undefined,
  };
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [inputCreate, setInputCreate] = useState(_inputCreate);
  const [geoLocation, setGeoLocation] = useState<IGeoLocation>();

  const loadSurvey = () => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  };
  const loadTarget = () => {
    if (survey?.id && session?.user?.agent?.id) {
      getAgentTarget({
        variables: {
          input: { surveyId: survey.id, agentId: session.user.agent.id },
        },
      });
    }
  };
  // const loadReports = () => {
  //   if (survey?.id && session?.user?.agent?.id) {
  //     getReports({
  //       variables: {
  //         input: { surveyId: survey.id, agentId: session.user.agent.id },
  //       },
  //     });
  //   }
  // };
  const handleCreate = (e: Event) => {
    e.preventDefault();

    if (survey.id && session?.user?.agent?.id && geoLocation?.lat && geoLocation?.lng) {
      const _responses: InputSurveyResponse[] = [];

      for (let i = 0; i < questionnaireFields.length; i++) {
        _responses.push({
          questionnaireFieldId: questionnaireFields[i].id,
          feedback: questionnaireFields[i].feedback || {},
        });
      }

      create({
        variables: {
          input: {
            ...inputCreate,
            agentId: session.user.agent.id,
            surveyId: survey.id,
            lat: geoLocation.lat,
            lng: geoLocation.lng,
            responses: _responses,
          },
        },
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getGeoLocation(setGeoLocation);
    }, LOCATION_PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => loadSurvey(), []);
  useEffect(() => {
    loadTarget();
    // loadReports();
  }, [survey?.id, session?.user?.agent?.id]);
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
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
          feedbackType: survey.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: survey.questionnaireFields[i].allowMultipleFileUploads,
        });
      }
      setQuestionnaireFields(_fields);
    }
  }, [survey]);
  useEffect(() => {
    if (created) window.location.reload();
  }, [created]);

  return (
    <>
      {geoLocation?.lat && geoLocation?.lng && (
        <>
          {loadingSurvey ? (
            <LoadingDiv />
          ) : (
            survey && (
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="header-title">{survey?.name}</h4>
                      <p className="text-muted font-14 mb-3">{survey?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-12 d-grid">
                          <button
                            className="btn btn-info btn-sm float-end"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-report-new"
                          >
                            <i className="mdi mdi-plus me-1"></i>New Report
                          </button>
                        </div>
                      </div>

                      <dl className="row mb-0">
                        <dt className="col-6">Target</dt>
                        <dd className="col-6">
                          {loadingTarget ? (
                            <LoadingSpan />
                          ) : (
                            <span className="float-end">
                              <b className="me-1 text-warning">{agentTarget?.target}</b>
                              <span className="text-muted">Reports</span>
                            </span>
                          )}
                        </dd>
                        <dt className="col-6 mb-0">Submitted</dt>
                        <dd className="col-6 mb-0">
                          {loadingTarget ? (
                            <LoadingSpan />
                          ) : (
                            <span className="float-end">
                              <b className="me-1 text-success">{agentTarget?.filled}</b>
                              <span className="text-muted">Reports</span>
                            </span>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* <div className="card">
            <div className="card-body">
              <h4 className="header-title mb-3">
                <span className="me-2">Submitted Reports</span>
                {loadingReports && <LoadingSpan />}
              </h4>

              <div className="table-responsive">
                <table className="table table-centered table-nowrap table-hover mb-0">
                  <tbody>
                    {reports?.rows?.map((surveyReport: any, index: number) => (
                      <tr key={`report-${index}`}>
                        <td>
                          <h5 className="font-14 my-1">
                            <a href="#" className="text-body">
                              {surveyReport.respondentName}
                            </a>
                          </h5>
                          <span className="text-muted font-13">{surveyReport.created}</span>
                        </td>
                        <td className='table-action' style={{ width: '90px' }}>
                          <a href='#' className='action-icon'>
                            <i className='mdi mdi-pencil'></i>
                          </a>
                          <a href='#' className='action-icon'>
                            <i className='mdi mdi-delete'></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
        </>
      )}

      <div
        tabIndex={-1}
        id="modal-report-new"
        className="modal fade"
        role="dialog"
        aria-labelledby="new-report-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="new-report-modal">
                New Survey Report
              </h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="respondentName" className="form-label">
                      Customer Name
                      {survey?.requireRespondentName ? (
                        <span className="text-warning ms-1">*</span>
                      ) : undefined}
                    </label>
                    <input
                      type="text"
                      id="respondentName"
                      className="form-control"
                      placeholder=""
                      required={survey?.requireRespondentName}
                      value={inputCreate.respondentName}
                      onChange={(e) =>
                        setInputCreate({
                          ...inputCreate,
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
                      {survey?.requireRespondentPhone ? (
                        <span className="text-warning ms-1">*</span>
                      ) : undefined}
                    </label>
                    <PhoneNumberInput
                      phonekey="respondentPhone"
                      required={survey?.requireRespondentPhone}
                      input={inputCreate}
                      onChange={setInputCreate}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="respondentEmail" className="form-label">
                      Customer Email
                      {survey?.requireRespondentEmail ? (
                        <span className="text-warning ms-1">*</span>
                      ) : undefined}
                    </label>
                    <input
                      type="text"
                      id="respondentEmail"
                      className="form-control"
                      placeholder=""
                      required={survey?.requireRespondentEmail}
                      value={inputCreate.respondentEmail}
                      onChange={(e) =>
                        setInputCreate({
                          ...inputCreate,
                          respondentEmail: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-0" />

              <QuestionnaireForm
                questionnaireFields={questionnaireFields}
                setQuestionnaireFields={setQuestionnaireFields}
                submitting={creating}
                handleSubmit={handleCreate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
