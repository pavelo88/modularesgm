'use server';
/**
 * @fileOverview An AI agent for analyzing customer lead messages.
 *
 * - adminLeadAnalysis - A function that analyzes a customer lead message.
 * - AdminLeadAnalysisInput - The input type for the adminLeadAnalysis function.
 * - AdminLeadAnalysisOutput - The return type for the adminLeadAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdminLeadAnalysisInputSchema = z.object({
  message: z.string().describe('The customer lead message to analyze.'),
});
export type AdminLeadAnalysisInput = z.infer<typeof AdminLeadAnalysisInputSchema>;

const AdminLeadAnalysisOutputSchema = z.object({
  category: z.string().describe('The category of the lead (e.g., "Cocinas", "Baños", "Remodelación").'),
  intent: z.string().describe('The customer\'s primary intent (e.g., "Solicitar Cotización", "Pregunta General", "Agendar Visita").'),
  draftResponse: z.string().describe('A draft response to the customer, subtly reminding them about the $20 technical visit fee that is applicable to the down payment.'),
});
export type AdminLeadAnalysisOutput = z.infer<typeof AdminLeadAnalysisOutputSchema>;

export async function adminLeadAnalysis(input: AdminLeadAnalysisInput): Promise<AdminLeadAnalysisOutput> {
  return adminLeadAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminLeadAnalysisPrompt',
  input: { schema: AdminLeadAnalysisInputSchema },
  output: { schema: AdminLeadAnalysisOutputSchema },
  system: 'You are an experienced Commercial Analyst for Modulares GM. Your task is to analyze customer lead messages.',
  prompt: 'Analiza el siguiente requerimiento del cliente y extrae la categoría, la intención, y genera un borrador de respuesta. \n\nRequerimiento: "{{{message}}}"\n\nRecuerda sutilmente en el borrador de respuesta que la visita técnica tiene un costo de $20, el cual será deducido del anticipo si se concreta el proyecto.'
});

const adminLeadAnalysisFlow = ai.defineFlow(
  {
    name: 'adminLeadAnalysisFlow',
    inputSchema: AdminLeadAnalysisInputSchema,
    outputSchema: AdminLeadAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to analyze lead message.');
    }
    return output;
  }
);
