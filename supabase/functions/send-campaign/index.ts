import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para enviar SMS via Twilio
async function sendSMS(to: string, message: string) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured');
  }

  // Formatar número para padrão internacional
  let formattedPhone = to;
  if (!formattedPhone.startsWith('+')) {
    // Assumir Brasil se não houver código do país
    if (formattedPhone.length <= 11) {
      formattedPhone = `+55${formattedPhone}`;
    } else {
      formattedPhone = `+${formattedPhone}`;
    }
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: formattedPhone,
      From: fromNumber,
      Body: message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Twilio error: ${errorData}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) throw new Error('Invalid authentication');

    const { campaignId } = await req.json();
    if (!campaignId) throw new Error('Campaign ID is required');

    console.log(`Starting campaign send for campaign ID: ${campaignId}`);

    // Fetch campaign and contacts
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) throw new Error('Campaign not found');

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id);
    
    if (contactsError || !contacts?.length) throw new Error('No contacts found');

    console.log(`Found ${contacts.length} contacts to send to`);

    // Update campaign status to sending
    await supabase
      .from('campaigns')
      .update({ 
        status: 'sending',
        total_recipients: contacts.length,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    let successfulSends = 0;
    let failedSends = 0;

    // Send to each contact
    for (const contact of contacts) {
      try {
        if (contact.phone) {
          // Personalizar mensagem com variáveis
          let personalizedMessage = campaign.message;
          personalizedMessage = personalizedMessage.replace(/\{nome\}/g, contact.name || 'Cliente');
          personalizedMessage = personalizedMessage.replace(/\{restaurante\}/g, contact.restaurant_name || 'Nosso Restaurante');

          console.log(`Sending SMS to ${contact.phone}: ${personalizedMessage.substring(0, 50)}...`);
          
          await sendSMS(contact.phone, personalizedMessage);
          successfulSends++;
          console.log(`SMS sent successfully to ${contact.phone}`);
        } else {
          console.log(`Contact ${contact.name} has no phone number, skipping`);
          failedSends++;
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${contact.phone}:`, error);
        failedSends++;
      }
    }

    // Update campaign with final status
    await supabase
      .from('campaigns')
      .update({ 
        status: 'sent',
        successful_sends: successfulSends,
        failed_sends: failedSends,
      })
      .eq('id', campaignId);

    console.log(`Campaign completed: ${successfulSends} successful, ${failedSends} failed`);

    return new Response(JSON.stringify({
      success: true,
      totalSent: successfulSends,
      totalFailed: failedSends,
      message: `Campanha enviada: ${successfulSends} sucesso, ${failedSends} falhas`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Campaign send error:', error);
    
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});