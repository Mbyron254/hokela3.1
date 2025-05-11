'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';

import { GQLMutation } from 'src/lib/client';
import {
  M_SURVEY_MINI,
  M_SURVEY_REPORTS,
  SURVEY_REPORT_VALIDATION,
} from 'src/lib/mutations/survey.mutation';
import { sourceImage } from 'src/lib/server';
import { TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from 'src/lib/constant';
import { commafy, parseValidityTheme } from 'src/lib/helpers';


// const TEDashboardSurvey: FC<any> = ({ data }) => {
//   return (
//     <Card variant="outlined" className="mt-2">
//       <CardContent>
//         <Typography variant="h5" color="textSecondary" gutterBottom>
//           Responses
//         </Typography>
//         <hr />
//         <div className="accordion custom-accordion" id="custom-accordion-one">
//           {data.responses?.map((response: any, index: number) => {
//             let component = null;

//             switch (response.feedbackType) {
//               // case TEXT_SHORT:
//               //   break;
//               // case TEXT_LONG:
//               //   break;
//               // case NUMBER:
//               //   break;
//               // case EMAIL:
//               //   break;
//               // case DROPDOWN:
//               //   break;

//               case PHONE_NUMBER:
//                 component = <Typography color="textSecondary">+{response.feedback._string}</Typography>;
//                 break;

//               case DATE:
//                 component = (
//                   <Typography color="textSecondary">
//                     {formatDate(response.feedback._string, 'yyyy MMMM dd')}
//                   </Typography>
//                 );
//                 break;

//               case RATING:
//                 component = (
//                   <>
//                     <Typography color="textSecondary">Rated {response.feedback._string} out of 5</Typography>
//                     <ReactStars
//                       edit={false}
//                       half={true}
//                       count={5}
//                       size={20}
//                       value={parseFloat(response.feedback._string)}
//                       color1={'#bac6cb'}
//                       color2={'#ffd700'}
//                     />
//                   </>
//                 );
//                 break;

//               case CHOICE_SINGLE:
//                 component = (
//                   <ul className="list-group mb-2">
//                     <li className="list-group-item text-muted">
//                       <i className="mdi mdi-arrow-right me-1"></i>
//                       {response.feedback?._choice?.text}
//                     </li>
//                   </ul>
//                 );
//                 break;

//               case CHOICE_MULTIPLE:
//                 component = (
//                   <ul className="list-group mb-2">
//                     {response.feedback?._choiceArray?.map((choice: any, i: number) => (
//                       <li className="list-group-item text-muted" key={`choice-${i}`}>
//                         <i className="mdi mdi-arrow-right me-1"></i>
//                         {choice.text}
//                       </li>
//                     ))}
//                   </ul>
//                 );
//                 break;

//               case GEOLOCATION:
//                 break;

//               case PICTURE:
//                 component = (
//                   <div className="text-center">
//                     <Image
//                       className=""
//                       src={sourceImage(response.feedback._string)}
//                       loader={() => sourceImage(response.feedback._string)}
//                       alt=""
//                       width={400}
//                       height={300}
//                     />
//                   </div>
//                 );
//                 break;

//               case MULTIMEDIA:
//                 <div className="row mx-n1 g-0">
//                   <div className="col-xxl-3 col-lg-6">
//                     {/* <div className='card m-1 shadow-none border'>
//                       <div className='p-2'>
//                         <div className='row align-items-center'>
//                           <div className='col-auto'>
//                             <div className='avatar-sm'>
//                               <span className='avatar-title bg-light text-secondary rounded'>
//                                 <i className='mdi mdi-folder-zip font-16'></i>
//                               </span>
//                             </div>
//                           </div>
//                           <div className='col ps-0'>
//                             <a
//                               href='javascript:void(0);'
//                               className='text-muted fw-bold'
//                             >
//                               Hyper-sketch.zip
//                             </a>
//                             <p className='mb-0 font-13'>2.3 MB</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div> */}
//                   </div>
//                 </div>;
//                 break;

//               default:
//                 component = <Typography color="textSecondary">{response.feedback._string}</Typography>;
//                 break;
//             }
//             return (
//               <Card key={`response-${index}`} className="mb-2">
//                 <CardContent>
//                   <Typography variant="h6">
//                     {index + 1}. {response.question}
//                   </Typography>
//                   <div>{component}</div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

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
        <i className={`mdi mdi-decagram text-${parseValidityTheme(row.validity)}`}/>
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

  useEffect(() => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  }, [runId, getSurvey]);

  return (
    <div className="row">
      <div className="col-md-12">
        <Card variant="outlined" className="mb-3">
          <CardContent>
            <Typography variant="h4">{survey?.name}</Typography>
            <hr />
            <Typography variant="body2" color="textSecondary" paragraph>
              {survey?.description}
            </Typography>
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
          </CardContent>
        </Card>
      </div>

      <div className="col-md-12">
        <Button
          variant="contained"
          color="success"
          className="mb-3 me-2"
          size="small"
          startIcon={<i className="mdi mdi-check-decagram"/>}
          onClick={handleValidate}
          disabled={validating}
        >
          {validating ? <CircularProgress size={20} /> : 'Mark As Valid'}
        </Button>
        <Button
          variant="contained"
          color="error"
          className="mb-3 me-2"
          size="small"
          startIcon={<i className="mdi mdi-cancel"/>}
          onClick={handleInValidate}
          disabled={inValidating}
        >
          {inValidating ? <CircularProgress size={20} /> : 'Mark As Invalid'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="mb-3"
          size="small"
          startIcon={<i className="mdi mdi-minus-thick"/>}
          onClick={handleUnMark}
          disabled={unMarking}
        >
          {unMarking ? <CircularProgress size={20} /> : 'Un Mark'}
        </Button>

        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.name}>{column.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {surveyReports?.rows.map((row: any, index: number) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.name}>{column.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
