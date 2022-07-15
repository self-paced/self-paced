import { useSession, signIn } from 'next-auth/react';
import { getCookie } from 'cookies-next';

export function Auth({ children }) {
  const token = getCookie('accessToken');

  const { status } = useSession();

  // 未セッションの場合はtoken認証
  if (status === 'unauthenticated') {
    signIn('credentials', { token: token, domain: 'ec-force.com' });
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}
