# 🚨 EJECUTA ESTE SQL AHORA

## 📋 Problema
Estás obteniendo este error:
```
new row violates row-level security policy for table "profiles"
```

## ✅ Solución
Necesitas ejecutar un trigger SQL que crea perfiles automáticamente.

---

## 🎯 PASO 1: Abre Supabase SQL Editor

**1. Ve a:** https://app.supabase.com/project/sopvzvcfswxvpytsvner

**2. Click:** "SQL Editor" (menú lateral izquierdo)

**3. Click:** "New Query"

---

## 🎯 PASO 2: Copia y Pega Todo Este Código

Abre el archivo: **`SUPABASE_FIX_COMPLETO.sql`**

O copia desde aquí:

```sql
-- ============================================================
-- FIX COMPLETO PARA REGISTRO DE USUARIOS
-- ============================================================

-- 1. Función para crear perfil automáticamente
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

-- 2. Trigger para ejecutar la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Políticas de seguridad
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🎯 PASO 3: Ejecuta el Código

**1. Pega todo el código** en el editor SQL

**2. Click "Run"** o presiona `Ctrl+Enter`

**3. Debe aparecer:** 
```
Success. No rows returned
```

---

## 🎯 PASO 4: Prueba de Nuevo

**1. Vuelve a:** http://localhost:5173

**2. Click "Registrarse"**

**3. Completa el formulario**

**4. Click "Crear Cuenta"**

**5. Debe funcionar!** ✅

---

## ✅ Verificación

Después de ejecutar el código, verifica que el trigger se creó:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Debe aparecer el trigger `on_auth_user_created`.

---

## 🎉 ¿Qué Hace Este Código?

1. ✅ **Crea una función** que genera automáticamente un código de referido único
2. ✅ **Crea un trigger** que se ejecuta cuando se registra un nuevo usuario
3. ✅ **Inserta el perfil** automáticamente en la tabla `profiles`
4. ✅ **Guarda el código de referido** si se proporcionó
5. ✅ **Agrega políticas** de seguridad necesarias

---

**¡Ejecuta el SQL y prueba de nuevo!** 🚀

