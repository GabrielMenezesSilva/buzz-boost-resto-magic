import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendCampaignRequest {
  campaignId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend client
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { campaignId }: SendCampaignRequest = await req.json();

    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    console.log(`Processing campaign ${campaignId} for user ${user.id}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or unauthorized');
    }

    if (campaign.status !== 'draft') {
      throw new Error('Campaign is not in draft status');
    }

    // Get contacts based on campaign filters
    let contactsQuery = supabase
      .from('contacts')
      .select('id, name, phone, email')
      .eq('user_id', user.id);

    // Apply filters if any
    if (campaign.filters && Object.keys(campaign.filters).length > 0) {
      // Apply specific filters here based on the filters object
      // For now, we'll send to all contacts
    }

    const { data: contacts, error: contactsError } = await contactsQuery;

    if (contactsError) {
      throw new Error('Failed to fetch contacts');
    }

    if (!contacts || contacts.length === 0) {
      throw new Error('No contacts found for this campaign');
    }

    console.log(`Sending campaign to ${contacts.length} contacts`);

    // Update campaign status to 'sending'
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        status: 'sending',
        total_recipients: contacts.length,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      throw new Error('Failed to update campaign status');
    }

    // Create campaign sends records
    const campaignSends = contacts.map(contact => ({
      campaign_id: campaignId,
      contact_id: contact.id,
      status: 'pending'
    }));

    const { error: sendsError } = await supabase
      .from('campaign_sends')
      .insert(campaignSends);

    if (sendsError) {
      throw new Error('Failed to create campaign sends');
    }

    // Process each contact for sending
    let successfulSends = 0;
    let failedSends = 0;

    for (const contact of contacts) {
      try {
        // Send message based on campaign type
        await sendMessage(campaign.campaign_type, contact, campaign.message, resend);
        
        // Update campaign send status
        await supabase
          .from('campaign_sends')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('campaign_id', campaignId)
          .eq('contact_id', contact.id);

        successfulSends++;
        console.log(`Successfully sent to ${contact.name} (${contact.phone || contact.email})`);
      } catch (error) {
        console.error(`Failed to send to ${contact.name}:`, error);
        
        // Update campaign send status with error
        await supabase
          .from('campaign_sends')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('campaign_id', campaignId)
          .eq('contact_id', contact.id);

        failedSends++;
      }
    }

    // Update final campaign status
    const finalStatus = failedSends === 0 ? 'sent' : 'partially_sent';
    const { error: finalUpdateError } = await supabase
      .from('campaigns')
      .update({
        status: finalStatus,
        successful_sends: successfulSends,
        failed_sends: failedSends
      })
      .eq('id', campaignId);

    if (finalUpdateError) {
      console.error('Failed to update final campaign status:', finalUpdateError);
    }

    console.log(`Campaign ${campaignId} completed: ${successfulSends} successful, ${failedSends} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        totalRecipients: contacts.length,
        successfulSends,
        failedSends,
        status: finalStatus
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-campaign function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});

// Real message sending function
async function sendMessage(type: string, contact: any, message: string, resend: any) {
  console.log(`Sending ${type} message to ${contact.name}...`);
  
  switch (type) {
    case 'email':
      if (!contact.email) {
        throw new Error('Contact does not have an email address');
      }
      
      if (!resend) {
        throw new Error('Resend API key not configured');
      }
      
      try {
        const emailResponse = await resend.emails.send({
          from: 'Restaurant <onboarding@resend.dev>',
          to: [contact.email],
          subject: 'Mensagem do Restaurante',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Olá ${contact.name}!</h2>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p style="color: #666; font-size: 14px;">
                Esta mensagem foi enviada pelo seu restaurante favorito.
              </p>
            </div>
          `
        });
        
        console.log(`Email sent successfully to ${contact.email}:`, emailResponse.id);
      } catch (error) {
        console.error(`Failed to send email to ${contact.email}:`, error);
        throw new Error(`Failed to send email: ${error.message}`);
      }
      break;
      
    case 'sms':
      if (!contact.phone) {
        throw new Error('Contact does not have a phone number');
      }
      
      // SMS not implemented yet - needs Twilio integration
      throw new Error('SMS sending not yet configured. Please add Twilio API keys.');
      
    case 'whatsapp':
      if (!contact.phone) {
        throw new Error('Contact does not have a phone number');
      }
      
      // WhatsApp not implemented yet - needs Twilio/Meta integration
      throw new Error('WhatsApp sending not yet configured. Please add WhatsApp Business API keys.');
      
    default:
      throw new Error(`Unsupported message type: ${type}`);
  }
}