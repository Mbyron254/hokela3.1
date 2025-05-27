'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Card, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

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
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          <a href="#">{offer.run?.name}</a>
        </Typography>

        <Typography variant="body2" color="text.secondary" className="pe-2 text-nowrap mb-2 d-inline-block">
          <Icon icon="mdi:google-my-business" className="text-muted me-2" />
          <b>{offer.run?.campaign?.project?.clientTier2?.clientTier1?.name}</b>
        </Typography>

        <div>
          {session?.user?.agent?.id && (
            <>
              {offer.run?.clockType === 'STATIC' && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#check-in-${offer.id}`}
                    startIcon={<Icon icon="mdi:camera" />}
                  >
                    Check In
                  </Button>

                  <Dialog
                    open={Boolean(document.getElementById(`check-in-${offer.id}`))}
                    onClose={() => document.getElementById(`check-in-${offer.id}`)?.setAttribute('aria-hidden', 'true')}
                    aria-labelledby="check-in-dialog-title"
                  >
                    <DialogTitle id="check-in-dialog-title">
                      Check In
                      <IconButton
                        aria-label="close"
                        onClick={() => document.getElementById(`check-in-${offer.id}`)?.setAttribute('aria-hidden', 'true')}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: (theme) => theme.palette.grey[500],
                        }}
                      >
                        <Icon icon="mdi:close" />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                      {offer.run?.clockInPhotoLabel && (
                        <div className="mb-3">
                          <Typography variant="h6" className="mt-0 mb-3">{offer.run.clockInPhotoLabel}</Typography>

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

                          <Button
                            variant="contained"
                            color="primary"
                            className="mt-2 mb-0"
                            onClick={capture}
                            startIcon={<Icon icon="mdi:camera" />}
                          >
                            Take Photo
                          </Button>
                        </div>
                      )}

                      {photo.loading && <LoadingDiv label="Please wait..." />}

                      {!photo.loading && photo.id && (
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={handleClockIn}
                        >
                          Please Check In
                        </Button>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {offer.run?.clockType === 'DYNAMIC' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleClockIn}
                  endIcon={<Icon icon="mdi:arrow-right" />}
                >
                  Continue
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};