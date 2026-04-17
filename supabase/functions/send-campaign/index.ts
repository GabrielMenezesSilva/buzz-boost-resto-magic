// @ts-nocheck — Deno/ESM imports are not resolvable in TS tooling but are valid at runtime
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface CampaignFilters {
  type: 'all' | 'by_date' | 'by_tag';
  since?: string;
  tag?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  tags: string[] | null;
  last_contact_date: string | null;
}

interface Campaign {
  id: string;
  user_id: string;
  name: string;
  message: string;
  campaign_type: 'sms' | 'whatsapp' | 'email';
  status: string;
  filters: CampaignFilters | null;
  scheduled_at: string | null;
}

// ── Phone normalisation ────────────────────────────────────────────────────────

/** Returns E.164 without leading + (as required by Meta), e.g. "41791234567" */
function toE164Digits(phone: string): string {
  const stripped = phone.replace(/[\s\-\(\)\.]/g, '');
  return stripped.startsWith('+') ? stripped.substring(1) : stripped;
}

/** Returns E.164 with leading + (as required by Twilio), e.g. "+41791234567" */
function toE164Full(phone: string): string {
  const stripped = phone.replace(/[\s\-\(\)\.]/g, '');
  return stripped.startsWith('+') ? stripped : `+${stripped}`;
}

// ── WhatsApp via Meta Cloud API ────────────────────────────────────────────────

async function sendWhatsApp(
  phone: string,
  message: string,
  token: string,
  phoneNumberId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: toE164Digits(phone),
          type: 'text',
          text: { body: message },
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      return { success: false, error: `Meta API ${response.status}: ${errBody}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── SMS via Twilio ─────────────────────────────────────────────────────────────

async function sendSms(
  phone: string,
  message: string,
  accountSid: string,
  authToken: string,
  fromNumber: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: toE164Full(phone),
          From: fromNumber,
          Body: message,
        }).toString(),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      return { success: false, error: `Twilio ${response.status}: ${errBody}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Contact filter builder ─────────────────────────────────────────────────────

function applyContactFilters(
  query: ReturnType<ReturnType<typeof createClient>['from']>,
  filters: CampaignFilters | null,
) {
  if (!filters || filters.type === 'all') return query;
  if (filters.type === 'by_date' && filters.since) {
    return query.gte('last_contact_date', filters.since);
  }
  if (filters.type === 'by_tag' && filters.tag) {
    return query.contains('tags', [filters.tag]);
  }
  return query;
}

// ── Main handler ───────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Always use service-role client (supports both manual UI calls & pg_cron scheduler)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body = await req.json() as { campaignId?: string };
    const { campaignId } = body;

    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: 'campaignId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 1. Fetch campaign (no user_id filter — service role, validated by ownership implicitly)
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single<Campaign>();

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: 'Campaign not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Guard against double-sending
    if (campaign.status === 'sent' || campaign.status === 'sending') {
      return new Response(
        JSON.stringify({ error: `Campaign already in status: ${campaign.status}` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 2. Mark as sending to block concurrent pg_cron runs
    await supabaseAdmin
      .from('campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId);

    // 3. Fetch profile for message personalisation
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('restaurant_name, owner_name')
      .eq('user_id', campaign.user_id)
      .maybeSingle();

    // 4. Fetch filtered contacts
    const filters = campaign.filters as CampaignFilters | null;

    const baseQuery = supabaseAdmin
      .from('contacts')
      .select('id, name, phone, email, tags, last_contact_date')
      .eq('user_id', campaign.user_id)
      .not('phone', 'is', null);

    const { data: contacts, error: contactsError } = await applyContactFilters(baseQuery, filters);

    if (contactsError) throw contactsError;

    const contactList = (contacts ?? []) as Contact[];

    if (contactList.length === 0) {
      await supabaseAdmin
        .from('campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          total_recipients: 0,
          successful_sends: 0,
          failed_sends: 0,
        })
        .eq('id', campaignId);

      return new Response(
        JSON.stringify({ message: 'No contacts matched filters', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 5. Read provider credentials
    const whatsappToken    = Deno.env.get('WHATSAPP_TOKEN') ?? '';
    const whatsappPhoneId  = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? '';
    const twilioSid        = Deno.env.get('TWILIO_ACCOUNT_SID') ?? '';
    const twilioAuthToken  = Deno.env.get('TWILIO_AUTH_TOKEN') ?? '';
    const twilioFrom       = Deno.env.get('TWILIO_FROM_NUMBER') ?? '';

    // 6. Send — sequential with 100 ms gap to respect rate limits
    let successfulSends = 0;
    let failedSends = 0;

    for (const contact of contactList) {
      if (!contact.phone) {
        failedSends++;
        continue;
      }

      // Personalise message: replace {nom}, {restaurant} placeholders
      const personalised = campaign.message
        .replace(/\{nom\}/gi, contact.name ?? 'Client')
        .replace(/\{restaurant\}/gi, profile?.restaurant_name ?? '');

      let result: { success: boolean; error?: string };

      if (campaign.campaign_type === 'whatsapp') {
        if (!whatsappToken || !whatsappPhoneId) {
          result = { success: false, error: 'WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID not set. Run: supabase secrets set WHATSAPP_TOKEN=xxx WHATSAPP_PHONE_NUMBER_ID=yyy' };
        } else {
          result = await sendWhatsApp(contact.phone, personalised, whatsappToken, whatsappPhoneId);
        }
      } else if (campaign.campaign_type === 'sms') {
        if (!twilioSid || !twilioAuthToken || !twilioFrom) {
          result = { success: false, error: 'Twilio credentials not set. Run: supabase secrets set TWILIO_ACCOUNT_SID=xxx TWILIO_AUTH_TOKEN=yyy TWILIO_FROM_NUMBER=zzz' };
        } else {
          result = await sendSms(contact.phone, personalised, twilioSid, twilioAuthToken, twilioFrom);
        }
      } else {
        result = { success: false, error: 'Email sending not yet implemented' };
      }

      if (result.success) {
        successfulSends++;
      } else {
        failedSends++;
        console.error(`send-campaign: failed for ${contact.phone} — ${result.error}`);
      }

      // Throttle — 100 ms between sends
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
    }

    // 7. Finalise campaign record
    await supabaseAdmin
      .from('campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        total_recipients: contactList.length,
        successful_sends: successfulSends,
        failed_sends: failedSends,
      })
      .eq('id', campaignId);

    return new Response(
      JSON.stringify({
        success: true,
        total: contactList.length,
        successful: successfulSends,
        failed: failedSends,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('send-campaign error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});