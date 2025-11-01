-- ============================================================
-- FIX COMPLETO PARA REGISTRO DE USUARIOS
-- Ejecuta TODO este script en SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- 1. Función para crear perfil automáticamente con referral code
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_referral_code TEXT;
BEGIN
  -- Genera un código de referido único (6 caracteres alfanuméricos)
  v_referral_code := UPPER(substring(regexp_replace(gen_random_uuid()::text, '[^a-zA-Z0-9]', '', 'g') from 1 for 6));
  
  -- Asegura que sea único (intentos repetidos si necesario)
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_referral_code) LOOP
    v_referral_code := UPPER(substring(regexp_replace(gen_random_uuid()::text, '[^a-zA-Z0-9]', '', 'g') from 1 for 6));
  END LOOP;
  
  -- Crea el perfil en la tabla profiles
  INSERT INTO public.profiles (id, name, email, phone, referral_code, referred_by)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    new.raw_user_meta_data->>'phone',
    v_referral_code,
    CASE 
      WHEN new.raw_user_meta_data->>'referredBy' IS NOT NULL 
        AND new.raw_user_meta_data->>'referredBy' != '' 
        AND new.raw_user_meta_data->>'referredBy' != 'null'
      THEN new.raw_user_meta_data->>'referredBy'
      ELSE NULL 
    END
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 2. Trigger para ejecutar la función cuando se crea un usuario
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. Política para permitir que usuarios inserten su propio perfil
-- (Por si acaso el trigger no funciona en algún caso)
-- ============================================================
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- 4. Política para permitir que usuarios modifiquen su propio perfil
-- ============================================================
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- ¡LISTO! Ahora el registro funcionará automáticamente
-- ============================================================
-- El trigger creará el perfil automáticamente cuando:
-- 1. Se registra un usuario en Supabase Auth
-- 2. Se genera un código de referido único
-- 3. Se guardan los datos en la tabla profiles
-- ============================================================

-- ============================================================
-- Verificación (opcional, para confirmar que todo está bien)
-- ============================================================
-- Ejecuta esto para ver las políticas:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
--
-- Ejecuta esto para ver el trigger:
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- ============================================================

