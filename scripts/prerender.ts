/**
 * Build-time prerender script.
 * 
 * Runs after `vite build` to generate static HTML for every indexable route.
 * Also generates sitemap.xml from published data.
 *
 * Usage: node --import tsx scripts/prerender.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { fetchPublishedData } from './fetch-data.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = 'https://thepickup.co';

// Load .env manually for Node context
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

interface RouteEntry {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  lastmod?: string;
}

function buildMetaTags(route: RouteEntry): string {
  const canonical = `${BASE_URL}${route.path === '/' ? '' : route.path}`;
  const robots = route.noindex ? 'noindex,follow' : 'index,follow';
  return [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="The Pickup" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
  ].join('\n    ');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function main() {
  console.log('[prerender] Fetching published data...');
  const { records, buyers } = await fetchPublishedData();

  // Build the SSR bundle
  console.log('[prerender] Building SSR bundle...');
  await build({
    root: ROOT,
    build: {
      ssr: true,
      outDir: 'dist-ssr',
      rollupOptions: {
        input: path.join(ROOT, 'src/entry-server.tsx'),
      },
    },
    logLevel: 'warn',
  });

  // Load the SSR module
  const ssrModule = await import(path.join(ROOT, 'dist-ssr/entry-server.js'));
  const { render } = ssrModule;

  // Read the client HTML template
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

  // Build route list
  const routes: RouteEntry[] = [
    {
      path: '/',
      title: 'The Pickup \u2014 Who\u2019s Buying Entertainment Now',
      description: 'The scoreboard for who\u2019s buying entertainment now. Confirmed deals, developing signals, and buyer mandates tracked with evidence.',
    },
    {
      path: '/deals',
      title: 'Deal Board | The Pickup',
      description: 'Searchable intelligence on who\u2019s buying entertainment and what they\u2019re acquiring. Confirmed deals, developing signals, and buyer mandates.',
    },
    {
      path: '/buyers',
      title: 'Buyer Directory | The Pickup',
      description: 'Who is actively writing checks for entertainment content. Buyer profiles, mandates, confidence ratings, and linked deal records.',
    },
    {
      path: '/about',
      title: 'About The Pickup | The Pickup',
      description: 'How The Pickup tracks emerging buyers and new entertainment financing. Evidence classes, editorial standards, and who it\u2019s for.',
    },
    {
      path: '/subscribe',
      title: 'Subscribe | The Pickup',
      description: 'Get the weekly intelligence briefing on entertainment acquisitions and buyer mandates.',
      noindex: true,
    },
  ];

  // Add buyer profile routes
  for (const buyer of buyers) {
    routes.push({
      path: `/buyers/${buyer.id}`,
      title: `${buyer.name}: Mandate, Activity & Route | The Pickup`,
      description: buyer.currentMandate || buyer.description,
      lastmod: buyer.lastVerified,
    });
  }

  // Add deal record routes (only unlocked ones)
  for (const record of records) {
    if (record.locked) continue;
    routes.push({
      path: `/deals/${record.id}`,
      title: `${record.headline} | The Pickup`,
      description: record.summary,
      lastmod: record.lastVerified || record.date,
    });
  }

  console.log(`[prerender] Rendering ${routes.length} routes...`);

  for (const route of routes) {
    const appHtml = render(route.path, { records, buyers });
    const metaTags = buildMetaTags(route);

    // Replace the default title with route-specific meta tags
    let html = template
      .replace(
        '<title>The Pickup — Who\'s Buying Entertainment Now</title>',
        metaTags
      )
      .replace('<!--app-html-->', appHtml)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    // Write to dist
    const filePath = route.path === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, route.path, 'index.html');

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, html);
  }

  // Generate sitemap.xml
  const indexableRoutes = routes.filter(r => !r.noindex);
  const today = new Date().toISOString().split('T')[0];

  const sitemapEntries = indexableRoutes.map(route => {
    const loc = `${BASE_URL}${route.path === '/' ? '' : route.path}`;
    const lastmod = route.lastmod || today;
    const priority = route.path === '/' ? '1.0'
      : route.path === '/deals' || route.path === '/buyers' ? '0.8'
      : route.path === '/about' ? '0.5'
      : '0.7';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
  console.log(`[prerender] Generated sitemap.xml with ${indexableRoutes.length} URLs`);

  // Clean up SSR build
  fs.rmSync(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });

  console.log('[prerender] Done!');
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
