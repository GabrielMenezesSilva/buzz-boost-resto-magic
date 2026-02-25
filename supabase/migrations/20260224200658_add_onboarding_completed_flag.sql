-- Migration: add_onboarding_completed_flag
-- Description: Adiciona as flags e colunas auxiliares do Onboarding Wizard na tabela profiles

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
