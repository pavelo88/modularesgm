'use client';

import { useEffect, useState, useTransition } from 'react';
import type { Order } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { appId } from '@/lib/config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Loader2, Mail, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOrderEmail, updateOrderStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';

const orderStatuses = ['Pendiente', 'En proceso', 'Enviado', 'Completado', 'Cancelado'];

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [generatingEmailId, startGeneratingEmail] = useTransition();
  const [updatingStatusId, startUpdatingStatus] = useTransition();

  useEffect(() => {
    const ordersRef = collection(db, 'artifacts', appId, 'public', 'data', 'ordersGM_v3');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(fetchedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = (orderId: string, status: string) => {
    startUpdatingStatus(async () => {
        const result = await updateOrderStatus(orderId, status);
        if(result.success) {
            toast({ title: 'Éxito', description: 'Estado de la orden actualizado.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  };

  const handleGenerateEmail = (order: Order) => {
    startGeneratingEmail(async () => {
        const result = await getOrderEmail(order.name, order.status, order.total);
        if(result.success && result.data) {
            setEmails(prev => ({...prev, [order.id]: result.data!}));
        } else {
            toast({ variant: 'destructive', title: 'Error de IA', description: result.error });
        }
    });
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado', description: 'El correo se ha copiado al portapapeles.' });
  }

  if (loading) {
     return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {orders.map((order) => (
        <AccordionItem value={order.id} key={order.id} className="border-b-0">
          <Card>
            <AccordionTrigger className="p-4 hover:no-underline text-left">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <span className="font-semibold">{order.name} - ${order.total.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">ID: {order.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge>{order.paymentMethod}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4 lg:col-span-2">
                    <h4 className="font-semibold">Productos</h4>
                    <div className="space-y-2">
                        {order.items.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center p-2 rounded-md border bg-muted/50 text-sm">
                                <span>{item.product.title}</span>
                                <span>x{item.quantity}</span>
                                <span>${(item.product.discountPrice || item.product.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Estado de la Orden</h4>
                  <Select onValueChange={(value) => handleStatusChange(order.id, value)} defaultValue={order.status}>
                    <SelectTrigger disabled={updatingStatusId}>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updatingStatusId && <Loader2 className="h-4 w-4 animate-spin"/>}
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => handleGenerateEmail(order)} disabled={generatingEmailId}>
                        {generatingEmailId ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Mail className="mr-2 h-4 w-4"/>}
                        Generar Email de Actualización
                    </Button>
                  </div>
                  {emails[order.id] && (
                    <div className="space-y-2">
                        <Textarea readOnly value={emails[order.id]} rows={6}/>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(emails[order.id])}><Copy className="mr-2 h-4 w-4"/> Copiar</Button>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
