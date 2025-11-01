-- ============================================================
-- EJECUTA TODO ESTE SQL COMPLETO
-- FIX COMPLETO PARA REGISTRO DE USUARIOS
-- ============================================================
-- Copia TODO desde aquí hasta el final
-- ============================================================

-- ============================================================
-- PASO 1: Elimina políticas existentes
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow inserting own profile" ON profiles;
DROP POLICY IF EXISTS "Allow updating own profile" ON profiles;
DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON profiles;

-- ============================================================
-- PASO 2: Crea la función del trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_referral_code TEXT;
BEGIN
  -- Genera un código de referido único
  v_referral_code := UPPER(substring(regexp_replace(gen_random_uuid()::text, '[^a-zA-Z0-9]', '', 'g') from 1 for 6));
  
  -- Asegura que sea único
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
-- PASO 3: Crea el trigger
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PASO 4: Crea políticas de seguridad
-- ============================================================

-- Permite ver todos los perfiles (testing, cambiar después)
CREATE POLICY "Allow viewing all profiles" ON profiles
  FOR SELECT USING (true);

-- Permite insertar perfil propio
CREATE POLICY "Allow inserting own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permite actualizar perfil propio
CREATE POLICY "Allow updating own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Permite al trigger insertar (por si acaso)
CREATE POLICY "Allow trigger to insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- ¡COMPLETADO!
-- ============================================================

-- ============================================================
-- VERIFICACIÓN (ejecuta esto para verificar)
-- ============================================================
-- SELECT policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'profiles';

-- SELECT tgname, proname 
-- FROM pg_trigger 
-- JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
-- WHERE tgname = 'on_auth_user_created';
-- ============================================================

