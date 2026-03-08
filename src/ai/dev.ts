'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/admin-lead-analysis-flow.ts';
import '@/ai/flows/admin-product-description-drafting-flow.ts';
import '@/ai/flows/admin-proposal-generation-flow.ts';
import '@/ai/flows/admin-seo-generation-flow.ts';
import '@/ai/flows/public-ai-chatbot-flow.ts';
