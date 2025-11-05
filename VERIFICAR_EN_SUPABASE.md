# 🔍 Verificar Configuración en Supabase Dashboard

## 📍 Paso 1: Verificar Edge Functions

### Ir a Edge Functions:
1. Desde: https://supabase.com/dashboard/org/xygbiajnimtgzsewugnz
2. Selecciona tu proyecto: `sopvzvcfswxvpytsvner`
3. Ve a: **Edge Functions** (en el menú lateral izquierdo)

### ✅ Verificar que existan las 3 funciones:

Deberías ver en la lista:

1. ✅ **`deposits`** 
   - Estado: **Active** (verde)
   - Última actualización: fecha reciente

2. ✅ **`withdrawals`**
   - Estado: **Active** (verde)
   - Última actualización: fecha reciente

3. ✅ **`admin`**
   - Estado: **Active** (verde)
   - Última actualización: fecha reciente

### 🔍 Si alguna función no aparece o está en error:
- Haz clic en la función para ver los logs
- Verifica que el código esté completo
- Revisa si hay errores de sintaxis

---

## 📍 Paso 2: Verificar Secrets

### Ir a Secrets:
1. Desde Edge Functions, ve a: **Settings** (⚙️) → **Secrets**
   - O desde: Settings → Edge Functions → Secrets

### ✅ Verificar que existan los 8 secrets:

Deberías ver en la lista:

1. ✅ **`MAIN_DEPOSIT_ADDRESS`**
   - Valor: `TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS`

2. ✅ **`USDT_TRON_CONTRACT`**
   - Valor: `TUxd6vSRYTQxdix94FHYRbCrN2gCocvwYp`

3. ✅ **`TRON_EVENT_SERVER`**
   - Valor: `https://api.nileex.io`

4. ✅ **`TRONGRID_API_KEY`**
   - Valor: `d775fec1-e692-4566-a2ee-ca1079a3889b`

5. ✅ **`WITHDRAW_MIN_USDT`**
   - Valor: `10`

6. ✅ **`WITHDRAW_FEE_USDT`**
   - Valor: `1.2`

7. ✅ **`REQUIRED_CONFIRMATIONS`**
   - Valor: `20`

8. ✅ **`ADMIN_EMAIL`**
   - Valor: `alcinjonas9@gmail.com`

### 🔍 Si falta algún secret:
- Haz clic en **"Add a new secret"**
- Agrega el nombre y valor correspondiente

---

## 📍 Paso 3: Verificar Base de Datos

### Ir a SQL Editor:
1. Ve a: **SQL Editor** (en el menú lateral)
2. Ejecuta esta consulta para verificar las tablas:

```sql
-- Verificar tabla deposits
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'deposits';

-- Verificar tabla withdrawals
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'withdrawals';
```

### ✅ Deberías ver:
- Tabla `deposits` existe
- Tabla `withdrawals` existe

### 🔍 Si las tablas no existen:
1. Ve a: **SQL Editor**
2. Copia TODO el contenido de: `supabase/migrations/001_create_deposits_withdrawals.sql`
3. Pégalo en el editor
4. Haz clic en **"Run"** o **"Execute"**

---

## 📍 Paso 4: Probar las Edge Functions

### Probar función `deposits`:
1. Ve a: Edge Functions → `deposits`
2. Haz clic en **"Invoke"** o **"Test"**
3. Deberías ver que responde correctamente

### Probar función `withdrawals`:
1. Ve a: Edge Functions → `withdrawals`
2. Haz clic en **"Invoke"** o **"Test"**
3. Deberías ver que responde correctamente

### Probar función `admin`:
1. Ve a: Edge Functions → `admin`
2. Haz clic en **"Invoke"** o **"Test"**
3. Deberías ver que responde correctamente

---

## ✅ Checklist Final

Marca cada uno cuando lo verifiques:

- [ ] Las 3 Edge Functions están creadas (`deposits`, `withdrawals`, `admin`)
- [ ] Las 3 Edge Functions están en estado **Active**
- [ ] Los 8 secrets están configurados
- [ ] Las tablas `deposits` y `withdrawals` existen en la base de datos
- [ ] Las funciones responden correctamente (sin errores)

---

## 🐛 Si algo no funciona:

### Error: "Function not found"
- Verifica que las funciones estén creadas con los nombres exactos: `deposits`, `withdrawals`, `admin`

### Error: "Secret not found"
- Verifica que todos los 8 secrets estén configurados
- Revisa que los nombres de los secrets sean exactos (sin espacios, mayúsculas/minúsculas correctas)

### Error: "Table does not exist"
- Ejecuta el script SQL de migración
- Verifica que el script se ejecutó sin errores

### Error: "Permission denied" o "Unauthorized"
- Verifica que `ADMIN_EMAIL` esté configurado correctamente
- Verifica que el usuario que hace la petición tenga el email correcto

---

## 📝 Resumen

Si todo está verificado:
- ✅ **3 Edge Functions** creadas y activas
- ✅ **8 Secrets** configurados
- ✅ **2 Tablas** en la base de datos
- ✅ **Todo funcionando**

¡Tu backend está listo! 🎉



