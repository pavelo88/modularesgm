#!/usr/bin/env node
/**
 * Auditor SEO de Modulares GM (sin dependencias, solo Node >= 18).
 *
 * Qué hace: parte del sitemap + la home, rastrea los enlaces internos, y revisa
 * lo que Google ve en la primera pasada (HTML crudo, sin ejecutar JavaScript).
 *
 * Uso:
 *   npm run seo-audit                              # contra producción
 *   npm run seo-audit -- --base http://localhost:9002   # contra el dev server
 *   npm run seo-audit -- --max 800 --no-fail            # más URLs / nunca falla
 *
 * Salida: resumen en consola + seo-reports/latest.md y seo-reports/latest.csv
 * Código de salida: 1 si hay incidencias con severidad 'error' (ver severityOf).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ───────────────────────────── Configuración ──────────────────────────────
const args = parseArgs(process.argv.slice(2));
const BASE = String(args.base || 'https://www.modularesgm.com').replace(/\/+$/, '');
const ORIGIN = new URL(BASE).origin;
const MAX_URLS = Number(args.max || 400);
const CONCURRENCY = Number(args.concurrency || 6);
const TIMEOUT_MS = 30_000;
const UA = 'ModularesGM-SEO-Audit/1.0';
const OUT_DIR = resolve(process.cwd(), args.out || 'seo-reports');

const THIN_WORDS = 300;
const TITLE_MAX = 60;
const DESC_MAX = 160;
const SKIP_EXT = /\.(webp|png|jpe?g|gif|svg|ico|avif|css|js|mjs|json|xml|txt|pdf|woff2?|ttf|mp4|webm|map)(\?|$)/i;

// ──────────────────────────── Catálogo de reglas ──────────────────────────
const ISSUES = {
  SITEMAP_NOT_200: 'URL del sitemap que no responde 200 (redirige o falla)',
  NOINDEX_IN_SITEMAP: 'URL del sitemap con noindex',
  ORPHAN: 'URL del sitemap sin ningún enlace interno que llegue a ella',
  NOT_IN_SITEMAP: 'Página indexable encontrada al rastrear pero ausente del sitemap',
  REDIRECT_TEMPORARY: 'Redirección temporal (302/307) en vez de permanente (301/308)',
  REDIRECT_CHAIN: 'Cadena de redirecciones (más de un salto)',
  BROKEN_LINK: 'Enlace interno que responde 4xx/5xx o no carga',
  APEX_REDIRECT_TEMPORARY: 'El dominio sin www redirige con 302/307',
  APEX_NO_REDIRECT: 'El dominio sin www no redirige al canónico',
  TITLE_MISSING: 'Sin <title>',
  TITLE_LONG: `<title> de más de ${TITLE_MAX} caracteres`,
  TITLE_DUPLICATE: '<title> repetido en otra URL indexable',
  META_MISSING: 'Sin meta description',
  META_LONG: `Meta description de más de ${DESC_MAX} caracteres`,
  META_DUPLICATE: 'Meta description repetida en otra URL indexable',
  H1_MISSING: 'Sin <h1> en el HTML inicial',
  H1_MULTIPLE: 'Más de un <h1>',
  CANONICAL_MISSING: 'Sin canonical',
  CANONICAL_NOT_SELF: 'Canonical apunta a otra URL',
  THIN_CONTENT: `Menos de ${THIN_WORDS} palabras en el HTML inicial`,
  IMG_NO_ALT: 'Imágenes sin atributo alt',
};

/**
 * Política del "gate": qué incidencias hacen fallar el script (y por tanto el commit).
 *  - 'error' → exit 1, bloquea.
 *  - 'warn'  → se reporta, no bloquea.
 *  - 'info'  → solo aparece en el informe.
 */
function severityOf(code) {
  // TODO(human): decide qué incidencias bloquean un commit ('error') y cuáles solo avisan ('warn').
  // Criterio sugerido: 'error' si perjudica la indexación directa (sitemap roto, noindex en
  // sitemap, enlaces rotos, canonical mal, H1 ausente); 'warn' para calidad (títulos largos,
  // contenido delgado, alt faltante). Ajusta la tabla DEFAULT_SEVERITY o reescribe la lógica.
  return DEFAULT_SEVERITY[code] ?? 'warn';
}

