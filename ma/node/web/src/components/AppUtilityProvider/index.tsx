import AppFrame from './AppFrame';

const AppUtilityProvider: React.FC<{
  children: React.ReactNode;
  noFrame: boolean | undefined;
}> = ({ children, noFrame }) => {
  return noFrame ? <>{children}</> : <AppFrame>{children}</AppFrame>;
};

export default AppUtilityProvider;
