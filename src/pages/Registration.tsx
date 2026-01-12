import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const EMOJIS = ['😊', '😎', '🥳', '🤖', '🐱', '🐶', '🦊', '🐼', '🦁', '🐯', '🦄', '🐙', '🌟', '⚡', '🔥', '💎'];

export default function Registration({ onComplete }: { onComplete: (user: any) => void }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [avatarType, setAvatarType] = useState<'emoji' | 'photo'>('emoji');
  const [avatarValue, setAvatarValue] = useState('😊');
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');

  const handleNext = () => {
    if (step === 1 && !phone) {
      toast.error('Введите номер телефона');
      return;
    }
    if (step === 3 && (!nickname || !username)) {
      toast.error('Заполните все поля');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      const result = await api.register(phone, nickname, username, avatarType, avatarValue);
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success('Регистрация успешна!');
        onComplete(result.user);
      } else {
        toast.error('Ошибка регистрации');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lites</h1>
          <p className="text-sm text-gray-500">Шаг {step} из 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 999 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label>Выберите аватар</Label>
            <div className="flex gap-2 mb-4">
              <Button
                variant={avatarType === 'emoji' ? 'default' : 'outline'}
                onClick={() => setAvatarType('emoji')}
                className="flex-1"
              >
                Эмодзи
              </Button>
              <Button
                variant={avatarType === 'photo' ? 'default' : 'outline'}
                onClick={() => setAvatarType('photo')}
                className="flex-1"
              >
                Фото
              </Button>
            </div>

            {avatarType === 'emoji' && (
              <div className="grid grid-cols-8 gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatarValue(emoji)}
                    className={`text-3xl p-2 rounded-lg transition ${
                      avatarValue === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {avatarType === 'photo' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Загрузите фото (в разработке)</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nickname">Имя</Label>
              <Input
                id="nickname"
                placeholder="Как вас зовут?"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                className="mt-2"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Назад
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {step === 3 ? 'Завершить' : 'Далее'}
          </Button>
        </div>
      </div>
    </div>
  );
}
