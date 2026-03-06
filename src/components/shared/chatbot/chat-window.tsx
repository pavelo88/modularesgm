'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, Download, Loader2, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage, SiteContent } from '@/lib/types';
import { handleSendChatMessage } from '@/lib/actions';

export function ChatWindow({
  siteContent,
  onClose,
}: {
  siteContent: SiteContent;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: '¡Hola! Soy el ✨ Asistente IA de MODULARES GM. ¿En qué proyecto de muebles o remodelación te puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await handleSendChatMessage(
        userMessage.text,
        siteContent
      );
      if (result.success && result.data) {
        setMessages((prev) => [...prev, { role: 'bot', text: result.data }]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error de Conexión',
          description:
            result.error ||
            'No se pudo contactar al asistente. Por favor, intenta de nuevo.',
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'Lo siento, tengo problemas de red. Por favor, escríbenos directamente a nuestro WhatsApp.',
          },
        ]);
      }
    });
  };

  return (
    <div className="bg-background rounded-2xl shadow-2xl mb-4 w-80 md:w-96 overflow-hidden border flex flex-col h-[450px] animate-in slide-in-from-bottom-5">
      <div className="bg-background/80 backdrop-blur-sm border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-primary" />
          <h3 className="font-bold text-sm">✨ Asesor Modulares GM</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto chat-scroll bg-muted/30 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <div
              className={`p-3 rounded-xl max-w-[90%] text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground font-medium rounded-br-none self-end'
                  : 'bg-card border text-card-foreground rounded-bl-none self-start'
              }`}
            >
              {msg.text.split('**').map((part, idx) =>
                idx % 2 === 1 ? <strong key={idx} className="text-primary">{part}</strong> : part
              )}
               {msg.catalogUrl && (
                <div className="mt-3 pt-3 border-t">
                  <a href={msg.catalogUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Download size={14} /> Descargar Catálogo {msg.serviceTitle}
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex justify-start">
            <div className="p-3 rounded-xl bg-card border text-muted-foreground flex items-center gap-2 text-sm rounded-bl-none shadow-sm">
              <Loader2 size={14} className="animate-spin text-primary" />
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-background border-t flex gap-2"
      >
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre tu cocina..."
          className="flex-1 bg-muted rounded-full px-4 py-2 text-sm"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-foreground text-background rounded-full shrink-0"
          disabled={isPending || !input.trim()}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
