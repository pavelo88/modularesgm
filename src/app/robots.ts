import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'anthropic-ai', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot'],
        allow: '/',
      }
    ],
    sitemap: 'https://modularesgm.com/sitemap.xml',
  };
}
