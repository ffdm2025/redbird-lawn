// workers/ghl-proxy/index.ts
// Cloudflare Worker — CORS proxy for GHL inbound webhook
// Deploy via: npx wrangler deploy workers/ghl-proxy/index.ts --name ghl-proxy
// Only needed if GHL webhook URL does NOT respond to CORS preflight from browser
// If deployed, set PUBLIC_GHL_WEBHOOK_URL to the Worker URL (*.workers.dev) instead of the GHL URL

const GHL_WEBHOOK_URL = 'REPLACE_WITH_GHL_WEBHOOK_URL'; // set before deploy

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://redbirdlawnservice.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const body = await request.text();
    const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return new Response(await ghlResponse.text(), {
      status: ghlResponse.status,
      headers: CORS_HEADERS,
    });
  },
};
