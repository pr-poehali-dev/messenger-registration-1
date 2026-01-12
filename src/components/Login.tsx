import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface LoginProps {
  onLoginSuccess: (userData: { phone: string; avatar: string; nickname: string; username: string }) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    if (phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    
    onLoginSuccess({
      phone,
      avatar: '😊',
      nickname: 'Пользователь',
      username: '@user'
    });
    toast.success('Вход выполнен');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-card">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-primary">Lites</h1>
          <p className="text-muted-foreground">Чистый минималистичный мессенджер</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Номер телефона
            </label>
            <Input
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 text-base"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <Button onClick={handleLogin} className="w-full h-12 text-base" size="lg">
            Войти
            <Icon name="ArrowRight" className="ml-2" size={20} />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <button onClick={onSwitchToRegister} className="text-primary hover:underline font-medium">
              Зарегистрироваться
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
