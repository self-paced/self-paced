import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

export const RenderPage: React.FC = () => {
  const router = useRouter();
  if (!router) return null;
  const path = router.query.sppage as string[];
  const Page = dynamic(() =>
    import(`./${path.join('/')}`).catch(() => {
      return function Error() {
        return <div>Page Not Found</div>;
      };
    })
  );
  return <Page />;
};
