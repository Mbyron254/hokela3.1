import type { ToastOptions, ToastContainerProps } from 'react-toastify';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Zoom, toast } from 'react-toastify';

import { randomHexadecimal } from './helpers';

export const OToastContainer: ToastContainerProps = {
  transition: Zoom,
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

const OToast: ToastOptions = {
  // toastId: randomHexadecimal(10),
  // position: "top-right",
  // autoClose: 5000,
  // hideProgressBar: false,
  // closeOnClick: false,
  // pauseOnHover: true,
  // draggable: true,
  // progress: undefined,
};

export const toastSuccess = (message: string) => {
  toast.success(message, { ...OToast, toastId: randomHexadecimal(10) });
};

export const toastError = (message: string) => {
  toast.error(message, { ...OToast, toastId: randomHexadecimal(10) });
};

export const toastWarning = (message: string) => {
  toast.warning(message, { ...OToast, toastId: randomHexadecimal(10) });
};
