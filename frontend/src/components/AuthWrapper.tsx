import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

type AuthMode = 'login' | 'signup';

export function AuthWrapper() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <>
      {authMode === 'login' ? (
        <LoginForm onSwitchToSignup={() => setAuthMode('signup')} />
      ) : (
        <SignupForm onSwitchToLogin={() => setAuthMode('login')} />
      )}
    </>
  );
}