import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface RegistrationProps {
  onComplete: (userData: { phone: string; avatar: string; nickname: string; username: string }) => void;
  onSwitchToLogin: () => void;
}

const EMOJI_AVATARS = ['😊', '🚀', '🎨', '🌟', '💡', '🎮', '🎭', '🎪', '🎯', '🎸', '🎺', '🎨', '🌈', '⚡', '🔥', '💎'];

export function Registration({ onComplete, onSwitchToLogin }: RegistrationProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');

  const handlePhoneSubmit = () => {
    if (phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    setStep(2);
  };

  const handleAvatarSubmit = () => {
    if (!avatar) {
      toast.error('Выберите аватар');
      return;
    }
    setStep(3);
  };

  const handleNicknameSubmit = () => {
    if (!nickname || !username) {
      toast.error('Заполните все поля');
      return;
    }
    if (username.includes(' ')) {
      toast.error('Юзернейм не должен содержать пробелы');
      return;
    }
    onComplete({ phone, avatar, nickname, username });
    toast.success('Регистрация успешна!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-card">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-primary">Lites</h1>
          <p className="text-sm text-muted-foreground">
            Шаг {step} из 3
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-16 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold mb-6">Введите номер телефона</h2>
              <Input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>
            <Button onClick={handlePhoneSubmit} className="w-full h-12 text-base" size="lg">
              Продолжить
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
                Войти
              </button>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold mb-6">Выберите аватар</h2>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {EMOJI_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all hover:scale-110 ${
                      avatar === emoji 
                        ? 'bg-primary/10 ring-2 ring-primary scale-110' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 h-12">
                <Icon name="ArrowLeft" className="mr-2" size={20} />
                Назад
              </Button>
              <Button onClick={handleAvatarSubmit} className="flex-1 h-12">
                Продолжить
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24 text-5xl bg-primary/10">
                <AvatarFallback className="text-5xl bg-transparent">{avatar}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-6">Представьтесь</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Никнейм
                  </label>
                  <Input
                    placeholder="Иван Иванов"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Юзернейм
                  </label>
                  <Input
                    placeholder="@ivan_ivanov"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1 h-12">
                <Icon name="ArrowLeft" className="mr-2" size={20} />
                Назад
              </Button>
              <Button onClick={handleNicknameSubmit} className="flex-1 h-12">
                Готово
                <Icon name="Check" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
