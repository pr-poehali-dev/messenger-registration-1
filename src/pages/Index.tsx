import { useState, useEffect } from 'react';
import Registration from './Registration';
import Login from './Login';
import Messenger from './Messenger';

export default function Index() {
  const [view, setView] = useState<'login' | 'register' | 'messenger'>('login');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('messenger');
    }
  }, []);

  const handleAuthComplete = (userData: any) => {
    setUser(userData);
    setView('messenger');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
  };

  if (view === 'register') {
    return <Registration onComplete={handleAuthComplete} />;
  }

  if (view === 'login') {
    return <Login onComplete={handleAuthComplete} onRegister={() => setView('register')} />;
  }

  if (view === 'messenger' && user) {
    return <Messenger user={user} onLogout={handleLogout} />;
  }

  return null;
}
