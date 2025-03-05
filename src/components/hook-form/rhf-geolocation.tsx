import { isNumber } from 'lodash';
import { MapRef } from 'react-map-gl';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { Card, Stack, Button, FormHelperText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import useUserLocation from 'src/hooks/use-user-location';

import { fDateTime } from 'src/utils/format-time';

import { useRealmApp } from 'src/components/realm';

import UserActivityRoutesMap from 'src/sections/campaign/list/user-activity/routes/user-activity-routes-map';

import { IUser } from 'src/types/user_realm';
import { IUserCheckinData } from 'src/types/campaign';

import Iconify from '../iconify';

type Props = {
  name: string;
};

function RHFGeoLocation({ name, ...other }: Props) {
  const { control, setValue } = useFormContext();

  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<IUserCheckinData | null>(null);
  const fetchDirections = useBoolean();
  const userLocation = useUserLocation();
  const { currentUser } = useRealmApp();

  const user = useMemo(
    () => currentUser?.customData as unknown as IUser,
    [currentUser?.customData]
  );

  const handleSetPopupInfo = useCallback((pInfo: IUserCheckinData | null) => {
    setPopupInfo(pInfo);
  }, []);

  const refetchLocation = () => {
    userLocation.refetch();
  };

  const contacts = useMemo(() => {
    if (
      !userLocation.loading &&
      !userLocation.error &&
      (userLocation.latitude === null || userLocation.longitude === null)
    )
      return [];
    return [
      {
        lnglat: [userLocation.latitude as number, userLocation.longitude as number],
        address: fDateTime(new Date()),
        phoneNumber: user?.phoneNumber ?? '',
        photoURL: "",
        products: [],
      },
    ];
  }, [
    user,
    userLocation.loading,
    userLocation.error,
    userLocation.latitude,
    userLocation.longitude,
  ]);

  useEffect(() => {
    if (isNumber(userLocation.latitude) && isNumber(userLocation.longitude)) {
      setValue(name, [userLocation.latitude, userLocation.longitude]);
    }
  }, [userLocation.latitude, userLocation.longitude, name, setValue]);

  const renderRefetch = (
    <Button
      onClick={refetchLocation}
      variant="contained"
      color="primary"
      startIcon={<Iconify icon="ic:round-refresh" />}
    >
      Refetch Location
    </Button>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Stack spacing={2}>
            <Card sx={{ p: 0, position: 'relative', width: '100%', height: '400px' }}>
              <UserActivityRoutesMap
                ref={mapRef}
                popupInfo={popupInfo}
                handleSetPopupInfo={handleSetPopupInfo}
                contacts={contacts}
                error={error?.message ? new Error(error?.message) : undefined}
                handleNewRouteOpen={() => console.log('NEW ROUTE OPEN')}
                fetchDirections={fetchDirections.value}
                refetchLocation={renderRefetch}
              />
            </Card>
          </Stack>
          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}

export default RHFGeoLocation;
