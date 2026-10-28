import { MetadataRoute } from 'next';

const SEARCH_AND_AI_BOTS = [
  'Googlebot', 'Google-Extended', 'Applebot', 'GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'CCBot',
  'Googlebot-Image', 'Bingbot', 'msnbot', 'DuckDuckBot', 'YandexBot', 'Baiduspider', 'Slurp', 'BraveBot', 'Bravebot', 'OAI-SearchBot', 'Claude-SearchBot', 'Claude-User', 'Claude-Web', 'Applebot-Extended', 'Perplexity-User', 'DeepSeekBot', 'GrokBot', 'xAI-Bot', 'KimiBot', 'MoonshotBot', 'MistralAI-User', 'cohere-ai', 'YouBot', 'Meta-ExternalAgent', 'FacebookBot', 'Amazonbot', 'Bytespider', 'PhindBot', 'DuckAssistBot',
];

// Herramientas de clonacion masiva del sitio
const CLONER_BOTS = ['HTTrack', 'WebCopier', 'WebReaper', 'WebZIP', 'SiteSnagger', 'Teleport', 'TeleportPro', 'Offline Explorer', 'SiteSucker', 'Wget', 'Scrapy', 'MJ12bot', 'Cyotek WebCopy'];

const PRIVATE_PATHS = ['/admin/', '/api/', '/store/checkout/', '/afiliados/portal/', '/afiliados/acceso'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: SEARCH_AND_AI_BOTS, allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: CLONER_BOTS, disallow: '/' },
    ],
    sitemap: 'https://www.modularesgm.com/sitemap.xml',
    host: 'https://www.modularesgm.com',
  };
}
