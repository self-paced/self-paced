import { createContext, useContext, useState } from 'react';
import Toast from './Toast';

interface ToastOptions {
  message: string;
  variant?: 'success' | 'error' | 'warning';
}

type ShowToastHandler = (options: ToastOptions) => void;

const ToastContext = createContext<ShowToastHandler>(() => {
  throw new Error('Component is not wrapped with a DialogProvider.');
});

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ToastOptions>({
    message: '',
  });
  const handleClose = () => {
    setOpen(false);
  };
  const showToast: ShowToastHandler = (options) => {
    setOptions(options);
    setOpen(true);
  };
  return (
    <>
      <Toast
        open={open}
        onClose={handleClose}
        message={options.message}
        variant={options.variant}
      />
      <ToastContext.Provider value={showToast}>
        {children}
      </ToastContext.Provider>
    </>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

export default ToastProvider;
