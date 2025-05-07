'use client';

import { FC } from 'react';

export const LoadingDiv: FC<{ label?: string }> = (props) => {
  const { label } = props;

  return (
    <div className='text-center text-primary m-2'>
      <span
        className='spinner-border spinner-border-sm me-2'
        role='status'
        aria-hidden='true'
      />
      <span className='mt-0'>{label ? label : 'Loading'}...</span>
    </div>
  );
};
