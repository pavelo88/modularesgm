'use client';

import { useEffect, useState, useTransition, useMemo } from 'react';
import type { Order } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { appId } from '@/lib/config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateOrderStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';

const allOrderStatuses = ['Todos', 'Pendiente', 'Pago Verificado', 'Cliente Contactado', 'En proceso', 'Enviado', 'Completado', 'Cancelado'];
const allPaymentMethods = ['Todos', 'transferencia', 'tarjeta', 'efectivo'];

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [paymentFilter, setPaymentFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [updatingStatusId, startUpdatingStatus] = useTransition();

  useEffect(() => {
    const ordersRef = collection(db, 'artifacts', appId, 'public', 'data', 'ordersGM_v3');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => statusFilter === 'Todos' || order.status === statusFilter)
      .filter(order => paymentFilter === 'Todos' || order.paymentMethod === paymentFilter)
      .filter(order =>
        searchTerm === '' ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [orders, statusFilter, paymentFilter, searchTerm]);

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
     <Card>
      <CardHeader>
        <CardTitle>Seguimiento de Órdenes</CardTitle>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por cliente, email o ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Filtrar por estado" /></SelectTrigger>
            <SelectContent>
              {allOrderStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger><SelectValue placeholder="Filtrar por pago" /></SelectTrigger>
            <SelectContent>
              {allPaymentMethods.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <AccordionItem value={order.id} key={order.id} className="border-b-0 data-[state=open]:shadow-lg rounded-lg border">
              <AccordionTrigger className="p-4 hover:no-underline text-left rounded-lg data-[state=open]:bg-muted/50">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full items-center">
                  <div className="col-span-2 md:col-span-2">
                    <p className="font-bold truncate">{order.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {order.id.slice(0, 7)}...</p>
                  </div>
                  <div className="hidden md:block">
                     <p className="text-xs text-muted-foreground">Total</p>
                     <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                   <div>
                     <p className="text-xs text-muted-foreground">Estado</p>
                     <Badge>{order.status}</Badge>
                  </div>
                   <div className="text-right">
                     <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                     <Badge variant="outline">{order.paymentMethod}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-semibold">Productos del Pedido</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-12 p-2 bg-muted/50 font-semibold text-xs text-muted-foreground uppercase">
                        <div className="col-span-6">Producto</div>
                        <div className="col-span-2 text-center">Cant.</div>
                        <div className="col-span-2 text-right">Precio</div>
                        <div className="col-span-2 text-right">Subtotal</div>
                      </div>
                      <div className="divide-y">
                        {order.items.map(item => {
                          const price = item.product.discountPrice || item.product.price;
                          return (
                            <div key={item.product.id} className="grid grid-cols-12 p-2 text-sm items-center">
                               <div className="col-span-6 font-medium">{item.product.title}</div>
                               <div className="col-span-2 text-center">{item.quantity}</div>
                               <div className="col-span-2 text-right">${price.toFixed(2)}</div>
                               <div className="col-span-2 text-right font-bold">${(price * item.quantity).toFixed(2)}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="font-semibold">Detalles del Cliente</h4>
                     <div className="text-sm p-3 rounded-lg bg-muted/50 border space-y-1">
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Teléfono:</strong> {order.phone}</p>
                        <p><strong>Dirección:</strong> {order.address}</p>
                        {order.paymentMethod === 'transferencia' && order.transferRef && (
                           <p><strong>Ref. Transf.:</strong> {order.transferRef}</p>
                        )}
                     </div>
                     <h4 className="font-semibold">Actualizar Estado</h4>
                     <Select onValueChange={(value) => handleStatusChange(order.id, value)} defaultValue={order.status}>
                      <SelectTrigger disabled={updatingStatusId}>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {allOrderStatuses.slice(1).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                     {updatingStatusId && <Loader2 className="h-4 w-4 animate-spin"/>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )) : (
            <div className="text-center text-muted-foreground py-12">
              <p>No se encontraron órdenes con los filtros seleccionados.</p>
            </div>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