const DEFAULT_SEVERITY = {
  SITEMAP_NOT_200: 'error',
  NOINDEX_IN_SITEMAP: 'error',
  BROKEN_LINK: 'error',
  H1_MISSING: 'warn',
  CANONICAL_NOT_SELF: 'warn',
};

// ─────────────────────────────── Utilidades ───────────────────────────────
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

function normalize(u) {
  try {
    const url = new URL(u, BASE + '/');
    url.hash = '';
    let s = url.toString();
    if (url.pathname !== '/' && s.endsWith('/') && !url.search) s = s.slice(0, -1);
    return s;
  } catch { return null; }
}

const isInternal = (u) => { try { return new URL(u).origin === ORIGIN; } catch { return false; } };

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3] ?? '') : null;
}

async function get(url, { wantBody = true } = {}) {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': UA, accept: 'text/html,application/xml;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const type = res.headers.get('content-type') || '';
    let body = '';
    if (wantBody && res.status === 200 && /html|xml|text/i.test(type)) body = await res.text();
    else await res.arrayBuffer().catch(() => {});
    return { status: res.status, location: res.headers.get('location'), type, body };
  } catch (err) {
    return { status: 0, location: null, type: '', body: '', error: String(err?.message || err) };
  }
}

// ─────────────────────────── Extracción de datos ──────────────────────────
function analyseHtml(html) {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]);

  let description = '', canonical = '', robots = '';
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const name = (attr(tag, 'name') || '').toLowerCase();
    if (name === 'description') description = decode(attr(tag, 'content') || '');
    if (name === 'robots') robots = (attr(tag, 'content') || '').toLowerCase();
  }
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    if ((attr(tag, 'rel') || '').toLowerCase() === 'canonical') canonical = attr(tag, 'href') || '';
  }

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const h1 = decode(((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1]).replace(/<[^>]+>/g, ' '));

  const text = html
    .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const words = decode(text).split(' ').filter((w) => /\p{L}|\p{N}/u.test(w)).length;

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgNoAlt = imgs.filter((t) => attr(t, 'alt') === null).length;

  const links = new Set();
  for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attr(tag, 'href');
    if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    const abs = normalize(href);
    if (abs && isInternal(abs) && !SKIP_EXT.test(abs) && !abs.includes('/_next/')) links.add(abs);
  }

  return { title, description, canonical, robots, h1Count, h1, words, imgNoAlt, links: [...links] };
}

// ─────────────────────────────── Rastreo ──────────────────────────────────
async function loadRobots() {
  const r = await get(`${ORIGIN}/robots.txt`);
  const disallow = [];
  let applies = false;
  for (const raw of r.body.split(/\r?\n/)) {
    const line = raw.split('#')[0].trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const [, k, v] = [null, m[1].toLowerCase(), m[2].trim()];
    if (k === 'user-agent') applies = v === '*';
    else if (k === 'disallow' && applies && v) disallow.push(v);
  }
  return disallow;
}

async function loadSitemap() {
  const r = await get(`${ORIGIN}/sitemap.xml`);
  const urls = [...r.body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => normalize(decode(m[1])));
  return { status: r.status, urls: urls.filter(Boolean) };
}

async function crawl(seeds, disallow) {
  const pages = new Map();       // url -> registro
  const inbound = new Map();     // url -> Set(origen)
  const queue = [];
  const seen = new Set();
  const blocked = (u) => disallow.some((d) => new URL(u).pathname.startsWith(d));

  const push = (u, from) => {
    if (from) {
      if (!inbound.has(u)) inbound.set(u, new Set());
      inbound.get(u).add(from);
    }
    if (seen.has(u) || seen.size >= MAX_URLS) return;
    seen.add(u);
    queue.push(u);
  };
  seeds.forEach((u) => push(u, null));

  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      if (blocked(url)) { pages.set(url, { url, status: 'blocked' }); continue; }
      const res = await get(url);
      const rec = { url, status: res.status, location: res.location, type: res.type, error: res.error };
      if (res.status === 200 && /html/i.test(res.type)) {
        Object.assign(rec, analyseHtml(res.body));
        rec.links.forEach((l) => push(l, url));
      }
      pages.set(url, rec);
    }
  }
  // Los workers terminan cuando la cola se vacía; relanzamos hasta que no entren más URLs.
  while (queue.length) await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return { pages, inbound };
}

