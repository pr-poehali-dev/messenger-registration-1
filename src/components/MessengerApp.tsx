import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { ChatsView } from '@/components/ChatsView';
import { ContactsView } from '@/components/ContactsView';
import { ProfileView } from '@/components/ProfileView';
import { SettingsView } from '@/components/SettingsView';

interface User {
  phone: string;
  avatar: string;
  nickname: string;
  username: string;
  isPremium?: boolean;
}

interface MessengerAppProps {
  user: User;
  onLogout: () => void;
}

export function MessengerApp({ user, onLogout }: MessengerAppProps) {
  const [activeView, setActiveView] = useState<'chats' | 'contacts' | 'profile' | 'settings'>('chats');

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
        <Avatar className="w-12 h-12 text-2xl bg-primary/10 cursor-pointer" onClick={() => setActiveView('profile')}>
          <AvatarFallback className="text-2xl bg-transparent">{user.avatar}</AvatarFallback>
        </Avatar>

        <nav className="flex-1 flex flex-col gap-4">
          <Button
            variant={activeView === 'chats' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveView('chats')}
          >
            <Icon name="MessageCircle" size={24} />
          </Button>
          
          <Button
            variant={activeView === 'contacts' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveView('contacts')}
          >
            <Icon name="Users" size={24} />
          </Button>
        </nav>

        <div className="flex flex-col gap-4">
          <Button
            variant={activeView === 'settings' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-2xl"
            onClick={() => setActiveView('settings')}
          >
            <Icon name="Settings" size={24} />
          </Button>
        </div>
      </aside>

      <main className="flex-1">
        {activeView === 'chats' && <ChatsView user={user} />}
        {activeView === 'contacts' && <ContactsView />}
        {activeView === 'profile' && <ProfileView user={user} onLogout={onLogout} />}
        {activeView === 'settings' && <SettingsView user={user} />}
      </main>
    </div>
  );
}
