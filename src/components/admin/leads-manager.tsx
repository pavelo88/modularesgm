'use client';

import { useEffect, useState, useTransition, useMemo } from 'react';
import type { Lead } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Copy, FileText, Loader2, Search } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { getLeadAnalysis, getProposal } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allStatuses = ['Todos', 'Nuevo', 'Contactado', 'Cerrado'];

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const { toast } = useToast();

  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [proposals, setProposals] = useState<Record<string, string>>({});

  const [analyzingId, startAnalyzing] = useTransition();
  const [generatingId, startGenerating] = useTransition();

  useEffect(() => {
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLeads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(fetchedLeads);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => statusFilter === 'Todos' || lead.status === statusFilter)
      .filter(lead => 
        searchTerm === '' ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [leads, statusFilter, searchTerm]);

  const handleAnalyze = (lead: Lead) => {
    startAnalyzing(async () => {
      const result = await getLeadAnalysis(lead.message);
      if(result.success && result.data) {
        setAnalyses(prev => ({ ...prev, [lead.id]: result.data }));
      } else {
        toast({ variant: 'destructive', title: 'Error de IA', description: result.error });
      }
    });
  };
  
  const handleGenerateProposal = (lead: Lead) => {
    startGenerating(async () => {
        const result = await getProposal(lead.message);
        if(result.success && result.data) {
            setProposals(prev => ({ ...prev, [lead.id]: result.data! }));
        } else {
            toast({ variant: 'destructive', title: 'Error de IA', description: result.error });
        }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado', description: 'El texto se ha copiado al portapapeles.' });
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
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Contactos (Leads)</CardTitle>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre, email o mensaje..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <AccordionItem value={lead.id} key={lead.id} className="border rounded-lg overflow-hidden data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="p-4 hover:no-underline text-left data-[state=open]:bg-muted/30">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                      <span className="font-semibold">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={lead.status === 'Nuevo' ? 'default' : 'secondary'}>{lead.status}</Badge>
                      <span className="text-xs text-muted-foreground hidden sm:inline-block">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-4 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Mensaje del Cliente:</h4>
                      <p className="text-sm p-4 border rounded-xl bg-muted/50 leading-relaxed">{lead.message}</p>
                      <div className="mt-2 text-[10px] text-muted-foreground flex gap-4">
                        <span><strong>Teléfono:</strong> {lead.phone}</span>
                        <span><strong>Fecha:</strong> {new Date(lead.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="font-bold text-sm flex items-center gap-2"><Bot size={16} className="text-primary"/> Análisis IA</h4>
                          <Button size="sm" variant="outline" onClick={() => handleAnalyze(lead)} disabled={analyzingId}>
                            {analyzingId && analyses[lead.id] === undefined ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Analizar Requerimiento
                          </Button>
                        </div>
                        {analyses[lead.id] ? (
                            <div className="p-4 rounded-xl border bg-primary/5 space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Categoría</p>
                                    <p className="font-medium">{analyses[lead.id].category}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Intención</p>
                                    <p className="font-medium">{analyses[lead.id].intent}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Borrador de Respuesta</p>
                                    <Textarea readOnly value={analyses[lead.id].draftResponse} className="bg-background h-24 text-xs resize-none"/>
                                    <Button size="sm" variant="secondary" className="w-full" onClick={() => copyToClipboard(analyses[lead.id].draftResponse)}>
                                      <Copy className="mr-2 h-3 w-3"/> Copiar Respuesta
                                    </Button>
                                </div>
                            </div>
                        ) : analyzingId ? (<Skeleton className="h-40 w-full rounded-xl"/>) : (
                          <p className="text-xs text-muted-foreground italic text-center py-4">Pulsa analizar para obtener sugerencias de la IA.</p>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h4 className="font-bold text-sm flex items-center gap-2"><FileText size={16} className="text-secondary"/> Propuesta Formal</h4>
                          <Button size="sm" variant="outline" onClick={() => handleGenerateProposal(lead)} disabled={generatingId}>
                             {generatingId && proposals[lead.id] === undefined ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Generar Propuesta
                          </Button>
                        </div>
                         {proposals[lead.id] ? (
                            <div className="p-4 rounded-xl border bg-secondary/5 space-y-4 text-sm">
                                <Textarea readOnly value={proposals[lead.id]} rows={8} className="bg-background text-xs resize-none"/>
                                <Button size="sm" variant="secondary" className="w-full" onClick={() => copyToClipboard(proposals[lead.id])}>
                                  <Copy className="mr-2 h-3 w-3"/> Copiar Propuesta
                                </Button>
                            </div>
                        ) : generatingId ? (<Skeleton className="h-40 w-full rounded-xl"/>) : (
                          <p className="text-xs text-muted-foreground italic text-center py-4">Genera una propuesta profesional estructurada con IA.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )) : (
              <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                <MessageSquare className="mx-auto h-12 w-12 opacity-10 mb-4" />
                <p>No se encontraron contactos con estos filtros.</p>
              </div>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
