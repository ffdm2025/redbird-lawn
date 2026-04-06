// workers/vapi-to-ghl/index.ts
// Cloudflare Worker — transforms VAPI post-call webhook into GHL contact format
// Deploy via: npx wrangler deploy workers/vapi-to-ghl/index.ts --name vapi-to-ghl

const GHL_WEBHOOK_URL = 'REPLACE_WITH_GHL_WEBHOOK_URL';

interface VapiCallData {
  message?: {
    type: string;
    call?: {
      customer?: {
        number?: string;
        name?: string;
      };
      transcript?: string;
      summary?: string;
    };
  };
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const data: VapiCallData = await request.json();

    // Only process end-of-call reports
    if (data.message?.type !== 'end-of-call-report') {
      return new Response('OK', { status: 200 });
    }

    const call = data.message.call;
    const phone = call?.customer?.number || '';
    const name = call?.customer?.name || 'Voice Caller';
    const nameParts = name.split(' ');

    const ghlPayload = {
      firstName: nameParts[0] || 'Voice',
      lastName: nameParts.slice(1).join(' ') || 'Caller',
      phone: phone,
      tags: ['vivian-voice'],
      customField: {
        service_requested: 'Other',
      },
    };

    const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ghlPayload),
    });

    return new Response(
      JSON.stringify({ status: 'forwarded', ghl: ghlResponse.status }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  },
};
