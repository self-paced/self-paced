import type { NextPage } from 'next';
import { RenderPage } from 'selfpaced';

interface Props {
  children?: React.ReactNode;
}

const APage: React.FC = () => {
  return <div>Themed Page</div>;
};

const themes = {
  './aaa': APage,
};

const Page: React.FC<Props> = ({ children }) => {
  return <RenderPage themes={themes}>{children}</RenderPage>;
};

export default Page;
