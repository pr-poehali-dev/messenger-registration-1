import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  phone: string;
  avatar: string;
  nickname: string;
  username: string;
  isPremium?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  type: 'direct' | 'group' | 'channel';
}

export function ChatsView({ user }: { user: User }) {
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', name: 'Общий чат', avatar: '👥', lastMessage: 'Привет всем!', unread: 0, type: 'group' },
    { id: '2', name: 'Новости Lites', avatar: '📢', lastMessage: 'Новое обновление!', unread: 1, type: 'channel' },
  ]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'group' | 'channel'>('group');
  const [newChatName, setNewChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    setChats(chats.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: messageInput }
        : chat
    ));

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за сообщение! 👋',
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) {
      toast.error('Введите название');
      return;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      name: newChatName,
      avatar: createType === 'group' ? '👥' : '📢',
      lastMessage: 'Чат создан',
      unread: 0,
      type: createType,
    };

    setChats([newChat, ...chats]);
    setCreateDialogOpen(false);
    setNewChatName('');
    toast.success(`${createType === 'group' ? 'Группа' : 'Канал'} создан!`);
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Чаты</h2>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Icon name="Plus" size={20} />
            </Button>
          </div>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                setMessages([
                  { id: '1', text: 'Привет! Как дела?', sender: 'other', timestamp: new Date() },
                ]);
              }}
              className={`w-full p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-accent/30' : ''
              }`}
            >
              <Avatar className="w-12 h-12 text-xl bg-primary/10">
                <AvatarFallback className="text-xl bg-transparent">{chat.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold truncate">{chat.name}</p>
                  {chat.type === 'channel' && <Icon name="Radio" size={14} className="text-muted-foreground" />}
                  {chat.type === 'group' && <Icon name="Users2" size={14} className="text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </ScrollArea>
      </aside>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 text-lg bg-primary/10">
                  <AvatarFallback className="text-lg bg-transparent">{selectedChat.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.type === 'channel' ? 'Канал' : selectedChat.type === 'group' ? 'Группа' : 'Личный чат'}
                  </p>
                </div>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  placeholder="Сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-12"
                />
                <Button onClick={handleSendMessage} size="icon" className="h-12 w-12 rounded-full">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Выберите чат для начала общения</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать {createType === 'group' ? 'группу' : 'канал'}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={createType} onValueChange={(v) => setCreateType(v as 'group' | 'channel')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="group">Группа</TabsTrigger>
              <TabsTrigger value="channel">Канал</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4 pt-4">
            <Input
              placeholder="Название"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="h-12"
            />
            <Button onClick={handleCreateChat} className="w-full h-12">
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
