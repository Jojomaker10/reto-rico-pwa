# 🎯 Instrucciones Específicas desde tu Link

## Desde: https://supabase.com/dashboard/project/sopvzvcfswxvpytsvner/functions

### 📍 Paso 1: Configurar Secrets

1. En la página de Edge Functions, verás pestañas en la parte superior
2. Click en la pestaña **"Secrets"**
3. Verás un botón **"Add a new secret"** o **"New secret"**
4. Agrega estos 8 secrets uno por uno:

---

#### 🔑 Secret 1
```
Key: MAIN_DEPOSIT_ADDRESS
Value: TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS
```

#### 🔑 Secret 2
```
Key: USDT_TRON_CONTRACT
Value: TUxd6vSRYTQxdix94FHYRbCrN2gCocvwYp
```

#### 🔑 Secret 3
```
Key: TRON_EVENT_SERVER
Value: https://api.nileex.io
```

#### 🔑 Secret 4
```
Key: TRONGRID_API_KEY
Value: d775fec1-e692-4566-a2ee-ca1079a3889b
```

#### 🔑 Secret 5
```
Key: WITHDRAW_MIN_USDT
Value: 10
```

#### 🔑 Secret 6
```
Key: WITHDRAW_FEE_USDT
Value: 1.2
```

#### 🔑 Secret 7
```
Key: REQUIRED_CONFIRMATIONS
Value: 20
```

#### 🔑 Secret 8
```
Key: ADMIN_EMAIL
Value: alcinjonas9@gmail.com
```

---

### 📍 Paso 2: Crear Edge Functions

En la misma página de Edge Functions:

#### Función 1: `deposits`
1. Click en **"Deploy a new function"** o **"Create function"**
2. Nombre: `deposits`
3. Copia TODO el código de: `supabase/functions/deposits/index.ts`
4. Pégalo en el editor
5. Click **"Deploy"**

#### Función 2: `withdrawals`
1. Click en **"Deploy a new function"**
2. Nombre: `withdrawals`
3. Copia TODO el código de: `supabase/functions/withdrawals/index.ts`
4. Pégalo en el editor
5. Click **"Deploy"**

#### Función 3: `admin`
1. Click en **"Deploy a new function"**
2. Nombre: `admin`
3. Copia TODO el código de: `supabase/functions/admin/index.ts`
4. Pégalo en el editor
5. Click **"Deploy"**

---

### 📍 Paso 3: Ejecutar SQL

1. Ve a: **SQL Editor** (en el menú lateral de Supabase)
2. Click **"New Query"**
3. Abre el archivo: `supabase/migrations/001_create_deposits_withdrawals.sql`
4. Copia TODO el contenido (154 líneas)
5. Pégalo en el editor SQL
6. Click **"Run"** o presiona **F5**

---

## ✅ Verificación

Después de completar los pasos:
- ✅ 8 secrets configurados
- ✅ 3 Edge Functions desplegadas
- ✅ SQL ejecutado correctamente

---

## 🚀 Deploy del Frontend

El frontend ya está listo. Solo necesitas:

1. **Si tienes auto-deploy en Netlify**: Ya se hizo automáticamente con el último push
2. **Si no**: Ve a Netlify → Deploys → Trigger deploy

---

**¡Listo! Tu aplicación debería funcionar completamente.** 🎉

