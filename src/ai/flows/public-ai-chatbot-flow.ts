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
  userMessage: z.string().describe('El mensaje actual del usuario.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('Historial de la conversación para mantener el contexto.'),
  servicesContext: z.string().describe('Servicios disponibles.'),
  productsContext: z.string().describe('Productos y precios.'),
});

const PublicAIChatbotOutputSchema = z.object({
  botResponse: z.string().describe('La respuesta del bot.'),
  extractedLead: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    project: z.string().optional(),
    appointmentDate: z.string().optional(),
    address: z.string().optional()
  }).optional().describe('Información del lead detectada en la charla.')
});

export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  return publicAIChatbotFlow(input);
}

const publicAIChatbotPrompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: { schema: PublicAIChatbotInputSchema },
  output: { schema: PublicAIChatbotOutputSchema },
  system: `Eres el ✨ Asistente de Ventas de MODULARES GM en Ecuador. Tu única misión es VENDER y CAPTURAR LEADS.
  
  REGLAS DE ORO:
  1. Si un cliente muestra interés, DEBES pedirle su Nombre y Teléfono. Sin eso no hay asesoría.
  2. Si agendan una cita, DEBES confirmar la fecha, hora y dirección.
  3. Sé profesional pero muy enfocado al cierre. No des información infinita sin pedir algo a cambio (datos de contacto).
  4. Si detectas Nombre, Teléfono o Proyecto, llena el objeto 'extractedLead'.`,
  prompt: `
  Contexto de Servicios: {{{servicesContext}}}
  Contexto de Productos: {{{productsContext}}}
  
  Historial: {{#each history}} {{role}}: {{content}} {{/each}}
  Usuario: "{{{userMessage}}}"
  
  Responde al usuario y extrae información si está presente.`,
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
