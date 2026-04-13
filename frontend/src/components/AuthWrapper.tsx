import { useState } from 'react';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';

type AuthMode = 'login' | 'signup';

export function AuthWrapper() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <>
      {authMode === 'login' ? (
        <Login onSwitchToSignup={() => setAuthMode('signup')} />
      ) : (
        <Register onSwitchToLogin={() => setAuthMode('login')} />
      )}
    </>
  );
}
