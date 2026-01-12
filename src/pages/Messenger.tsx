import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function Messenger({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('chats');
  const [chats, setChats] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    loadChats();
    loadContacts();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      const interval = setInterval(() => loadMessages(selectedChat.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const loadChats = async () => {
    const result = await api.getChats(user.id);
    if (result.success) setChats(result.chats);
  };

  const loadContacts = async () => {
    const result = await api.getContacts(user.id);
    if (result.success) setContacts(result.contacts);
  };

  const loadMessages = async (chatId: number) => {
    const result = await api.getMessages(chatId);
    if (result.success) setMessages(result.messages);
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;
    
    const result = await api.sendMessage(selectedChat.id, user.id, messageText);
    if (result.success) {
      setMessageText('');
      loadMessages(selectedChat.id);
    }
  };

  const createChat = async (type: string, name: string, members: number[]) => {
    const result = await api.createChat(type, name, '', user.id, members);
    if (result.success) {
      toast.success('Чат создан!');
      loadChats();
    }
  };

  const purchasePremium = async () => {
    const result = await api.createPayment(user.id, 'premium_subscription', 'card', 350);
    if (result.success) {
      window.open(result.payment_url, '_blank');
      toast.success('Перенаправляем на оплату...');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="text-2xl">{user.avatar_value}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold flex items-center gap-2">
                {user.nickname}
                {user.is_premium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
              </div>
              <div className="text-xs text-gray-500">@{user.username}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <Icon name="LogOut" size={18} />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="m-4 grid grid-cols-3">
            <TabsTrigger value="chats">Чаты</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-3 rounded-lg text-left mb-2 transition ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{chat.name || 'Чат'}</div>
                    <div className="text-sm text-gray-500 truncate">{chat.last_message || 'Нет сообщений'}</div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="text-xl">{contact.avatar_value}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {contact.nickname}
                        {contact.is_premium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                      </div>
                      <div className="text-sm text-gray-500">@{contact.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="profile" className="flex-1 mt-0">
            <div className="p-4 space-y-4">
              {!user.is_premium && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">Premium подписка</h3>
                  <p className="text-sm mb-4">Получите доступ ко всем функциям</p>
                  <p className="text-2xl font-bold mb-4">350₽/месяц</p>
                  <Button onClick={purchasePremium} variant="secondary" className="w-full">
                    Оформить Premium
                  </Button>
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Icon name="Users" size={18} className="mr-2" />
                    Создать группу
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать группу</DialogTitle>
                  </DialogHeader>
                  <CreateGroupForm onCreate={createChat} contacts={contacts} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Icon name="Radio" size={18} className="mr-2" />
                    Создать канал
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать канал</DialogTitle>
                  </DialogHeader>
                  <CreateChannelForm onCreate={createChat} />
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="font-semibold text-lg">{selectedChat.name || 'Чат'}</h2>
              <p className="text-sm text-gray-500">{selectedChat.description}</p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md ${msg.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-white'} rounded-2xl p-3 shadow-sm`}>
                      {msg.sender_id !== user.id && (
                        <div className="text-xs font-semibold mb-1 opacity-70">{msg.sender.nickname}</div>
                      )}
                      <div>{msg.content}</div>
                      <div className={`text-xs mt-1 ${msg.sender_id === user.id ? 'opacity-70' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
              <p>Выберите чат для начала общения</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateGroupForm({ onCreate, contacts }: any) {
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const handleCreate = () => {
    if (!name) {
      toast.error('Введите название группы');
      return;
    }
    onCreate('group', name, selectedMembers);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Название группы</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Моя группа" />
      </div>
      <Button onClick={handleCreate} className="w-full">Создать</Button>
    </div>
  );
}

function CreateChannelForm({ onCreate }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name) {
      toast.error('Введите название канала');
      return;
    }
    onCreate('channel', name, []);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Название канала</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Мой канал" />
      </div>
      <div>
        <Label>Описание</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="О чем канал?" />
      </div>
      <Button onClick={handleCreate} className="w-full">Создать</Button>
    </div>
  );
}
