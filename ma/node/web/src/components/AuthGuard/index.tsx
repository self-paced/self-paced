import { useSession, signIn } from 'next-auth/react';
import { getCookie } from 'cookies-next';
import React, { useState } from 'react';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getCookie('accessToken');
  const [loginTryCount, setLoginTryCount] = useState(0);
  const { status } = useSession({
    required: true,
    async onUnauthenticated() {
      if (loginTryCount === 0) {
        await signIn('credentials', {
          token: token,
          domain: 'ec-force.com',
          redirect: false,
        });
        setLoginTryCount(loginTryCount + 1);
      } else {
        const path = window.location.pathname;
        if (window.location.hostname === 'localhost') {
          window.location.href = `http://localhost:3500/admins/sign_in?admin_return_to=${path}&customer_return_to=${path}`;
        } else {
          window.location.href = `${window.location.origin}/admins/sign_in?admin_return_to=${path}&customer_return_to=${path}`;
        }
      }
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
