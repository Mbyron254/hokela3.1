import { enqueueSnackbar } from 'notistack';
import React, {
  memo,
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Stack, Button, Container, Typography } from '@mui/material';

import {Iconify} from '../iconify';
import { SingleFilePreview } from '../upload';

export interface CustomCameraRef extends HTMLDivElement {
  stopVideoStreams: () => void;
}
type CustomCameraProps = {
  action: { fn: (file?: string | null) => Promise<void>; title: string; loading: boolean };
  backCamera?: boolean;
};

// eslint-disable-next-line react/display-name
const CustomCamera = forwardRef<CustomCameraRef, CustomCameraProps>(
  ({ action, backCamera = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [streaming, setStreaming] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [photo, setPhoto] = useState<File | null>(null);
    const abortingRef = useRef<boolean>(false);
    const [usingBackCamera, setUsingBackCamera] = useState<boolean>(backCamera);

    const stopVideoStreams = () => {
      const videoElement = videoRef.current;
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
            console.log(`Track with kind ${track.kind} stopped`);
          });
          videoElement.srcObject = null;
          console.log('Video stream stopped and srcObject set to null');
        }
      } else {
        console.log('No video stream found to stop');
      }
    };

    const startVideo = async () => {
      if (abortingRef.current) return;

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        let videoSource = videoDevices[0].deviceId;

        if (usingBackCamera) {
          const backCameraDevice = videoDevices.find((device) =>
            device.label.toLowerCase().includes('back')
          );
          if (backCameraDevice) {
            videoSource = backCameraDevice.deviceId;
          }
        }

        stopVideoStreams();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoSource ? { exact: videoSource } : undefined },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreaming(true);
          console.log('Video stream started');
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
        if (err instanceof DOMException) {
          switch (err.name) {
            case 'NotAllowedError':
              setError('Permission to access the webcam was denied.');
              break;
            case 'NotFoundError':
              setError('No webcam found on this device.');
              break;
            case 'NotReadableError':
              setError('Webcam is already in use by another application.');
              break;
            case 'OverconstrainedError':
              setError('No suitable webcam found.');
              break;
            case 'AbortError':
              setError('Webcam access aborted.');
              break;
            default:
              setError('Error accessing webcam. Please check your permissions and try again.');
          }
        } else {
          setError('Error accessing webcam. Please check your permissions and try again.');
        }
      }
    };

    useImperativeHandle(ref, () => ({ stopVideoStreams } as CustomCameraRef));

    useEffect(() => {
      startVideo();

      return () => {
        abortingRef.current = true;
        stopVideoStreams();
        setTimeout(() => {
          abortingRef.current = false;
        }, 100); // Short delay to ensure abort is processed
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usingBackCamera]);

    const takePicture = async () => {
      if (videoRef.current && canvasRef.current && streaming) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], 'picture.png', { type: 'image/png' });
              setPhoto(file);
              stopVideoStreams(); // Ensure video stream is stopped here as well
              setStreaming(false);
            }
          }, 'image/png');
        }
      }
    };

    const acceptPhoto = useCallback(async () => {
      stopVideoStreams();
      if (photo === null) {
        enqueueSnackbar('Please take a photo first', { variant: 'error' });
        return;
      }
      const newFile = URL.createObjectURL(photo);
      await action.fn(newFile);
    }, [action, photo]);

    const rejectPhoto = useCallback(() => {
      setPhoto(null);
      startVideo();
      //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

    const imagePreview = useMemo(() => {
      if (!photo) return undefined;

      const newFile = Object.assign(photo, {
        preview: URL.createObjectURL(photo),
      });

      return newFile || undefined;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photo]);

    const renderSinglePreview = (
      <SingleFilePreview
        // @ts-expect-error
        imgUrl={typeof imagePreview === 'string' ? imagePreview : imagePreview?.preview}
        sx={{
          position: 'relative',
        }}
      />
    );

    const toggleCamera = () => {
      setUsingBackCamera((prev) => !prev);
    };

    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          {error && !photo && !streaming && !action.loading ? (
            <>
              <Typography color="error">{error}</Typography>
              <LoadingButton
                loading={action.loading}
                variant="contained"
                color="primary"
                onClick={() => action.fn(null)}
                sx={{ mt: 2 }}
              >
                {action.title ?? 'Take Another Picture'}
              </LoadingButton>
            </>
          ) : (
            <>
              {photo ? (
                <>
                  <Box
                    sx={{
                      maxWidth: '800px',
                      position: 'relative',
                      flexShrink: 0,
                      p: 1,
                    }}
                  >
                    {renderSinglePreview}
                  </Box>
                  <Stack direction="row" justifyContent="space-between" width={300}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={rejectPhoto}
                      startIcon={<Iconify icon="mingcute:close-line" width={20} height={20} />}
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Cancel
                    </Button>

                    <LoadingButton
                      loading={action.loading}
                      variant="contained"
                      color="primary"
                      onClick={acceptPhoto}
                      startIcon={<Iconify icon="mingcute:camera-line" width={20} height={20} />}
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      {action.title ?? 'Save Picture'}
                    </LoadingButton>
                  </Stack>
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    style={{ width: '100%', maxWidth: '800px', borderRadius: '10px' }}
                    autoPlay
                    playsInline
                  >
                    <track kind="captions" />
                  </video>
                  <LoadingButton
                    loading={action.loading}
                    variant="contained"
                    color="primary"
                    onClick={takePicture}
                    startIcon={<Iconify icon="mingcute:camera-line" width={20} height={20} />}
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Take Picture
                  </LoadingButton>
                  {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={toggleCamera}
                    startIcon={<Iconify icon="mingcute:camera-switch-line" width={20} height={20} />}
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Switch Camera
                  </Button> */}
                </>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
        </Box>
      </Container>
    );
  }
);

export default memo(CustomCamera);
