-- Função RPC segura para verificação de PIN de funcionário no backend
-- Nunca expõe o PIN ao client — apenas retorna true/false
CREATE OR REPLACE FUNCTION verify_employee_pin(p_employee_id uuid, p_pin text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM employees
    WHERE id = p_employee_id
      AND pin = p_pin
      AND active = true
  );
$$;

-- Apenas utilizadores autenticados podem chamar esta função
REVOKE ALL ON FUNCTION verify_employee_pin(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_employee_pin(uuid, text) TO authenticated;
