'use client';

import PhoneInput from 'react-phone-input-2';

import { COUNTRY_NAME_CODES } from 'src/lib/constant';
import { IPhoneNumberInput } from 'src/lib/interface/general.interface';
import { internationalizePhoneNumber } from 'src/lib/helpers';

export default function PhoneNumberInput({
  input,
  phonekey,
  onChange,
  required = true,
}: IPhoneNumberInput): JSX.Element {
  return (
    <PhoneInput
      country='ke'
      onlyCountries={COUNTRY_NAME_CODES}
      countryCodeEditable={false}
      value={input[phonekey]}
      onChange={(phone) =>
        onChange({ ...input, [phonekey]: internationalizePhoneNumber(phone) })
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
