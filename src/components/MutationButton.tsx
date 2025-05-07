'use client';

import { IMutationButton } from 'src/lib/interface/general.interface';
import { FC } from 'react';

export const MutationButton: FC<IMutationButton> = (props) => {
  const {
    label,
    icon,
    loading,
    disable = false,
    type,
    className,
    outline,
    btntype,
    onClick,
    size = 'sm',
  } = props;
  const btn_type = btntype ? btntype : 'success';

  return (
    <button
      className={`btn btn-${size} ${
        outline ? `btn-outline-${btn_type}` : `btn-${btn_type}`
      } ${className} waves-effect waves-light`}
      type={type ? type : 'button'}
      disabled={disable ? disable : loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
          {label ? 'Loading...' : undefined}
        </>
      ) : (
        <span>
          <i className={`${icon} ${label ? 'me-2' : undefined}`}></i>
          {label ? label : undefined}
        </span>
      )}
    </button>
  );
};
