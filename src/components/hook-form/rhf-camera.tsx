import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';
import { Box, Stack, Button, Dialog, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CustomCamera } from 'src/components/camera';
import { enqueueSnackbar } from 'src/components/snackbar';

import Iconify from '../iconify';
import { SingleFilePreview } from '../upload';

type Props = {
  name: string;
  title: string;
  action?: (photo: string) => void;
};
function RHFCamera({ title, name, action }: Props) {
  const { control, setValue, watch } = useFormContext();
  const loadingCheckin = useBoolean(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const watchedImage: string | undefined = watch(name);

  const imagePreview = useMemo(() => {
    const file = watchedImage;
    if (!file) return undefined;

    const newFile = Object.assign(file, {
      preview: file,
    });

    return newFile || undefined;
  }, [watchedImage]);

  const takePhoto = async (photo: string | null | undefined) => {
    try {
      loadingCheckin.onTrue();
      //   const res = await realmApp.currentUser?.functions.userCampaignCheckinUpdated(checkingData);
      loadingCheckin.onFalse();
      setValue(name, photo);
      enqueueSnackbar('Photo Taken', { variant: 'success' });
      handleClose();
      if (action && photo) {
        action(photo); // Call the action function with the photo
      }

      //   router.replace(path);
      //   console.log(res, 'CHECKIN RESPONSE');
    } catch (error) {
      enqueueSnackbar('Error while taking photo', { variant: 'error' });
      console.error('Error while taking photo:', error);
    } finally {
      loadingCheckin.onFalse();
    }
  };
  const renderSinglePreview = (
    <SingleFilePreview
      imgUrl={imagePreview?.preview}
      sx={{
        position: 'relative',
      }}
    />
  );

  // const
  return (
    <>
      <Stack rowGap={2} justifyContent="center" alignItems="center">
        <Box
          sx={{
            width: 240,
            height: 240,
            position: 'relative',

            flexShrink: 0,
            p: 1,
          }}
        >
          {renderSinglePreview}
        </Box>

        <Button
          sx={{ width: 'max-content' }}
          variant="outlined"
          color="primary"
          onClick={handleOpen}
          size="large"
          startIcon={<Iconify icon="mingcute:camera-line" width={20} height={20} />}
        >
          {title || 'Take Picture'}
        </Button>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton sx={{ position: 'relative' }} onClick={handleClose}>
              <Iconify icon="mingcute:close-fill" width={20} height={20} />
            </IconButton>
          </Box>
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <CustomCamera
                  backCamera
                  action={{
                    fn: async (data) => takePhoto(data),
                    title,
                    loading: loadingCheckin.value,
                  }}
                />
                {error && (
                  <FormHelperText sx={{ px: 2 }} error>
                    {error.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Box>
      </Dialog>
    </>
  );
}

export default RHFCamera;
