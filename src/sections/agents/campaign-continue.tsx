import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import { fDateTime } from 'src/utils/format-time';
import { fPercent } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { GQLMutation, GQLQuery } from 'src/lib/client';
import { InputClockInOut } from 'src/lib/interface/clock.interface';
import { CLOCK_IN_OUT } from 'src/lib/mutations/clock.mutation';
import { Q_SESSION_SELF } from 'src/lib/queries/session.query';
import { sourceImage, uploadPhoto } from 'src/lib/server';
import { IPictureUpload } from 'src/lib/interface/general.interface';

// ----------------------------------------------------------------------

type TClientTier1 = {
  name: string;
  __typename: 'TClientTier1';
};

type TClientTier2 = {
  name: string;
  clientTier1: TClientTier1;
  __typename: 'TClientTier2';
};

type TCampaign = {
  name: string;
  clientTier2: TClientTier2;
  __typename: 'TCampaign';
};

type TProject = {
  name: string;
  __typename: 'TProject';
};

type TCampaignRun = {
  id: string;
  code: string;
  project: TProject;
  campaign: TCampaign;
  __typename: 'TCampaignRun';
};

type TUserProfile = {
  photo: string | null;
  __typename: 'TUserProfile';
};

type TUser = {
  name: string;
  profile: TUserProfile;
  __typename: 'TUser';
};

type TAgent = {
  user: TUser;
  __typename: 'TAgent';
};

type TCampaignRunOffer = {
  index: number;
  id: string;
  created: string;
  agent: TAgent;
  campaignRun: TCampaignRun;
  __typename: 'TCampaignRunOffer';
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  runs: TCampaignRunOffer[];
  list: {
    id: string;
    title: string;
    coverUrl: string;
    totalLesson: number;
    currentLesson: number;
  }[];
};

export function CampaignContinue({ title, subheader, runs, list, ...other }: Props) {
  return (
    <Card {...other} style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        {runs?.length ? (
          runs.map((run) => <Item key={run.id} run={run} />)
        ) : (
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>No active runs available</Box>
        )}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  run: any;
};

function Item({ run, sx, ...other }: ItemProps) {
  const totalTasks = 100;
  const completedTasks = 65;
  const percent = (completedTasks / totalTasks) * 100;

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
    if (run.id && session?.user?.agent?.id) {
      if (run.campaignRun.clockType === 'STATIC') {
        let canClockIn = true;

        if (run.campaignRun.clockInPhotoLabel && !photo.id) {
          canClockIn = false;
        }

        if (canClockIn) {
          clockInAndOut({
            variables: {
              input: {
                ...input,
                runId: run.id,
                agentId: session.user.agent.id,
                clockInAt: new Date(),
                clockPhotoId: photo.id,
                lat: 0, // replace with actual latitude
                lng: 0, // replace with actual longitude
                clockMode: 'WALKING',
              },
            },
          });
          setPhoto(initPhoto);
        } else {
          alert(`Please take a ${run.campaignRun.clockInPhotoLabel}`);
        }
      } else {
        clockInAndOut({
          variables: {
            input: {
              ...input,
              runId: run.id,
              agentId: session.user.agent.id,
              clockInAt: new Date(),
              lat: 0, // replace with actual latitude
              lng: 0, // replace with actual longitude
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
      window.location.replace(`/agent/campaigns/${run.id}`);
    }
  }, [clocked]);

  return (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'flex-start', ...sx }} {...other}>
      <Avatar
        alt={run.agent.user.name}
        src={run.agent.user.profile.photo || 'assets/icons/components/ic_extra_image.svg'}
        variant="rounded"
        sx={{ width: 56, height: 56 }}
      />

      <Box sx={{ minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Link
          href={paths.v2.agent.campaigns.details(run.id)}
          color="inherit"
          noWrap
          sx={{ mb: 0.5, typography: 'subtitle2' }}
        >
          {run.campaignRun.campaign.name}
        </Link>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
          Project: {run.campaignRun.project?.name ?? ''}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
          Client: {run.campaignRun.campaign.clientTier2.clientTier1.name} -{' '}
          {run.campaignRun.campaign.clientTier2.name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1 }}>
          Started: {fDateTime(run.created)}
        </Typography>

        <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
          Tasks: {completedTasks}/{totalTasks}
        </Box>

        <Box sx={{ width: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress
            color="warning"
            variant="determinate"
            value={percent}
            sx={{
              width: 1,
              height: 6,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
              [` .${linearProgressClasses.bar}`]: { opacity: 0.8 },
            }}
          />
          <Box
            component="span"
            sx={{
              width: 40,
              typography: 'caption',
              color: 'text.secondary',
              fontWeight: 'fontWeightMedium',
            }}
          >
            {fPercent(percent)}
          </Box>
        </Box>

        {run.campaignRun.clockType === 'STATIC' && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {}}
              startIcon={<Iconify icon="mingcute:clock-2-line" />}
              data-bs-toggle="modal"
              data-bs-target={`#check-in-${run.id}`}
            >
              Check Into Campaign
            </Button>

            <div
              tabIndex={-1}
              className="modal fade"
              id={`check-in-${run.id}`}
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
                    {run.campaignRun.clockInPhotoLabel && (
                      <div className="mb-3">
                        <h5 className="mt-0 mb-3">{run.campaignRun.clockInPhotoLabel}</h5>

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

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={capture}
                          sx={{ mt: 2, mb: 0 }}
                        >
                          Take Photo
                        </Button>
                      </div>
                    )}

                    {photo.loading && <Typography>Please wait...</Typography>}

                    {!photo.loading && photo.id && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleClockIn}
                        sx={{ width: '100%' }}
                      >
                        Please Check In
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {run.campaignRun.clockType === 'DYNAMIC' && (
          <Button
            variant="contained"
            color="success"
            onClick={handleClockIn}
            startIcon={<Iconify icon="mingcute:arrow-right-fill" />}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  );
}
