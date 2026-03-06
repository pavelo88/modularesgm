'use client';

import { useEffect, useState, useTransition } from 'react';
import type { Lead } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { appId } from '@/lib/config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Copy, FileText, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { getLeadAnalysis, getProposal } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [proposals, setProposals] = useState<Record<string, string>>({});

  const [analyzingId, startAnalyzing] = useTransition();
  const [generatingId, startGenerating] = useTransition();

  useEffect(() => {
    const leadsRef = collection(db, 'artifacts', appId, 'public', 'data', 'leadsGM_v3');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLeads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(fetchedLeads);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    <Accordion type="single" collapsible className="w-full space-y-4">
      {leads.map((lead) => (
        <AccordionItem value={lead.id} key={lead.id} className="border-b-0">
          <Card>
            <AccordionTrigger className="p-4 hover:no-underline text-left">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <span className="font-semibold">{lead.name}</span>
                  <span className="text-sm text-muted-foreground">{lead.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={lead.status === 'Nuevo' ? 'default' : 'secondary'}>{lead.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Mensaje del Cliente:</h4>
                  <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">{lead.message}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Análisis con IA</h4>
                      <Button size="sm" variant="outline" onClick={() => handleAnalyze(lead)} disabled={analyzingId}>
                        {analyzingId && analyses[lead.id] === undefined ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                        Analizar
                      </Button>
                    </div>
                    {analyses[lead.id] ? (
                        <div className="p-4 rounded-md border bg-muted/50 space-y-3 text-sm">
                            <p><strong>Categoría:</strong> {analyses[lead.id].category}</p>
                            <p><strong>Intención:</strong> {analyses[lead.id].intent}</p>
                            <div className="space-y-2">
                                <p className="font-semibold">Respuesta Sugerida:</p>
                                <Textarea readOnly value={analyses[lead.id].draftResponse} className="bg-background"/>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(analyses[lead.id].draftResponse)}><Copy className="mr-2 h-4 w-4"/> Copiar</Button>
                            </div>
                        </div>
                    ) : analyzingId ? (<Skeleton className="h-40 w-full"/>) : null}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Generador de Propuesta</h4>
                      <Button size="sm" variant="outline" onClick={() => handleGenerateProposal(lead)} disabled={generatingId}>
                         {generatingId && proposals[lead.id] === undefined ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>}
                        Generar
                      </Button>
                    </div>
                     {proposals[lead.id] ? (
                        <div className="p-4 rounded-md border bg-muted/50 space-y-3 text-sm">
                            <Textarea readOnly value={proposals[lead.id]} rows={8} className="bg-background"/>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(proposals[lead.id])}><Copy className="mr-2 h-4 w-4"/> Copiar Propuesta</Button>
                        </div>
                    ) : generatingId ? (<Skeleton className="h-40 w-full"/>) : null}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
