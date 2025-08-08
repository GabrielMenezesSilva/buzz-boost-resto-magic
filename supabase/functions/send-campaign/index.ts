import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeamento de códigos de país
const COUNTRY_CODES = {
  'BR': '55',
  'US': '1',
  'CA': '1',
  'MX': '52',
  'AR': '54',
  'CL': '56',
  'PE': '51',
  'CO': '57',
  'VE': '58',
  'UY': '598',
  'PY': '595',
  'BO': '591',
  'EC': '593',
  'GY': '592',
  'SR': '597',
  'GF': '594',
  // Adicione mais países conforme necessário
} as const;

// Função para formatar número de telefone
function formatPhoneNumber(phone: string, countryCode: string = 'BR'): string {
  // Remove todos os caracteres não numéricos
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Se já tem código do país, retorna como está (com +)
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Pega o código do país do mapeamento
  const countryDialCode = COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES];
  
  // Se não encontrar o código do país, log error e tenta usar o Brasil como fallback
  if (!countryDialCode) {
    console.error(`Country code ${countryCode} not found in mapping, using BR as fallback`);
    return `+55${cleanPhone}`;
  }
  
  // Formatação específica por país
  switch (countryCode) {
    case 'BR':
      // Para Brasil, remove o 0 inicial se existir e valida tamanho
      if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
      }
      // Brasil deve ter 10 ou 11 dígitos (celular/fixo)
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        console.error(`Invalid BR phone number length: ${cleanPhone}`);
        return null;
      }
      break;
    
    case 'US':
    case 'CA':
      // EUA e Canadá devem ter 10 dígitos
      if (cleanPhone.length !== 10) {
        console.error(`Invalid ${countryCode} phone number length: ${cleanPhone}`);
        return null;
      }
      break;
    
    case 'AR':
      // Argentina pode ter 10-11 dígitos
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        console.error(`Invalid AR phone number length: ${cleanPhone}`);
        return null;
      }
      break;
      
    default:
      // Para outros países, aceita números entre 8-15 dígitos
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        console.error(`Invalid ${countryCode} phone number length: ${cleanPhone}`);
        return null;
      }
  }
  
  // Formata no padrão E.164
  return `+${countryDialCode}${cleanPhone}`;
}

// Função para enviar SMS via Twilio
async function sendSMS(to: string, message: string, countryCode: string = 'BR') {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured');
  }

  // Formatar número para padrão internacional E.164
  const formattedPhone = formatPhoneNumber(to, countryCode);
  
  console.log(`Formatted phone: ${to} (${countryCode}) -> ${formattedPhone}`);

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
      .select('id, name, phone, email, country_code')
      .eq('user_id', user.id)
      .not('phone', 'is', null);
    
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

    // Buscar dados do perfil do usuário para personalização
    const { data: profile } = await supabase
      .from('profiles')
      .select('restaurant_name, owner_name')
      .eq('user_id', user.id)
      .single();

    // Send to each contact
    for (const contact of contacts) {
      try {
        if (contact.phone) {
          // Validar se o número pode ser formatado antes de tentar enviar
          const formattedPhone = formatPhoneNumber(contact.phone, contact.country_code || 'BR');
          
          if (!formattedPhone) {
            console.error(`Invalid phone number for contact ${contact.name}: ${contact.phone} (${contact.country_code})`);
            failedSends++;
            continue;
          }

          // Personalizar mensagem com variáveis
          let personalizedMessage = campaign.message;
          personalizedMessage = personalizedMessage.replace(/\{nome\}/g, contact.name || 'Cliente');
          personalizedMessage = personalizedMessage.replace(/\{restaurante\}/g, profile?.restaurant_name || 'Nosso Restaurante');

          console.log(`Sending SMS to ${contact.phone} (${contact.country_code || 'BR'}) -> ${formattedPhone}: ${personalizedMessage.substring(0, 50)}...`);
          
          await sendSMS(contact.phone, personalizedMessage, contact.country_code || 'BR');
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