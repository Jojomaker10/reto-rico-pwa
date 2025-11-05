-- ============================================================
-- FIX PARA PERMITIR VER REFERIDOS EN SUPABASE
-- Ejecuta este SQL en Supabase SQL Editor
-- ============================================================

-- Eliminar políticas existentes que puedan estar bloqueando
DROP POLICY IF EXISTS "Users can view their referrals" ON profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Opción 1: Política específica para ver referidos (RECOMENDADO)
-- Permite que un usuario vea los perfiles de personas que fueron referidas por él
CREATE POLICY "Users can view their referrals" ON profiles
  FOR SELECT USING (
    referred_by IN (
      SELECT referral_code FROM profiles WHERE id = auth.uid()
    )
    OR id = auth.uid()  -- También puede ver su propio perfil
  );

-- Opción 2: Política temporal para testing (más permisiva)
-- Descomenta la siguiente línea si la opción 1 no funciona
-- CREATE POLICY "Allow viewing all profiles" ON profiles
--   FOR SELECT USING (true);

-- Verificar que la política se creó correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

