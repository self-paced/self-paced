import AppFrame from './AppFrame';
import DialogProvider from './DialogProvider';
import ToastProvider from './ToastProvider';

const AppUtilityProvider: React.FC<{
  children: React.ReactNode;
  noFrame: boolean | undefined;
}> = ({ children, noFrame }) => {
  return (
    <ToastProvider>
      <DialogProvider>
        {noFrame ? <>{children}</> : <AppFrame>{children}</AppFrame>}
      </DialogProvider>
    </ToastProvider>
  );
};

export default AppUtilityProvider;
