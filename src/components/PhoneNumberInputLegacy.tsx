'use client';

import PhoneInput from 'react-phone-input-2';

import { COUNTRY_NAME_CODES } from 'src/lib/constant';
import { IPhoneNumberInputLegacy } from 'src/lib/interface/general.interface';
import { internationalizePhoneNumber } from 'src/lib/helpers';

export default function PhoneNumberInputLegacy({
  value,
  onChange,
  required = true,
}: IPhoneNumberInputLegacy): JSX.Element {
  return (
    <PhoneInput
      country={'ke'}
      onlyCountries={COUNTRY_NAME_CODES}
      countryCodeEditable={false}
      value={value}
      onChange={(phoneNumber) =>
        onChange(internationalizePhoneNumber(phoneNumber))
      }
      inputProps={{
        required,
        name: 'phone',
        id: 'phone',
        className: `form-control w-100`,
        style: {
          // innerWidth: '100%',
        },
      }}
    />
  );
}
