'use server';
/**
 * @fileOverview Un agente de IA para explicar fragmentos de código.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainCodeInputSchema = z.object({
  codeSnippet: z.string().describe('El fragmento de código a explicar.'),
  language: z.string().optional().describe('El lenguaje de programación.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('La explicación detallada del código.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

// Usamos concatenación para evitar que las triples comillas rompan el parser
const backticks = '```';

const explainCodePrompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: { schema: ExplainCodeInputSchema },
  output: { schema: ExplainCodeOutputSchema },
  prompt: `Eres un tutor de programación experto. Explica de forma clara y concisa el siguiente código:

Lenguaje: {{#if language}}{{{language}}}{{else}}Detectar automáticamente{{/if}}
Código:
${backticks}
{{{codeSnippet}}}
${backticks}
`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async (input) => {
    const { output } = await explainCodePrompt(input);
    return output!;
  }
);