// ─────────────────────────────── Análisis ─────────────────────────────────
function audit({ pages, inbound }, sitemapUrls, apex) {
  const found = []; // {code, url, detail}
  const add = (code, url, detail = '') => found.push({ code, url, detail });
  const inSitemap = new Set(sitemapUrls);

  if (apex) {
    if (apex.status === 302 || apex.status === 307) add('APEX_REDIRECT_TEMPORARY', apex.url, `${apex.status} → ${apex.location}`);
    else if (apex.status === 200) add('APEX_NO_REDIRECT', apex.url, 'responde 200 sin redirigir');
  }

  const titles = new Map(), descs = new Map();

  for (const p of pages.values()) {
    if (p.status === 'blocked') continue;
    const sitemapped = inSitemap.has(p.url);

    if (p.status >= 300 && p.status < 400) {
      if (p.status === 302 || p.status === 307) add('REDIRECT_TEMPORARY', p.url, `${p.status} → ${p.location}`);
      if (sitemapped) add('SITEMAP_NOT_200', p.url, `${p.status} → ${p.location}`);
      const target = p.location && normalize(p.location);
      const hop = target && pages.get(target);
      if (hop && typeof hop.status === 'number' && hop.status >= 300 && hop.status < 400) add('REDIRECT_CHAIN', p.url, `${p.url} → ${target} → ${hop.location}`);
      continue;
    }
    if (p.status !== 200) {
      const from = [...(inbound.get(p.url) || [])].slice(0, 3).join(', ');
      if (sitemapped) add('SITEMAP_NOT_200', p.url, `status ${p.status}`);
      add('BROKEN_LINK', p.url, `status ${p.status}${from ? ` · enlazada desde ${from}` : ''}`);
      continue;
    }
    if (!/html/i.test(p.type || '')) continue;

    const noindex = /noindex/.test(p.robots || '');
    const selfCanonical = p.canonical && normalize(p.canonical) === p.url;
    const canonicalised = p.canonical && !selfCanonical; // variante (?filtro) apuntando al canónico
    const indexable = !noindex && !canonicalised;

    if (noindex && sitemapped) add('NOINDEX_IN_SITEMAP', p.url);
    if (sitemapped && !(inbound.get(p.url)?.size)) add('ORPHAN', p.url);
    if (indexable && !sitemapped && !new URL(p.url).search) add('NOT_IN_SITEMAP', p.url);

    if (noindex) continue; // el resto de reglas solo aplica a páginas que quieres posicionar

    if (!p.canonical) add('CANONICAL_MISSING', p.url);
    else if (canonicalised && sitemapped) add('CANONICAL_NOT_SELF', p.url, `→ ${p.canonical}`);

    if (!indexable) continue; // variantes canonicalizadas: no evaluamos contenido

    if (!p.title) add('TITLE_MISSING', p.url);
    else {
      if (p.title.length > TITLE_MAX) add('TITLE_LONG', p.url, `${p.title.length} car.: "${p.title}"`);
      titles.set(p.title, [...(titles.get(p.title) || []), p.url]);
    }
    if (!p.description) add('META_MISSING', p.url);
    else {
      if (p.description.length > DESC_MAX) add('META_LONG', p.url, `${p.description.length} car.`);
      descs.set(p.description, [...(descs.get(p.description) || []), p.url]);
    }
    if (p.h1Count === 0) add('H1_MISSING', p.url);
    if (p.h1Count > 1) add('H1_MULTIPLE', p.url, `${p.h1Count} h1`);
    if (p.words < THIN_WORDS) add('THIN_CONTENT', p.url, `${p.words} palabras`);
    if (p.imgNoAlt) add('IMG_NO_ALT', p.url, `${p.imgNoAlt} imágenes`);
  }

  for (const [t, urls] of titles) if (urls.length > 1) urls.forEach((u) => add('TITLE_DUPLICATE', u, `"${t}" (${urls.length} URLs)`));
  for (const [d, urls] of descs) if (urls.length > 1) urls.forEach((u) => add('META_DUPLICATE', u, `${urls.length} URLs`));

  return found;
}

