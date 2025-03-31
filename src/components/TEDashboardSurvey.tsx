'use client';

import ReactStars from 'react-stars';

import {
  PHONE_NUMBER,
  DATE,
  RATING,
  CHOICE_MULTIPLE,
  GEOLOCATION,
  MULTIMEDIA,
} from 'src/lib/constant';
import { formatDate } from 'src/lib/helpers';
import { FC } from 'react';

export function TEDashboardSurvey({ data }: any) {
  return (
    <>
      <div className='card border-secondary border mt-3'>
        <div className='card-body'>
          <h4 className='header-title text-secondary'>Respondent</h4>
          <hr />
          <div className='row'>
            <div className='col-md-4'>
              <dl className='row mb-0'>
                <dt className='col-sm-6 text-secondary'>Name</dt>
                <dd className='col-sm-6'>
                  <span className='float-end text-muted'>
                    {data.respondentName}
                  </span>
                </dd>
              </dl>
            </div>
            <div className='col-md-4'>
              <dl className='row mb-0'>
                <dt className='col-sm-6 text-secondary'>Phone</dt>
                <dd className='col-sm-6'>
                  <span className='float-end text-muted'>
                    {data.respondentPhone}
                  </span>
                </dd>
              </dl>
            </div>
            <div className='col-md-4'>
              <dl className='row mb-0'>
                <dt className='col-sm-6 text-secondary'>Email</dt>
                <dd className='col-sm-6'>
                  <span className='float-end text-muted'>
                    {data.respondentEmail}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className='card border-secondary border'>
        <div className='card-body'>
          <h4 className='header-title text-secondary'>Responses</h4>
          <hr />

          <div className='accordion custom-accordion' id='custom-accordion-one'>
            {data.responses?.map((response: any, index: number) => {
              let component = null;

              switch (response.feedbackType) {
                // case TEXT_SHORT:
                //   break;
                // case TEXT_LONG:
                //   break;
                // case NUMBER:
                //   break;
                // case EMAIL:
                //   break;
                // case CHOICE_SINGLE:
                //   break;
                // case DROPDOWN:
                //   break;

                case PHONE_NUMBER:
                  component = (
                    <p className='text-muted'>+{response.feedback._string}</p>
                  );
                  break;

                case DATE:
                  component = (
                    <p className='text-muted'>
                      {formatDate(response.feedback._string, 'yyyy MMMM dd')}
                    </p>
                  );
                  break;

                case RATING:
                  component = (
                    <>
                      <span className='text-muted'>
                        Rated {response.feedback._string} out of 5
                      </span>
                      <ReactStars
                        edit={false}
                        half
                        count={5}
                        size={20}
                        value={parseFloat(response.feedback._string)}
                        className=''
                        color1='#bac6cb'
                        color2='#ffd700'
                      />
                    </>
                  );
                  break;

                case CHOICE_MULTIPLE:
                  component = (
                    <ul className='list-group mb-2'>
                      {response.feedback._stringArray.map(
                        (item: string, i: number) => (
                          <li
                            className='list-group-item text-muted'
                            key={`item-${i}`}
                          >
                            <i className='mdi mdi-arrow-right me-1'/>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  );
                  break;

                case GEOLOCATION:
                  break;

                case MULTIMEDIA:
                  <div className='row mx-n1 g-0'>
                    <div className='col-xxl-3 col-lg-6'>
                      {/* <div className='card m-1 shadow-none border'>
                        <div className='p-2'>
                          <div className='row align-items-center'>
                            <div className='col-auto'>
                              <div className='avatar-sm'>
                                <span className='avatar-title bg-light text-secondary rounded'>
                                  <i className='mdi mdi-folder-zip font-16'></i>
                                </span>
                              </div>
                            </div>
                            <div className='col ps-0'>
                              <a
                                href='javascript:void(0);'
                                className='text-muted fw-bold'
                              >
                                Hyper-sketch.zip
                              </a>
                              <p className='mb-0 font-13'>2.3 MB</p>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>;
                  break;

                default:
                  component = (
                    <p className='text-muted'>{response.feedback._string}</p>
                  );
                  break;
              }
              return (
                <div className='card mb-0' key={`response-${index}`}>
                  <div className='card-header' id={`heading${index}`}>
                    <h5 className='m-0'>
                      <a
                        className='custom-accordion-title d-block py-1'
                        data-bs-toggle='collapse'
                        href={`#collapse${index}`}
                        aria-expanded='true'
                        aria-controls={`collapse${index}`}
                      >
                        {index + 1}. {response.question}
                        <i className='mdi mdi-chevron-down accordion-arrow'/>
                      </a>
                    </h5>
                  </div>

                  <div
                    id={`collapse${index}`}
                    className={`collapse ${index === 0 ? 'show' : ''}`}
                    aria-labelledby={`heading${index}`}
                    data-bs-parent='#custom-accordion-one'
                  >
                    <div className='card-body pb-1'>{component}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
