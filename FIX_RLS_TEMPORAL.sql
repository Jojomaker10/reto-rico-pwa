-- ============================================================
-- FIX TEMPORAL: DESHABILITAR RLS PARA TESTING
-- ⚠️ SOLO PARA TESTING - Deshabilita RLS temporalmente
-- ============================================================

-- OPCIÓN 1: Deshabilitar RLS completamente (TEMPORAL - SOLO PARA TESTING)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- OPCIÓN 2: Si la opción 1 no funciona, crear política muy permisiva
-- Primero habilita RLS de nuevo
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Luego crea una política que permita todo (SOLO PARA TESTING)
-- DROP POLICY IF EXISTS "Allow all operations" ON profiles;
-- CREATE POLICY "Allow all operations" ON profiles
--   FOR ALL USING (true) WITH CHECK (true);

-- Verificar el estado de RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

