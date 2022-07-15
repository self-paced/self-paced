import AppFrame from './AppFrame';
import DialogProvider from './DialogProvider';

const AppUtilityProvider: React.FC<{
  children: React.ReactNode;
  noFrame: boolean | undefined;
}> = ({ children, noFrame }) => {
  return (
    <DialogProvider>
      {noFrame ? <>{children}</> : <AppFrame>{children}</AppFrame>}
    </DialogProvider>
  );
};

export default AppUtilityProvider;
