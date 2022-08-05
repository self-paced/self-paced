import { createContext, useContext, useState } from 'react';
import Dialog from './Dialog';

interface DialogOptions {
  title: string;
  message?: string;
  noCancelButton?: boolean;
}

interface PromiseInfo {
  resolve: (value: boolean | PromiseLike<boolean>) => void;
  reject: (reason?: any) => void;
}

type ShowDialogHandler = (options: DialogOptions) => Promise<boolean>;

const DialogContext = createContext<ShowDialogHandler>(() => {
  throw new Error('Component is not wrapped with a DialogProvider.');
});

const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: '',
  });
  const [promiseInfo, setPromiseInfo] = useState<PromiseInfo>();
  const handleCancel = () => {
    setOpen(false);
    promiseInfo!.resolve(false);
    setPromiseInfo(undefined);
  };
  const handleConfirm = () => {
    setOpen(false);
    promiseInfo!.resolve(true);
    setPromiseInfo(undefined);
  };
  const showDialog: ShowDialogHandler = (options) => {
    return new Promise<boolean>((resolve, reject) => {
      setPromiseInfo({ resolve, reject });
      setOptions(options);
      setOpen(true);
    });
  };
  return (
    <>
      <Dialog
        open={open}
        title={options.title}
        body={options.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        noCancelButton={options.noCancelButton}
      />
      <DialogContext.Provider value={showDialog}>
        {children}
      </DialogContext.Provider>
    </>
  );
};

export const useDialog = () => {
  return useContext(DialogContext);
};

export default DialogProvider;
