-- Insert professional marketing templates for restaurants
INSERT INTO public.campaign_templates (name, message, category, variables, user_id) 
SELECT 
  name,
  message,
  category,
  variables,
  '00000000-0000-0000-0000-000000000000'::uuid as user_id
FROM (VALUES 
  (
    'Urgência - Última Chance',
    '🔥 ÚLTIMA CHANCE {{nome}}! Apenas {{horas}} horas restantes para nossa oferta exclusiva: {{oferta}}. Reserve já pelo {{telefone}} - Vagas limitadas! ⏰',
    'promotion',
    '["nome", "horas", "oferta", "telefone"]'::jsonb
  ),
  (
    'VIP - Oferta Exclusiva',
    '✨ {{nome}}, você foi selecionado(a) para nossa oferta VIP exclusiva! {{descricao}} válida apenas para nossos clientes especiais até {{data}}. {{telefone}} 👑',
    'special_offer',
    '["nome", "descricao", "data", "telefone"]'::jsonb
  ),
  (
    'Storytelling - Tradição Familiar',
    'Olá {{nome}}! 👨‍🍳 Há {{anos}} anos nossa família prepara o melhor {{prato_especialidade}} da região. Hoje temos uma surpresa especial: {{oferta}}. Venha fazer parte da nossa história! {{telefone}}',
    'general',
    '["nome", "anos", "prato_especialidade", "oferta", "telefone"]'::jsonb
  ),
  (
    'Social Proof - Validação',
    '⭐ {{nome}}, mais de {{numero_clientes}} clientes já aprovaram! "{{depoimento}}" - Cliente satisfeito. Experimente você também: {{oferta}} até {{data}}. {{telefone}}',
    'feedback',
    '["nome", "numero_clientes", "depoimento", "oferta", "data", "telefone"]'::jsonb
  ),
  (
    'Aniversário - Personalizado',
    '🎉 Parabéns {{nome}}! É seu aniversário e preparamos algo especial: {{oferta_aniversario}}! Válido por {{dias}} dias. Celebre conosco: {{telefone}} 🎂',
    'welcome',
    '["nome", "oferta_aniversario", "dias", "telefone"]'::jsonb
  ),
  (
    'FOMO - Edição Limitada',
    '🚨 {{nome}}, ALERTA! Nosso famoso {{prato}} edição limitada está acabando! Apenas {{quantidade}} porções restantes hoje. Reserve: {{telefone}} antes que acabe! ⚡',
    'promotion',
    '["nome", "prato", "quantidade", "telefone"]'::jsonb
  ),
  (
    'Reciprocidade - Degustação Grátis',
    'Olá {{nome}}! 🎁 Queremos que você conheça nosso novo {{prato}}. Venha para uma degustação GRATUITA até {{data}}. Sem compromisso, só queremos sua opinião! {{telefone}}',
    'event',
    '["nome", "prato", "data", "telefone"]'::jsonb
  )
) AS templates(name, message, category, variables);

-- Create a function to copy default templates to new users
CREATE OR REPLACE FUNCTION copy_default_templates_to_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.campaign_templates (name, message, category, variables, user_id)
  SELECT 
    name,
    message, 
    category,
    variables,
    target_user_id
  FROM public.campaign_templates 
  WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;
END;
$$;