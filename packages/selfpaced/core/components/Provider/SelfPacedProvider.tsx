import AuthGuard from '../Auth/AuthGuard';

const SelfPacedProvider: React.FC = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default SelfPacedProvider;
