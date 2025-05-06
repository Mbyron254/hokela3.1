'use client';

import Image from 'next/image';
import Webcam from 'react-webcam';

import { GQLMutation, GQLQuery } from '@/lib/client';
import { InputClockInOut } from '@/lib/interface/clock.interface';
import { CLOCK_IN_OUT } from '@/lib/mutations/clock.mutation';
import { Q_SESSION_SELF } from '@/lib/queries/session.query';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { sourceImage, uploadPhoto } from '@/lib/server';
import { LoadingDiv } from '../LoadingDiv';
import { IPictureUpload } from '@/lib/interface/general.interface';

export const RunAgent: FC<{ offer: any; lat: number; lng: number }> = ({ offer, lat, lng }) => {
  const { data: session } = GQLQuery({
    query: Q_SESSION_SELF,
    queryAction: 'sessionSelf',
  });
  const { action: clockInAndOut, data: clocked } = GQLMutation({
    mutation: CLOCK_IN_OUT,
    resolver: 'clockInOut',
    toastmsg: false,
  });

  const webcamRef = useRef<Webcam>(null);

  const initPhoto: IPictureUpload = {
    loading: false,
    id: undefined,
  };

  const [photo, setPhoto] = useState(initPhoto);
  const [input, setInput] = useState<InputClockInOut>({});

  const handleClockIn = () => {
    if (offer.run?.id && session?.user?.agent?.id && lat && lng) {
      if (offer.run.clockType === 'STATIC') {
        let canClockIn = true;

        if (offer.run.clockInPhotoLabel && !photo.id) {
          canClockIn = false;
        }

        if (canClockIn) {
          clockInAndOut({
            variables: {
              input: {
                ...input,
                runId: offer.run.id,
                agentId: session.user.agent.id,
                clockInAt: new Date(),
                clockPhotoId: photo.id,
                lat,
                lng,
                clockMode: 'WALKING',
              },
            },
          });
          setPhoto(initPhoto);
        } else {
          alert(`Please take a ${offer.run.clockInPhotoLabel}`);
        }
      } else {
        clockInAndOut({
          variables: {
            input: {
              ...input,
              runId: offer.run.id,
              agentId: session.user.agent.id,
              clockInAt: new Date(),
              lat,
              lng,
              clockMode: 'WALKING',
            },
          },
        });
      }
    }
  };
  const capture = useCallback(() => {
    uploadPhoto(webcamRef?.current?.getScreenshot(), setPhoto);
  }, [webcamRef]);

  useEffect(() => {
    if (clocked) {
      window.location.replace(`/agent/campaigns/${offer.id}`);
    }
  }, [clocked]);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title font-18">
          <a href="#">{offer.run?.name}</a>
        </h5>

        <div className="pe-2 text-nowrap mb-2 d-inline-block">
          <i className="mdi mdi-google-my-business text-muted me-2"></i>
          <b>{offer.run?.campaign?.project?.clientTier2?.clientTier1?.name}</b>
        </div>

        <div>
          {session?.user?.agent?.id && (
            <>
              {offer.run?.clockType === 'STATIC' && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#check-in-${offer.id}`}
                  >
                    Check In <i className="mdi mdi-timer-outline"></i>
                  </button>

                  <div
                    tabIndex={-1}
                    className="modal fade"
                    id={`check-in-${offer.id}`}
                    role="dialog"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4 className="modal-title" id="myCenterModalLabel">
                            Check In
                          </h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="modal-body text-center">
                          {offer.run?.clockInPhotoLabel && (
                            <div className="mb-3">
                              <h5 className="mt-0 mb-3">{offer.run.clockInPhotoLabel}</h5>

                              <Webcam
                                screenshotFormat="image/jpeg"
                                ref={webcamRef}
                                mirrored={true}
                                disablePictureInPicture={true}
                                forceScreenshotSourceSize={true}
                                imageSmoothing={false}
                                audio={false}
                                videoConstraints={{
                                  facingMode: { exact: 'user' },
                                  width: 400,
                                  height: 200,
                                }}
                              />

                              <button
                                type="button"
                                className="btn btn-sm btn-primary mt-2 mb-0"
                                onClick={capture}
                              >
                                Take Photo
                              </button>
                            </div>
                          )}

                          {photo.loading && <LoadingDiv label="Please wait..." />}

                          {!photo.loading && photo.id && (
                            <button
                              type="button"
                              className="btn btn-sm btn-success w-100"
                              onClick={handleClockIn}
                            >
                              Please Check In
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {offer.run?.clockType === 'DYNAMIC' && (
                <button type="button" className="btn btn-sm btn-success" onClick={handleClockIn}>
                  Continue <i className="mdi mdi-arrow-right"></i>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// <div className="col-lg-6 col-xxl-3">
//   <div className="card d-block">
//     <div className="card-body pb-0">
//       <p className="text-muted font-13 mb-3">
//         With supporting text below as a natural lead-in to additional contenposuere erat a ante...
//         <a href="javascript:void(0);" className="fw-bold text-muted">
//           view more
//         </a>
//       </p>

//       <div className="row">
//         <div className="col-md-4">
//           <p className="text-muted text-uppercase font-12 mb-0 mt-0">Potential Pay</p>
//           <h4 className="fw-normal mb-2">
//             <span>
//               <small className="text-muted me-1">ksh</small>
//               <b className="text-warning">0.00</b>
//             </span>
//           </h4>
//         </div>
//         <div className="col-md-4">
//           <p className="text-muted text-uppercase font-12 mb-0 mt-0">Unlocked Pay</p>
//           <h4 className="fw-normal mb-2">
//             <span>
//               <small className="text-muted me-1">ksh</small>
//               <b className="text-info">0.00</b>
//             </span>
//           </h4>
//         </div>
//         <div className="col-md-4">
//           <p className="text-muted text-uppercase font-12 mb-0 mt-0">Paid Amount</p>
//           <h4 className="fw-normal mb-2">
//             <span>
//               <small className="text-muted me-1">ksh</small>
//               <b className="text-success">0.00</b>
//             </span>
//           </h4>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-md-4">
//           <p className="mb-0">
//             <span className="pe-2 text-nowrap mb-2 d-inline-block text-muted">
//               <i className="mdi mdi-target-account me-1"></i>
//               <b className="me-1">0/0</b>
//               <small>KPIs Achieved</small>
//             </span>
//           </p>
//         </div>
//         <div className="col-md-4">
//           <p className="mb-0">
//             <span className="pe-2 text-nowrap mb-2 d-inline-block text-muted">
//               <i className="mdi mdi-format-list-checks me-1"></i>
//               <b className="me-1">0/0</b>
//               <small>Reports Filled</small>
//             </span>
//           </p>
//         </div>
//         <div className="col-md-4">
//           <p className="mb-0">
//             <span className="text-nowrap mb-2 d-inline-block text-muted">
//               <i className="mdi mdi-shield-account-outline me-1"></i>
//               <b className="me-1">0%</b>
//               <small>Profile Complete</small>
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>

//     <ul className="list-group list-group-flush">
//       <li className="list-group-item p-3 pt-0">
//         <p className="mb-2 fw-bold text-muted">
//           <span className="">
//             Campaign progress (<small>3 Days To Go!</small>)
//           </span>
//           <span className="float-end ms-2">35%</span>
//         </p>

//         <div className="progress progress-sm">
//           <div
//             className="progress-bar"
//             role="progressbar"
//             aria-valuenow={100}
//             aria-valuemin={0}
//             aria-valuemax={100}
//             style={{ width: '35%' }}
//           />
//         </div>
//       </li>
//     </ul>
//   </div>
// </div>;
