import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function Login({ onComplete, onRegister }: { onComplete: (user: any) => void; onRegister: () => void }) {
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    if (!phone) {
      toast.error('Введите номер телефона');
      return;
    }

    try {
      const result = await api.login(phone);
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success('Вход выполнен!');
        onComplete(result.user);
      } else {
        toast.error('Пользователь не найден');
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
          <p className="text-sm text-gray-500">Вход в аккаунт</p>
        </div>

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

        <div className="space-y-2">
          <Button onClick={handleLogin} className="w-full">
            Войти
          </Button>
          <Button variant="outline" onClick={onRegister} className="w-full">
            Регистрация
          </Button>
        </div>
      </div>
    </div>
  );
}
