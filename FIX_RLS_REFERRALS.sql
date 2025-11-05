-- ============================================================
-- FIX: Políticas RLS para permitir ver referidos
-- ============================================================
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Abre "SQL Editor" en el menú lateral
-- 3. Click "New Query"
-- 4. Copia y pega TODO este contenido
-- 5. Click "Run" para ejecutar
-- ============================================================

-- Eliminar política existente si existe
DROP POLICY IF EXISTS "Users can view their referrals" ON profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles" ON profiles;

-- Opción 1: Política específica para ver solo tus referidos (RECOMENDADO)
-- Esta política permite que veas solo los usuarios que tienen tu código en referred_by
CREATE POLICY "Users can view their referrals" ON profiles
  FOR SELECT USING (
    referred_by IN (
      SELECT referral_code FROM profiles WHERE id = auth.uid()
    )
  );

-- Opción 2: Política temporal para testing (permite ver todos los perfiles)
-- Descomenta esto si la opción 1 no funciona y necesitas testing
-- CREATE POLICY "Allow viewing all profiles" ON profiles
--   FOR SELECT USING (true);

-- Verificar que la política se creó correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname LIKE '%referral%';

