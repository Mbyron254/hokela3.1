'use client';

import { unallocatedAssets } from 'src/lib/helpers';
import { ISelectMultiple } from 'src/lib/interface/general.interface';
import Multiselect from 'multiselect-react-dropdown';
import { FC } from 'react';
import { Icon } from '@iconify/react';

export const SelectMultiple: FC<ISelectMultiple> = (props) => {
  const {
    checkbox,
    asset,
    allOptions,
    options,
    setOptions,
    selected,
    setSelected,
    disablePreselected,
    displayValue = 'name',
    disable = false,
  } = props;

  return (
    <Multiselect
      caseSensitiveSearch={false}
      isObject
      disable={disable}
      displayValue={displayValue}
      showCheckbox={checkbox}
      options={options}
      selectedValues={selected} // Pre-selected!
      disablePreSelectedValues={disablePreselected}
      selectionLimit={-1}
      onSelect={(data) => {
        setSelected(data);
        setOptions(unallocatedAssets(data, allOptions));
      }}
      onRemove={(data) => {
        setSelected(data);
        setOptions(unallocatedAssets(data, allOptions));
      }}
      placeholder={`Search ${asset}`}
      emptyRecordMsg={`No  ${asset} in list`}
      customCloseIcon={
        <Icon
          icon="mdi:cancel"
          className="fs-5"
          style={{ marginLeft: '8px', color: 'rgb(158,163,181,.9)' }}
        />
      }
      style={{
        chips: {
          color: '#d6d9f0',
          background: '#343a40',
          border: '2px solid rgb(158,163,181,.7) ',
          'border-radius': '3px',
          padding: '4px',
        },
        multiselectContainer: {
          color: '#464f5b',
        },
        searchBox: {
          color: '#d6d9f0',
          border: 'none',
          'border-bottom': '1px solid #d6d9f0',
          'border-radius': '0px',
        },
      }}
    />
  );
};
