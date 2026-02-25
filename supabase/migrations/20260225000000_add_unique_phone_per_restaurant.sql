-- Adiciona restrição de unicidade para o telefone de um contato dentro do mesmo restaurante
ALTER TABLE contacts ADD CONSTRAINT unique_phone_per_restaurant UNIQUE (user_id, phone);
