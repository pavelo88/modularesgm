'use server';
/**
 * @fileOverview A Genkit flow for a public-facing AI chatbot for Modulares GM.
 *
 * - publicAIChatbot - A function that handles user queries for the chatbot.
 * - PublicAIChatbotInput - The input type for the publicAIChatbot function.
 * - PublicAIChatbotOutput - The return type for the publicAIChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PublicAIChatbotInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
  servicesContext: z
    .string()
    .describe('A comma-separated list of available services, e.g., "Diseño de Cocinas, Topes de Cuarzo".'),
  productsContext: z
    .string()
    .describe('A comma-separated list of available products with their prices, e.g., "Cocina Modular ($250), Isla de Cocina ($950)".'),
});
export type PublicAIChatbotInput = z.infer<typeof PublicAIChatbotInputSchema>;

const PublicAIChatbotOutputSchema = z.object({
  botResponse: z.string().describe('The chatbot\'s response to the user query.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  return publicAIChatbotFlow(input);
}

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: { schema: PublicAIChatbotInputSchema },
  output: { schema: PublicAIChatbotOutputSchema },
  system: 'Eres el ✨ Asistente Virtual Inteligente de MODULARES GM, expertos en cocinas, clósets, cuarzo y muebles en Ecuador.',
  prompt: `Usuario: "{{{userMessage}}}"

Responde como asistente de Modulares GM. Conciso, amable (max 2 párrafos). Menciona que la visita técnica tiene un costo de $20 que es descontable del anticipo.
Servicios que ofrece la empresa: {{{servicesContext}}}.
Productos en tienda: {{{productsContext}}}`,
});

const publicAIChatbotFlow = ai.defineFlow(
  {
    name: 'publicAIChatbotFlow',
    inputSchema: PublicAIChatbotInputSchema,
    outputSchema: PublicAIChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await publicAIChatbotPrompt(input);
    return output!;
  },
);
