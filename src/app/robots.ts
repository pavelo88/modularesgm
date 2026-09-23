import { MetadataRoute } from 'next';

const SEARCH_AND_AI_BOTS = [
  'Googlebot', 'Bingbot', 'Google-Extended', 'Applebot',
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'CCBot',
];

const PRIVATE_PATHS = ['/admin/', '/api/', '/store/checkout/', '/afiliados/portal/', '/afiliados/acceso'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: SEARCH_AND_AI_BOTS, allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: 'https://www.modularesgm.com/sitemap.xml',
    host: 'https://www.modularesgm.com',
  };
}
