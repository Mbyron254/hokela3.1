'use client';

import { FC } from 'react';

export const LoadingSpan: FC<{ label?: string }> = ({ label }) => {
  return (
    <span className="text-center text-muted m-2" style={{ fontSize: '10px' }}>
      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
      {label && <span className="mt-0">{label}...</span>}
    </span>
  );
};
