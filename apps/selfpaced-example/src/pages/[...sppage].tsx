import type { NextPage } from 'next';
import { RenderPage } from 'selfpaced';

const APage: React.FC = ({ children }) => {
  return <div>Themed Page</div>;
};

const themes = {
  aaa: APage,
};

const Page: NextPage = ({ children }) => {
  return <RenderPage themes={themes}>{children}</RenderPage>;
};

export default Page;
