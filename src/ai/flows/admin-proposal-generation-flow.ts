'use server';
/**
 * @fileOverview A Genkit flow for administrators to generate formal project proposals
 * based on customer lead messages.
 *
 * - generateProposal - A function that generates a project proposal using AI.
 * - GenerateProposalInput - The input type for the generateProposal function.
 * - GenerateProposalOutput - The return type for the generateProposal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProposalInputSchema = z.object({
  leadMessage: z.string().describe('The customer lead message detailing their project requirements.'),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

const GenerateProposalOutputSchema = z.string().describe('A formal project proposal including a summary, design and material suggestions, and next steps.');
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;

export async function generateProposal(input: GenerateProposalInput): Promise<GenerateProposalOutput> {
  return adminProposalGenerationFlow(input);
}

const proposalPrompt = ai.definePrompt({
  name: 'generateAdminProposalPrompt',
  input: { schema: GenerateProposalInputSchema },
  output: { schema: GenerateProposalOutputSchema },
  prompt: `Actúa como un experto en diseño de muebles modulares y construcción.

Genera una propuesta formal y profesional para el siguiente requerimiento del cliente. La propuesta debe ser concisa pero completa, e incluir:

1.  **Resumen del Proyecto**: Una breve descripción del requerimiento del cliente.
2.  **Diseño y Materiales Sugeridos**: Propuestas de diseño y los materiales (ej. melamina, cuarzo) que se podrían utilizar para el proyecto. Sé específico con ejemplos si es posible.
3.  **Siguientes Pasos**: Claros siguientes pasos para el cliente.

Requerimiento del cliente: """{{{leadMessage}}}"""`,
});

const adminProposalGenerationFlow = ai.defineFlow(
  {
    name: 'adminProposalGenerationFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async (input) => {
    const { output } = await proposalPrompt(input);
    return output!;
  }
);
