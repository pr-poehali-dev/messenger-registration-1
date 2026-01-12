import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  phone: string;
  avatar: string;
  nickname: string;
  username: string;
  isPremium?: boolean;
}

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

export function ProfileView({ user, onLogout }: ProfileViewProps) {
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md p-8 border-0 shadow-xl">
        <div className="text-center space-y-6">
          <Avatar className="w-32 h-32 text-6xl bg-primary/10 mx-auto">
            <AvatarFallback className="text-6xl bg-transparent">{user.avatar}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{user.nickname}</h2>
              {user.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                  <Icon name="Crown" size={14} className="mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{user.username}</p>
            <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>
          </div>

          <div className="grid gap-3 pt-4">
            <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Чатов</p>
                  <p className="text-sm text-muted-foreground">2 активных</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Контактов</p>
                  <p className="text-sm text-muted-foreground">3 человека</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline" className="w-full h-12" disabled>
              <Icon name="Edit" className="mr-2" size={20} />
              Редактировать профиль
            </Button>
            <Button variant="outline" className="w-full h-12 text-destructive" onClick={onLogout}>
              <Icon name="LogOut" className="mr-2" size={20} />
              Выйти
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
