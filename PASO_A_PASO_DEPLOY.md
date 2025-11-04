# 🚀 Guía Paso a Paso: Deploy Completo

## 📋 Paso 1: Configurar Secrets en Supabase

### 1.1 Acceder a Secrets
1. Ve a: **https://app.supabase.com**
2. Selecciona tu proyecto: **sopvzvcfswxvpytsvner**
3. Click en **Settings** (⚙️) en el menú lateral
4. Click en **Edge Functions** en el submenú
5. Click en **Secrets** (pestaña)

### 1.2 Agregar Cada Secret

Haz clic en **"Add a new secret"** y agrega estos 8 secrets:

#### Secret 1:
- **Key**: `MAIN_DEPOSIT_ADDRESS`
- **Value**: `TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS`

#### Secret 2:
- **Key**: `USDT_TRON_CONTRACT`
- **Value**: `TUxd6vSRYTQxdix94FHYRbCrN2gCocvwYp`

#### Secret 3:
- **Key**: `TRON_EVENT_SERVER`
- **Value**: `https://api.nileex.io`

#### Secret 4:
- **Key**: `TRONGRID_API_KEY`
- **Value**: `d775fec1-e692-4566-a2ee-ca1079a3889b`

#### Secret 5:
- **Key**: `WITHDRAW_MIN_USDT`
- **Value**: `10`

#### Secret 6:
- **Key**: `WITHDRAW_FEE_USDT`
- **Value**: `1.2`

#### Secret 7:
- **Key**: `REQUIRED_CONFIRMATIONS`
- **Value**: `20`

#### Secret 8:
- **Key**: `ADMIN_EMAIL`
- **Value**: `alcinjonas9@gmail.com`

### 1.3 Verificar
Deberías ver 8 secrets en la lista.

---

## 📋 Paso 2: Crear Edge Functions

### 2.1 Función `deposits`

1. Ve a **Edge Functions** → **Create a new function**
2. **Nombre**: `deposits`
3. **Código**: Copia TODO el contenido de `supabase/functions/deposits/index.ts`
4. Click **Deploy**

### 2.2 Función `withdrawals`

1. Ve a **Edge Functions** → **Create a new function**
2. **Nombre**: `withdrawals`
3. **Código**: Copia TODO el contenido de `supabase/functions/withdrawals/index.ts`
4. Click **Deploy**

### 2.3 Función `admin`

1. Ve a **Edge Functions** → **Create a new function**
2. **Nombre**: `admin`
3. **Código**: Copia TODO el contenido de `supabase/functions/admin/index.ts`
4. Click **Deploy**

---

## 📋 Paso 3: Ejecutar SQL

1. Ve a **SQL Editor** en Supabase Dashboard
2. Click **New Query**
3. Abre el archivo `supabase/migrations/001_create_deposits_withdrawals.sql`
4. Copia TODO el contenido
5. Pégalo en el editor SQL
6. Click **Run** (o F5)

---

## 📋 Paso 4: Deploy del Frontend en Netlify

### Opción A: Desde Netlify Dashboard (Recomendado)

1. Ve a: **https://app.netlify.com**
2. Selecciona tu sitio: **reto-rico-pwa**
3. Ve a **Deploys**
4. Click en **Trigger deploy** → **Clear cache and deploy site**

### Opción B: Desde Git (Automático)

Si tienes auto-deploy configurado, solo necesitas hacer push:

```bash
git push origin main
```

Netlify detectará los cambios y hará el deploy automáticamente.

---

## ✅ Verificación Final

1. **Edge Functions desplegadas**: Ve a Edge Functions y verifica que las 3 funciones estén activas
2. **Frontend desplegado**: Ve a tu sitio en Netlify y verifica que el build sea exitoso
3. **Prueba la app**: Abre tu sitio y prueba:
   - Login/Registro
   - Depositar USDT
   - Retirar USDT
   - Panel Admin (si eres admin)

---

## 🐛 Troubleshooting

### Si las Edge Functions no responden:
- Verifica que los secrets estén configurados correctamente
- Verifica que las funciones estén desplegadas
- Revisa los logs en Supabase Dashboard → Edge Functions → Logs

### Si el frontend no se conecta:
- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` estén en Netlify Environment Variables
- Abre la consola del navegador (F12) para ver errores
- Verifica que las rutas de las Edge Functions sean correctas

---

**¡Listo! Tu aplicación debería estar funcionando completamente en producción.** 🎉

