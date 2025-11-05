# 🚀 Desplegar Función Deposits - Guía Rápida

## 📍 Paso 1: Ir a Supabase Dashboard

1. Abre: **https://supabase.com/dashboard/project/sopvzvcfswxvpytsvner/functions**
2. O ve a tu proyecto → **Edge Functions**

---

## 📍 Paso 2: Actualizar la Función `deposits`

### Si la función ya existe:

1. En la lista de funciones, busca **`deposits`**
2. Haz clic en **`deposits`** para editarla
3. Haz clic en el botón **"Edit"** o **"Edit Function"**
4. **Selecciona TODO el código** (Ctrl+A) y **Bórralo** (Delete)
5. **Copia TODO el contenido** del archivo: `supabase/functions/deposits/index.ts`
6. **Pega el código** en el editor (Ctrl+V)
7. Haz clic en **"Deploy"** o **"Save"**
8. Espera 30-60 segundos hasta ver el mensaje: ✅ **"Function deployed successfully"**

### Si la función NO existe:

1. Haz clic en **"Create a new function"** o **"New function"**
2. **Nombre**: `deposits` (en minúsculas, sin espacios)
3. **Copia TODO el contenido** del archivo: `supabase/functions/deposits/index.ts`
4. **Pega el código** en el editor
5. Haz clic en **"Deploy"**
6. Espera 30-60 segundos

---

## 📍 Paso 3: Verificar que la Dirección USDT está Configurada

1. En la página de Edge Functions, haz clic en la pestaña **"Secrets"**
2. Busca el secret llamado **`MAIN_DEPOSIT_ADDRESS`**
3. Si NO existe, créalo:
   - Haz clic en **"Add a new secret"**
   - **Key**: `MAIN_DEPOSIT_ADDRESS`
   - **Value**: `TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS`
   - Haz clic en **"Save"**

### ⚠️ Nota Importante:

Aunque el código tiene un fallback con tu dirección, es mejor configurar el secret para que funcione correctamente.

---

## ✅ Paso 4: Probar que Funciona

1. Ve a tu sitio web (donde está la app)
2. Inicia sesión
3. Ve a la página de **"Depositar USDT"**
4. **La dirección USDT debería aparecer automáticamente**: `TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS`
5. También debería aparecer un código QR

---

## 🐛 Si algo no funciona:

### La dirección no aparece:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Console"**
3. Busca errores en rojo
4. Si ves un error, compártelo para ayudarte

### Error al desplegar:
1. Verifica que copiaste TODO el código sin saltar líneas
2. Verifica que no haya caracteres extraños
3. Intenta desplegar nuevamente

### Ver logs en Supabase:
1. Ve a Edge Functions → **`deposits`**
2. Haz clic en la pestaña **"Logs"**
3. Revisa los errores (si los hay)

---

## 🎉 ¡Listo!

Después de estos pasos, tu dirección USDT debería aparecer correctamente en el sitio.


