const twilio = require('twilio');

// Inicializar cliente Twilio
let twilioClient = null;

const initTwilio = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient;
};

// Enviar SMS
const sendSMS = async (to, message) => {
  try {
    const client = initTwilio();
    
    if (!client) {
      throw new Error('Twilio não está configurado. Verifique as variáveis de ambiente.');
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('TWILIO_PHONE_NUMBER não está configurado.');
    }

    // Formatir número se necessário
    let formattedPhone = to;
    if (!formattedPhone.startsWith('+')) {
      // Assumir Brasil se não houver código do país
      if (formattedPhone.length <= 11) {
        formattedPhone = `+55${formattedPhone}`;
      } else {
        formattedPhone = `+${formattedPhone}`;
      }
    }

    console.log(`Enviando SMS para ${formattedPhone}: ${message.substring(0, 50)}...`);

    const twilioMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`SMS enviado com sucesso. SID: ${twilioMessage.sid}`);

    // Calcular custo aproximado (Twilio Brasil ~R$ 0.10 por SMS)
    const estimatedCost = 0.10;

    return {
      success: true,
      messageId: twilioMessage.sid,
      status: twilioMessage.status,
      cost: estimatedCost,
      data: {
        sid: twilioMessage.sid,
        status: twilioMessage.status,
        to: twilioMessage.to,
        from: twilioMessage.from,
        dateCreated: twilioMessage.dateCreated
      }
    };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
};

// Verificar status de SMS
const getSMSStatus = async (messageId) => {
  try {
    const client = initTwilio();
    
    if (!client) {
      throw new Error('Twilio não está configurado.');
    }

    const message = await client.messages(messageId).fetch();

    return {
      success: true,
      data: {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        dateUpdated: message.dateUpdated,
        price: message.price,
        priceUnit: message.priceUnit,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      }
    };
  } catch (error) {
    console.error('Erro ao verificar status do SMS:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Validar número de telefone
const validatePhoneNumber = (phone) => {
  // Regex básica para validar números internacionais
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Formatar número para padrão internacional
const formatPhoneNumber = (phone, countryCode = '55') => {
  // Remove espaços e caracteres especiais
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Se não tem +, adiciona o código do país
  if (!cleaned.startsWith('+')) {
    cleaned = `+${countryCode}${cleaned}`;
  }
  
  return cleaned;
};

// Estimar custo de SMS
const estimateSMSCost = (message, country = 'BR') => {
  const messageLenght = message.length;
  const segments = Math.ceil(messageLenght / 160); // SMS padrão = 160 caracteres
  
  // Custos aproximados por país (em CHF)
  const costs = {
    BR: 0.08, // Brasil
    US: 0.075, // Estados Unidos
    CH: 0.12, // Suíça
    DEFAULT: 0.10
  };
  
  const costPerSegment = costs[country] || costs.DEFAULT;
  return segments * costPerSegment;
};

// Verificar se Twilio está configurado
const isTwilioConfigured = () => {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
};

module.exports = {
  sendSMS,
  getSMSStatus,
  validatePhoneNumber,
  formatPhoneNumber,
  estimateSMSCost,
  isTwilioConfigured
};