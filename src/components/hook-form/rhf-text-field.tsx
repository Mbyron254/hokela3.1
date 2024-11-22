import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

type Props = TextFieldProps & {
  name: string;
};

export function RHFTextField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            const {value} = event.target;
            if (type === 'number') {
              field.onChange(value === '' ? '' : Number(value));
            } else {
              field.onChange(value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
            ...(type === 'number' && { min: 0, step: 1 }), // Example constraints for a number field
          }}
          {...other}
        />
      )}
    />
  );
}
