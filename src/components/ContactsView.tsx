import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: string;
}

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Анна Смирнова', username: '@anna_s', avatar: '🌸', status: 'В сети' },
    { id: '2', name: 'Максим Петров', username: '@maxpetrov', avatar: '🎯', status: 'Был(а) недавно' },
    { id: '3', name: 'Екатерина Волкова', username: '@kate_v', avatar: '✨', status: 'В сети' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newContactUsername, setNewContactUsername] = useState('');

  const handleAddContact = () => {
    if (!newContactUsername.trim()) {
      toast.error('Введите юзернейм');
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: 'Новый контакт',
      username: newContactUsername,
      avatar: '👤',
      status: 'Был(а) недавно',
    };

    setContacts([...contacts, newContact]);
    setAddDialogOpen(false);
    setNewContactUsername('');
    toast.success('Контакт добавлен');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Контакт удален');
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Контакты</h2>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => setAddDialogOpen(true)}
          >
            <Icon name="UserPlus" size={20} />
          </Button>
        </div>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск контактов..."
            className="pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="grid gap-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all flex items-center gap-4"
              >
                <Avatar className="w-14 h-14 text-2xl bg-primary/10">
                  <AvatarFallback className="text-2xl bg-transparent">{contact.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{contact.username}</p>
                  <p className="text-xs text-muted-foreground mt-1">{contact.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <Icon name="MessageCircle" size={18} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="rounded-full text-destructive"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить контакт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="@username"
              value={newContactUsername}
              onChange={(e) => setNewContactUsername(e.target.value)}
              className="h-12"
            />
            <Button onClick={handleAddContact} className="w-full h-12">
              <Icon name="UserPlus" className="mr-2" size={20} />
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
