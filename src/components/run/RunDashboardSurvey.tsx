'use client';

import Image from 'next/image';

import { GQLMutation } from '@/lib/client';
import {
  M_SURVEY_MINI,
  M_SURVEY_REPORTS,
  SURVEY_REPORT_VALIDATION,
} from '@/lib/mutations/survey.mutation';
import { FC, useEffect, useState } from 'react';
import { DataTable } from '../DataTable';
import { sourceImage } from '@/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import { TEDashboardSurvey } from '../table-extensions/TEDashboardSurvey';
import { commafy, parseValidityTheme } from '@/lib/helpers';
import { MutationButton } from '../MutationButton';

export const RunDashboardSurvey: FC<{ runId: string }> = ({ runId }) => {
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: M_SURVEY_MINI,
    resolver: 'survey',
    toastmsg: false,
  });
  const {
    action: getSurveyReports,
    loading: loadingSurveyReports,
    data: surveyReports,
  } = GQLMutation({
    mutation: M_SURVEY_REPORTS,
    resolver: 'surveyReports',
    toastmsg: false,
  });
  const {
    action: validate,
    loading: validating,
    data: validated,
  } = GQLMutation({
    mutation: SURVEY_REPORT_VALIDATION,
    resolver: 'surveyReportValidation',
    toastmsg: true,
  });
  const {
    action: inValidate,
    loading: inValidating,
    data: inValidated,
  } = GQLMutation({
    mutation: SURVEY_REPORT_VALIDATION,
    resolver: 'surveyReportValidation',
    toastmsg: true,
  });
  const {
    action: unMark,
    loading: unMarking,
    data: unMarked,
  } = GQLMutation({
    mutation: SURVEY_REPORT_VALIDATION,
    resolver: 'surveyReportValidation',
    toastmsg: true,
  });

  const [selected, setSelected] = useState<string[]>([]);

  const loadSurvey = () => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  };
  const loadSurveyReports = (page?: number, pageSize?: number) => {
    if (survey?.id) {
      getSurveyReports({
        variables: { input: { surveyId: survey.id, page, pageSize } },
      });
    }
  };
  const handleValidate = () => {
    if (selected.length) {
      validate({ variables: { input: { ids: selected, validity: 1 } } });
    }
  };
  const handleInValidate = () => {
    if (selected.length) {
      inValidate({ variables: { input: { ids: selected, validity: 2 } } });
    }
  };
  const handleUnMark = () => {
    if (selected.length) {
      unMark({ variables: { input: { ids: selected, validity: 0 } } });
    }
  };

  const columns = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'VALID',
      width: '100px',
      sortable: true,
      selector: (row: any) => row.validity,
      cell: (row: any) => (
        <i className={`mdi mdi-decagram text-${parseValidityTheme(row.validity)}`}></i>
      ),
    },
    {
      name: 'AGENT',
      sortable: true,
      wrap: true,
      grow: 2,
      selector: (row: any) => row.agent?.user?.name,
      cell: (row: any) => (
        <>
          <Image
            className="me-3 mt-1 mb-1 rounded-circle"
            src={sourceImage(row.agent?.user?.profile?.photo?.fileName)}
            loader={() => sourceImage(row.agent?.user?.profile?.photo?.fileName)}
            alt=""
            width={TABLE_IMAGE_WIDTH}
            height={TABLE_IMAGE_HEIGHT}
          />
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.agent?.user?.name}</h6>
            <span className="font-13 text-muted">{row.agent?.user?.accountNo}</span>
          </div>
        </>
      ),
    },
    {
      name: 'CUSTOMER NAME',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.respondentName,
      cell: (row: any) => row.respondentName || '---',
    },
    {
      name: 'CUSTOMER PHONE',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.respondentPhone,
      cell: (row: any) => row.respondentPhone || '---',
    },
    {
      name: 'CUSTOMER EMAIL',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.respondentEmail,
      cell: (row: any) => row.respondentEmail || '---',
    },
    {
      name: 'REPORT DATE',
      sortable: true,
      wrap: true,
      selector: (row: any) => row.created,
      cell: (row: any) => row.created,
    },
  ];

  useEffect(() => loadSurvey(), [runId]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card border border-primary">
          <div className="card-body">
            <h4 className="header-title">{survey?.name}</h4>

            <hr />

            <p className="text-muted font-14 mb-3">{survey?.description}</p>

            <div className="row">
              <div className="col-md-6">
                <dl className="row mb-0">
                  <dt className="col-sm-6">Questions</dt>
                  <dd className="col-sm-6">
                    {survey?.questionnaireFields?.length}
                    <small className="text-muted ms-1">Questions</small>
                  </dd>
                  <dt className="col-sm-6">Reports</dt>
                  <dd className="col-sm-6">
                    {commafy(survey?.reports?.length)}
                    <small className="text-muted ms-1">Reports</small>
                  </dd>
                </dl>
              </div>

              <div className="col-md-6">
                <dl className="row mb-0">
                  <dt className="col-sm-6">Created</dt>
                  <dd className="col-sm-6">{survey?.created}</dd>
                  <dt className="col-sm-6">Updated</dt>
                  <dd className="col-sm-6">{survey?.updated}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <MutationButton
          type="button"
          className="btn btn-success mb-3 me-2"
          size="sm"
          label="Mark As Valid"
          icon="mdi mdi-check-decagram"
          loading={validating}
          onClick={handleValidate}
        />
        <MutationButton
          type="button"
          className="btn btn-danger mb-3 me-2"
          size="sm"
          label="Mark As Invalid"
          icon="mdi mdi-cancel"
          loading={inValidating}
          onClick={handleInValidate}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm mb-3"
          disabled={unMarking}
          onClick={handleUnMark}
        >
          {unMarking && (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              Loading...
            </>
          )}
          {!unMarking && (
            <>
              <i className="mdi mdi-minus-thick me-2"></i>Un Mark
            </>
          )}
        </button>

        <DataTable
          columns={columns}
          loading={loadingSurveyReports}
          selectable={true}
          expanded={false}
          totalRows={surveyReports?.count}
          data={surveyReports?.rows}
          handleReloadMutation={loadSurveyReports}
          setSelected={setSelected}
          tableExpansion={TEDashboardSurvey}
          reloadTriggers={[survey?.id, validated, inValidated, unMarked]}
        />
      </div>
    </div>
  );
};
