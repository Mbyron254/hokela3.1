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
      country='ke'
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
      inputStyle={{
        width: '100%',
        border: 'none',
        borderBottom: '2px solid #3f51b5',
        borderRadius: '0',
        padding: '10px 0',
        boxShadow: 'none',
        transition: 'border-color 0.3s',
      }}
      buttonStyle={{
        border: 'none',
        backgroundColor: 'transparent',
        padding: '0',
        margin: '0',
      }}
      containerClass='custom-phone-input-container'
    />
  );
}
