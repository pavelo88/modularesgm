'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating commercial product descriptions using AI.
 *
 * - generateProductDescription - A function that handles the generation of product descriptions.
 * - AdminProductDescriptionDraftingInput - The input type for the generateProductDescription function.
 * - AdminProductDescriptionDraftingOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminProductDescriptionDraftingInputSchema = z.object({
  productId: z
    .string()
    .describe('The ID of the product for which to generate a description.'),
  productTitle: z
    .string()
    .describe('The title of the product.'),
  productCategory: z
    .string()
    .describe('The category of the product.'),
});
export type AdminProductDescriptionDraftingInput = z.infer<typeof AdminProductDescriptionDraftingInputSchema>;

const AdminProductDescriptionDraftingOutputSchema = z.object({
  description: z.string().describe('The generated commercial product description.'),
});
export type AdminProductDescriptionDraftingOutput = z.infer<typeof AdminProductDescriptionDraftingOutputSchema>;

export async function generateProductDescription(
  input: AdminProductDescriptionDraftingInput
): Promise<AdminProductDescriptionDraftingOutput> {
  return adminProductDescriptionDraftingFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: AdminProductDescriptionDraftingInputSchema},
  output: {schema: AdminProductDescriptionDraftingOutputSchema},
  prompt: `You are an expert e-commerce copywriter for Modulares GM, specializing in furniture and home decor.
Your task is to write a commercial and appealing description for a product.
The description should be concise (maximum 25 words) and highlight the product's utility or materials. Do not include markdown formatting.

Product Title: {{{productTitle}}}
Product Category: {{{productCategory}}}`,
});

const adminProductDescriptionDraftingFlow = ai.defineFlow(
  {
    name: 'adminProductDescriptionDraftingFlow',
    inputSchema: AdminProductDescriptionDraftingInputSchema,
    outputSchema: AdminProductDescriptionDraftingOutputSchema,
  },
  async (input) => {
    const {output} = await productDescriptionPrompt(input);
    return output!;
  }
);
