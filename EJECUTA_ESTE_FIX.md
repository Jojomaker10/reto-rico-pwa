# 🚨 FIX CRÍTICO - Ejecuta Ahora

## Problema
Las cuentas no aparecen en Supabase porque falta una política de permisos.

## Solución
Ejecuta este SQL en Supabase para agregar el permiso faltante.

---

## 📋 Paso 1: Abre SQL Editor

1. Ve a: https://app.supabase.com/project/sopvzvcfswxvpytsvner
2. Click en **"SQL Editor"** en el menú lateral
3. Click **"New Query"**

---

## 📋 Paso 2: Copia Este Código

```sql
-- FIX: Agregar política INSERT para profiles
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 📋 Paso 3: Ejecuta

1. Pega el código en el editor
2. Click **"Run"** o presiona `Ctrl+Enter`
3. Debe aparecer: **"Success. No rows returned"**

---

## 📋 Paso 4: Prueba de Nuevo

1. Vuelve a tu app: http://localhost:5173
2. Crea una cuenta nueva
3. Verifica en Supabase:
   - **Authentication → Users** (debe aparecer el usuario)
   - **Table Editor → profiles** (debe aparecer el perfil)

---

## ✅ Verificación

Ejecuta este SQL para verificar que la política se creó:

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

Debes ver **3 políticas**:
1. ✅ Users can view own profile
2. ✅ **Users can insert own profile** ← Esta es la nueva
3. ✅ Users can update own profile

---

**¡Ejecuta este fix y prueba de nuevo!** 🚀

