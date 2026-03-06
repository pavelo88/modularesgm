'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized order update emails for customers.
 *
 * - generateAdminOrderEmail - A function that handles the generation of an order update email.
 * - AdminOrderEmailGenerationInput - The input type for the generateAdminOrderEmail function.
 * - AdminOrderEmailGenerationOutput - The return type for the generateAdminOrderEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminOrderEmailGenerationInputSchema = z.object({
  orderName: z.string().describe("The customer's name."),
  orderStatus: z.string().describe("The current status of the order (e.g., 'Pendiente', 'En proceso', 'Enviado', 'Completado')."),
  orderTotal: z.number().describe('The total cost of the order.'),
});
export type AdminOrderEmailGenerationInput = z.infer<typeof AdminOrderEmailGenerationInputSchema>;

const AdminOrderEmailGenerationOutputSchema = z
  .string()
  .describe('The generated formal email body for the order update.');
export type AdminOrderEmailGenerationOutput = z.infer<typeof AdminOrderEmailGenerationOutputSchema>;

export async function generateAdminOrderEmail(
  input: AdminOrderEmailGenerationInput
): Promise<AdminOrderEmailGenerationOutput> {
  return adminOrderEmailGenerationFlow(input);
}

const generateAdminOrderEmailPrompt = ai.definePrompt({
  name: 'generateAdminOrderEmailPrompt',
  input: {schema: AdminOrderEmailGenerationInputSchema},
  output: {schema: AdminOrderEmailGenerationOutputSchema},
  prompt: `Redacta un correo electrónico corto, formal y muy amable para el cliente "{{{orderName}}}".

Motivo: Actualización del estado de su pedido.
Nuevo Estado: "{{{orderStatus}}}"
Total del pedido: $ {{{orderTotal}}}

Mantén un tono corporativo firmando como "Servicio al Cliente de Modulares GM". Genera solo el cuerpo del correo.`,
});

const adminOrderEmailGenerationFlow = ai.defineFlow(
  {
    name: 'adminOrderEmailGenerationFlow',
    inputSchema: AdminOrderEmailGenerationInputSchema,
    outputSchema: AdminOrderEmailGenerationOutputSchema,
  },
  async input => {
    const {output} = await generateAdminOrderEmailPrompt(input);
    return output!;
  }
);
