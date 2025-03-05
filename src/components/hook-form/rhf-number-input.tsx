'use client';

import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Slider, Typography } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';

import { useRealmApp } from 'src/components/realm';

import { ICampaignProductItem } from 'src/types/campaign-product';



// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  product_id: string;
};

export default function RHFNumberInput({ name, product_id, helperText, type, ...other }: Props) {
  const { control } = useFormContext();
  const realmApp = useRealmApp();

  const [product, setProduct] = useState<ICampaignProductItem>();
  useEffect(() => {
    if (product_id) {
      realmApp.currentUser?.functions.getProductDetails(product_id).then((res) => {
        // console.log(res, 'RES')
        setProduct(res);
      }).catch((e) => {
        console.log(e, 'ERROR')
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  // console.log(product, 'PRODUCT ID')
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          {/* "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2" */}
          <Box
            component="img"
            sx={{
              height: 100,
              width: 150,
              maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 350, md: 250 },
              borderRadius: 2,
            }}
            alt="The house from the offer."
            src={product?.coverUrl ?? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"}
          />
          <Box sx={{
            ml: 2,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography variant="subtitle2">{product?.name}</Typography>
            <Typography variant="caption">{product?.price} $</Typography>
          </Box>

          <div style={{ display: 'flex', alignItems: 'center', width: '40%' }}>
            <Slider
              aria-label="Temperature"
              defaultValue={0}
              // getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              shiftStep={0}
              step={1}
              marks
              min={0}
              max={15}
              size='medium'
            />            {/* <IconButton
              sx={{ position: 'relative' }}
              onClick={() => field.onChange(field.value - 1)}
            >
              <Iconify icon="majesticons:minus" width={20} height={20} />
            </IconButton>
            <TextField
              {...field}
              sx={{ width: 100 }}
              type='number'
              value={field.value} 
              onChange={(event) => {
               
                  field.onChange(Number(event.target.value));
               
              }}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...other}
            />
            <IconButton
              sx={{ position: 'relative' }}
              onClick={() => field.onChange(field.value + 1)}
            >
              <Iconify icon="majesticons:plus-line" width={20} height={20} />
            </IconButton> */}
          </div>

        </div>

      )}
    />
  );
}
