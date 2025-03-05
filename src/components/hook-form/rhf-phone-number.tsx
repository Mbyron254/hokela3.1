import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Box,
  Menu,
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputAdornment,
} from '@mui/material';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import PhoneIcon from '@mui/icons-material/Phone';
import Iconify from '../iconify';

// List of countries with their codes for the dropdown menu
const countries = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
];

interface RHFPhoneNumberInputProps {
  name: string;
  helperText?: string;
}

export default function RHFPhoneNumberInput({
  name,
  helperText,
}: RHFPhoneNumberInputProps) {
  const { control } = useFormContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  // Open the dropdown menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle the country selection
  const handleMenuItemClick = (country: { name: string; code: string; flag: string }) => {
    setSelectedCountry(country);
    handleClose();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <Button
              onClick={handleClick}
              endIcon={ <Iconify icon="majesticons:maximize-line" width={12} />}
              sx={{
                textTransform: 'none',
                justifyContent: 'space-between',
                width: '100%',
                // backgroundColor: '#f0f0f0',
                border: '1px solid #f0f0f0',
                borderRadius: '10px',
                color: 'black',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {selectedCountry.flag}
                <span style={{ marginLeft: '8px' }}>{selectedCountry.code}</span>
              </span>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 200,
                  width: '250px',
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem
                  key={country.code}
                  onClick={() => handleMenuItemClick(country)}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {country.flag}
                    <span style={{ marginLeft: '8px' }}>{country.name} ({country.code})</span>
                  </span>
                </MenuItem>
              ))}
            </Menu>
          </FormControl>
          <TextField
            {...field}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="123-456-7890"
            error={!!error}
            helperText={error ? error.message : helperText}
            sx={{
              flexGrow: 1,
              marginLeft: 1,
              backgroundColor: '#f8f8f8',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" color="black">
                 <Iconify icon="majesticons:maximize-line" width={12} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    />
  );
}
