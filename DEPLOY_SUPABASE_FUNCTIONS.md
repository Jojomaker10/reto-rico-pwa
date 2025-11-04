# 📦 Instrucciones Rápidas para Desplegar Edge Functions

## 🚀 Opción Rápida: Desde Supabase Dashboard

### Paso 1: Crear las Funciones Manualmente

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **Edge Functions** → **Create a new function**
3. Para cada función:

#### Función: `deposits`
- **Nombre**: `deposits`
- **Código**: Copia el contenido de `supabase/functions/deposits/index.ts`

#### Función: `withdrawals`
- **Nombre**: `withdrawals`
- **Código**: Copia el contenido de `supabase/functions/withdrawals/index.ts`

#### Función: `admin`
- **Nombre**: `admin`
- **Código**: Copia el contenido de `supabase/functions/admin/index.ts`

### Paso 2: Configurar Secrets

Ve a **Settings** → **Edge Functions** → **Secrets** y agrega:

```
MAIN_DEPOSIT_ADDRESS=TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS
USDT_TRON_CONTRACT=TUxd6vSRYTQxdix94FHYRbCrN2gCocvwYp
TRON_EVENT_SERVER=https://api.nileex.io
TRONGRID_API_KEY=tu-key
WITHDRAW_MIN_USDT=10
WITHDRAW_FEE_USDT=1.2
REQUIRED_CONFIRMATIONS=20
ADMIN_EMAIL=alcinjonas9@gmail.com
```

### Paso 3: Ejecutar SQL

Ejecuta el contenido de `supabase/migrations/001_create_deposits_withdrawals.sql` en Supabase SQL Editor.

## ✅ Listo

Después de estos pasos, tu aplicación debería funcionar completamente con Supabase Edge Functions.

