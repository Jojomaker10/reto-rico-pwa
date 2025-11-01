-- ============================================================
-- FIX: Agregar política INSERT para profiles
-- ============================================================
-- Ejecuta este script en SQL Editor de Supabase
-- ============================================================

-- Política para permitir que usuarios inserten su propio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- Verificación
-- ============================================================
-- Después de ejecutar, verifica con:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- ============================================================

