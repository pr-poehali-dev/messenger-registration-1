import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { toast } from 'sonner';

interface User {
  phone: string;
  avatar: string;
  nickname: string;
  username: string;
  isPremium?: boolean;
}

interface SettingsViewProps {
  user: User;
}

export function SettingsView({ user }: SettingsViewProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'spb'>('card');

  const handlePayment = () => {
    toast.success('Оплата выполнена успешно! Premium активирован.');
    setPaymentDialogOpen(false);
  };

  return (
    <div className="h-screen overflow-auto p-6 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Настройки</h2>
          <p className="text-muted-foreground">Управление аккаунтом и подпиской</p>
        </div>

        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Crown" size={24} className="text-amber-600" />
                <h3 className="text-xl font-bold">Lites Premium</h3>
              </div>
              <p className="text-sm text-muted-foreground">Расширенные возможности мессенджера</p>
            </div>
            {user.isPremium && (
              <Badge className="bg-amber-600 text-white">Активна</Badge>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={18} className="text-amber-600" />
              <span className="text-sm">Без рекламы</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Check" size={18} className="text-amber-600" />
              <span className="text-sm">До 10 000 участников в группах</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Check" size={18} className="text-amber-600" />
              <span className="text-sm">Эксклюзивные стикеры</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Check" size={18} className="text-amber-600" />
              <span className="text-sm">Приоритетная поддержка</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">350 ₽</p>
              <p className="text-sm text-muted-foreground">в месяц</p>
            </div>
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => setPaymentDialogOpen(true)}
              disabled={user.isPremium}
            >
              {user.isPremium ? 'Активна' : 'Оформить Premium'}
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Уведомления</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Icon name="Bell" size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Push-уведомления</p>
                  <p className="text-sm text-muted-foreground">О новых сообщениях</p>
                </div>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Icon name="Volume2" size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Звук</p>
                  <p className="text-sm text-muted-foreground">Звуковые оповещения</p>
                </div>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Конфиденциальность</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-12">
              <Icon name="Lock" className="mr-3" size={20} />
              Безопасность
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <Icon name="Shield" className="mr-3" size={20} />
              Конфиденциальность
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <Icon name="Database" className="mr-3" size={20} />
              Данные и хранилище
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Crown" size={24} className="text-amber-600" />
              Оформление Premium
            </DialogTitle>
            <DialogDescription>
              Выберите способ оплаты 350 ₽ за месяц подписки
            </DialogDescription>
          </DialogHeader>

          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'spb')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">
                <Icon name="CreditCard" size={16} className="mr-2" />
                Картой
              </TabsTrigger>
              <TabsTrigger value="spb">
                <Icon name="Smartphone" size={16} className="mr-2" />
                СБП
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Банковская карта</p>
                <div className="flex items-center gap-2">
                  <Icon name="CreditCard" size={24} />
                  <span className="font-mono">•••• •••• •••• ••••</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spb" className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Система быстрых платежей</p>
                <div className="flex items-center gap-2">
                  <Icon name="Smartphone" size={24} />
                  <span>Оплата через банковское приложение</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-4">
            <Button onClick={handlePayment} className="w-full h-12 bg-amber-600 hover:bg-amber-700">
              Оплатить 350 ₽
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Подписка продлевается автоматически
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