// ─────────────────────────────── Informes ─────────────────────────────────
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

function writeReports(pages, found, meta) {
  mkdirSync(OUT_DIR, { recursive: true });

  const header = ['url', 'status', 'redirect', 'indexable', 'title', 'h1', 'canonical', 'words', 'img_sin_alt'];
  const rows = [...pages.values()].map((p) => [
    p.url, p.status, p.location || '', /noindex/.test(p.robots || '') ? 'noindex' : '',
    p.title || '', p.h1 || '', p.canonical || '', p.words ?? '', p.imgNoAlt ?? '',
  ]);
  writeFileSync(resolve(OUT_DIR, 'latest.csv'), '﻿' + [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n'));

  const byCode = new Map();
  found.forEach((f) => byCode.set(f.code, [...(byCode.get(f.code) || []), f]));
  const order = { error: 0, warn: 1, info: 2 };
  const codes = [...byCode.keys()].sort((a, b) => order[severityOf(a)] - order[severityOf(b)] || a.localeCompare(b));

  let md = `# Auditoría SEO · ${meta.base}\n\n`;
  md += `_${new Date().toISOString()}_ · ${pages.size} URLs rastreadas · ${meta.errors} errores · ${meta.warns} avisos\n\n`;
  if (!codes.length) md += 'Sin incidencias. ✅\n';
  for (const code of codes) {
    const list = byCode.get(code);
    md += `## [${severityOf(code).toUpperCase()}] ${code} (${list.length})\n${ISSUES[code]}\n\n`;
    list.forEach((f) => { md += `- ${f.url}${f.detail ? ` — ${f.detail}` : ''}\n`; });
    md += '\n';
  }
  writeFileSync(resolve(OUT_DIR, 'latest.md'), md);
}

// ──────────────────────────────── Main ────────────────────────────────────
async function main() {
  console.log(`Auditando ${BASE} (máx. ${MAX_URLS} URLs)…`);
  const [disallow, sitemap] = await Promise.all([loadRobots(), loadSitemap()]);
  if (sitemap.status !== 200 || !sitemap.urls.length) {
    console.error(`✖ No pude leer ${ORIGIN}/sitemap.xml (status ${sitemap.status}).`);
    process.exit(2);
  }

  const seeds = [...new Set([normalize(BASE + '/'), ...sitemap.urls.filter(isInternal)])];
  const crawled = await crawl(seeds, disallow);

  let apex = null;
  const host = new URL(BASE).hostname;
  if (host.startsWith('www.') && !/^(localhost|127\.)/.test(host)) {
    const url = `${new URL(BASE).protocol}//${host.slice(4)}/`;
    const r = await get(url, { wantBody: false });
    apex = { url, status: r.status, location: r.location };
  }

  const found = audit(crawled, sitemap.urls, apex);
  const count = (lvl) => found.filter((f) => severityOf(f.code) === lvl).length;
  const meta = { base: BASE, errors: count('error'), warns: count('warn') };
  writeReports(crawled.pages, found, meta);

  const codes = [...new Set(found.map((f) => f.code))];
  console.log(`\n${crawled.pages.size} URLs rastreadas · sitemap: ${sitemap.urls.length} URLs`);
  if (!codes.length) console.log('✔ Sin incidencias.');
  for (const code of codes) {
    const n = found.filter((f) => f.code === code).length;
    const icon = { error: '✖', warn: '▲', info: '·' }[severityOf(code)];
    console.log(`  ${icon} ${code.padEnd(26)} ${String(n).padStart(3)}  ${ISSUES[code]}`);
  }
  console.log(`\nInforme: ${resolve(OUT_DIR, 'latest.md')}`);
  console.log(`${meta.errors} errores, ${meta.warns} avisos.`);

  if (meta.errors > 0 && !args['no-fail']) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(2); });
