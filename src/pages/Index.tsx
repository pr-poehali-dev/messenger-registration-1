import { useState } from 'react';
import { Registration } from '@/components/Registration';
import { Login } from '@/components/Login';
import { MessengerApp } from '@/components/MessengerApp';

interface User {
  phone: string;
  avatar: string;
  nickname: string;
  username: string;
  isPremium?: boolean;
}

export default function Index() {
  const [currentView, setCurrentView] = useState<'login' | 'registration' | 'messenger'>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleRegistrationComplete = (userData: User) => {
    setUser(userData);
    setCurrentView('messenger');
  };

  const handleLoginComplete = (userData: User) => {
    setUser(userData);
    setCurrentView('messenger');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginComplete}
          onSwitchToRegister={() => setCurrentView('registration')}
        />
      )}
      
      {currentView === 'registration' && (
        <Registration 
          onComplete={handleRegistrationComplete}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}
      
      {currentView === 'messenger' && user && (
        <MessengerApp user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}