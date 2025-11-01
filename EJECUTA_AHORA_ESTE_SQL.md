# 🚨 EJECUTA ESTE SQL AHORA - FIX COMPLETO

## ❌ Error Actual
```
Error creating profile: new row violates row-level security policy
```

## ✅ Solución
Ejecuta el SQL completo que combina TODO lo necesario.

---

## 🎯 PASO 1: Abre Supabase

**URL:** https://app.supabase.com/project/sopvzvcfswxvpytsvner

**Click:** SQL Editor → New Query

---

## 🎯 PASO 2: Copia TODO el SQL

**Archivo:** `EJECUTA_ESTE_FIX_COMPLETO.sql`

**O copia desde aquí:**

```sql
-- ============================================================
-- EJECUTA TODO ESTE SQL COMPLETO
-- FIX COMPLETO PARA REGISTRO DE USUARIOS
-- ============================================================

-- PASO 1: Elimina políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow inserting own profile" ON profiles;
DROP POLICY IF EXISTS "Allow updating own profile" ON profiles;
DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON profiles;

-- PASO 2: Crea la función del trigger
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

-- PASO 3: Crea el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PASO 4: Crea políticas de seguridad
CREATE POLICY "Allow viewing all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow inserting own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow updating own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow trigger to insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);
```

---

## 🎯 PASO 3: Ejecuta

**1. Pega TODO el código**
**2. Click "Run"**
**3. Debe aparecer:** `Success. No rows returned`

---

## 🎯 PASO 4: Desactiva Email Confirmation

**IMPORTANTE:**

1. Ve a **Authentication → Settings**
2. Busca **"Enable email confirmations"**
3. **DESACTÍVALO** ❌
4. **Guardar** ✅

---

## 🎯 PASO 5: Prueba Registro

1. Abre: http://localhost:5173
2. Click "Registrarse"
3. Completa el formulario
4. Click "Crear Cuenta"
5. **Debe funcionar!** ✅

---

## ✅ Verificación

Ejecuta esto para verificar que todo está bien:

```sql
-- Ver políticas
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Ver trigger
SELECT tgname, proname 
FROM pg_trigger 
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgname = 'on_auth_user_created';
```

**Debes ver 4 políticas y 1 trigger.**

---

**¡Ejecuta TODO el SQL y prueba!** 🚀

