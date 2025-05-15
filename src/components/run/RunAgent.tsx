'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';

import { GQLMutation, GQLQuery } from 'src/lib/client';
import { CLOCK_IN_OUT } from 'src/lib/mutations/clock.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { IPictureUpload } from 'src/lib/interface/general.interface';
import { InputClockInOut } from 'src/lib/interface/clock.interface';
import { uploadPhoto } from 'src/lib/server';
import { LoadingDiv } from '../LoadingDiv';

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
      window.location.replace(`/v2/agent/dashboard/campaigns/${offer.id}`);
    }
  }, [clocked, offer.id]);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title font-18">
          <a href="#">{offer.run?.name}</a>
        </h5>

        <div className="pe-2 text-nowrap mb-2 d-inline-block">
          <i className="mdi mdi-google-my-business text-muted me-2"/>
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
                    Check In <i className="mdi mdi-timer-outline"/>
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
                                mirrored
                                disablePictureInPicture
                                forceScreenshotSourceSize
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
                  Continue <i className="mdi mdi-arrow-right"/>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};