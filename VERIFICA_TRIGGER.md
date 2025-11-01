# 🔍 Verifica el Trigger en Supabase

## Paso 1: Verifica que el Trigger Existe

Ejecuta este SQL en Supabase SQL Editor:

```sql
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name,
  tgenabled as enabled
FROM pg_trigger 
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgname = 'on_auth_user_created';
```

**Debe mostrar:** `on_auth_user_created` activo

---

## Paso 2: Verifica la Función

```sql
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user';
```

**Debe mostrar:** La función completa

---

## Paso 3: Prueba la Función Manualmente

**¡CUIDADO!** Esto solo para testing.

Primero, obtén un user ID de auth.users:

```sql
SELECT id, email FROM auth.users LIMIT 1;
```

Luego prueba la función (reemplaza el UUID con uno real):

```sql
SELECT public.handle_new_user() FROM auth.users WHERE id = 'TU_UUID_AQUI';
```

**O simplemente:** Prueba registrar otro usuario desde la app.

---

## Paso 4: Revisa los Logs

En Supabase:
1. Ve a **Logs**
2. Busca errores de PostgreSQL
3. Revisa si hay errores de la función `handle_new_user`

---

## Paso 5: Verifica Email Confirmation

1. Ve a **Authentication → Settings**
2. Busca **"Enable email confirmations"**
3. **DESACTÍVALO** para testing
4. Guarda

**IMPORTANTE:** Si está activado, el usuario NO se crea hasta que confirme el email.

---

## Diagnóstico

Si después de todo esto sigue fallando:

1. Verifica que ejecutaste **TODA** la SQL de `SUPABASE_FIX_COMPLETO.sql`
2. Revisa que no haya errores en los logs
3. Intenta ejecutar el trigger manualmente
4. Desactiva confirmación de email

---

**Ejecuta estas verificaciones y dime qué encuentras.**

