-- ============================================================
-- FIX COMPLETO: PERMITIR LOGIN Y VER REFERIDOS
-- Ejecuta este SQL en Supabase SQL Editor
-- ============================================================

-- PASO 1: Eliminar TODAS las políticas existentes de profiles
DROP POLICY IF EXISTS "Users can view their referrals" ON profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow inserting own profile" ON profiles;
DROP POLICY IF EXISTS "Allow updating own profile" ON profiles;
DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON profiles;

-- PASO 2: Crear políticas que permitan LOGIN Y VER REFERIDOS

-- Política 1: Permitir que cada usuario vea su propio perfil (NECESARIO PARA LOGIN)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Política 2: Permitir que cada usuario vea los perfiles de sus referidos
CREATE POLICY "Users can view their referrals" ON profiles
  FOR SELECT USING (
    referred_by IN (
      SELECT referral_code FROM profiles WHERE id = auth.uid()
    )
  );

-- Política 3: Permitir que cada usuario inserte su propio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política 4: Permitir que cada usuario actualice su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política 5: Permitir que el trigger inserte perfiles (necesario para registro)
CREATE POLICY "Allow trigger to insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- PASO 3: Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

