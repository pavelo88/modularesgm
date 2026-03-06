'use server';
/**
 * @fileOverview An AI agent for generating SEO meta tags based on website content.
 *
 * - generateAdminSEO - A function that generates SEO title, description, and keywords.
 * - AdminSEOGenerationInput - The input type for the generateAdminSEO function.
 * - AdminSEOGenerationOutput - The return type for the generateAdminSEO function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminSEOGenerationInputSchema = z.object({
  heroTitle: z.string().describe('The main title of the hero section.'),
  heroSubtitle: z
    .string()
    .describe('The subtitle or descriptive text of the hero section.'),
});
export type AdminSEOGenerationInput = z.infer<
  typeof AdminSEOGenerationInputSchema
>;

const AdminSEOGenerationOutputSchema = z.object({
  title: z
    .string()
    .max(60)
    .describe('Optimized SEO title (max 60 characters).'),
  description: z
    .string()
    .max(160)
    .describe('Optimized SEO meta description (max 160 characters).'),
  keywords: z.string().describe('Comma-separated SEO keywords.'),
});
export type AdminSEOGenerationOutput = z.infer<
  typeof AdminSEOGenerationOutputSchema
>;

export async function generateAdminSEO(
  input: AdminSEOGenerationInput
): Promise<AdminSEOGenerationOutput> {
  return adminSEOGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminSEOGenerationPrompt',
  input: {schema: AdminSEOGenerationInputSchema},
  output: {schema: AdminSEOGenerationOutputSchema},
  prompt: `Actúa como un Experto SEO para Modulares GM. Tu tarea es generar un título, una descripción y palabras clave de SEO altamente optimizados para una página web, basándote en el contenido de su sección hero.

Utiliza la siguiente información:

Título del Hero: "{{{heroTitle}}}"
Subtítulo del Hero: "{{{heroSubtitle}}}"

Genera la salida como un objeto JSON con las siguientes claves: "title" (título SEO, máximo 60 caracteres), "description" (meta descripción SEO, máximo 160 caracteres) y "keywords" (palabras clave SEO separadas por comas). Asegúrate de que el JSON esté limpio, sin bloques de código markdown ni ningún otro texto adicional.
`,
});

const adminSEOGenerationFlow = ai.defineFlow(
  {
    name: 'adminSEOGenerationFlow',
    inputSchema: AdminSEOGenerationInputSchema,
    outputSchema: AdminSEOGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
