import AuthGuard from '../Auth/AuthGuard';

interface Props {
  children?: React.ReactNode;
}

const SelfPacedProvider: React.FC<Props> = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default SelfPacedProvider;
