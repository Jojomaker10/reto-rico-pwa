-- ============================================================
-- FIX RLS: Permisos para Crear Perfiles
-- Ejecuta TODO este script en SQL Editor de Supabase
-- ============================================================

-- Elimina todas las políticas existentes de profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Crea políticas más permisivas temporalmente para testing
-- Los usuarios pueden ver todos los perfiles (testing)
CREATE POLICY "Allow viewing all profiles" ON profiles
  FOR SELECT USING (true);

-- Los usuarios pueden insertar su propio perfil
CREATE POLICY "Allow inserting own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Allow updating own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- IMPORTANTE: También necesitamos permitir que el trigger inserte
-- El trigger usa SECURITY DEFINER, pero si eso no funciona:

-- Política adicional para permitir inserción durante registro
CREATE POLICY "Allow trigger to insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Verificación
-- ============================================================
-- Ejecuta esto para ver las políticas:
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'profiles';
-- ============================================================

