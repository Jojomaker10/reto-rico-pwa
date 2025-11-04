# 🚀 Guía de Migración a Supabase Edge Functions

## ✅ Cambios Completados

### 1. Estructura Creada
- ✅ `supabase/functions/deposits/index.ts` - Edge Function para depósitos
- ✅ `supabase/functions/withdrawals/index.ts` - Edge Function para retiros
- ✅ `supabase/functions/admin/index.ts` - Edge Function para admin
- ✅ `supabase/migrations/001_create_deposits_withdrawals.sql` - Migración de base de datos

### 2. Frontend Actualizado
- ✅ `src/utils/api.js` - Cliente API configurado
- ✅ `src/pages/Deposit.jsx` - Actualizado para usar Edge Functions
- ✅ `src/pages/Withdraw.jsx` - Actualizado para usar Edge Functions
- ✅ `src/pages/Transactions.jsx` - Actualizado para usar Edge Functions
- ✅ `src/pages/AdminDashboard.jsx` - Actualizado para usar Edge Functions

## 📋 Pasos para Desplegar

### Paso 1: Ejecutar Migración SQL en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido de `supabase/migrations/001_create_deposits_withdrawals.sql`
5. Ejecuta la query
6. Verifica que las tablas se crearon correctamente:
   - `deposits`
   - `withdrawals`
   - `incoming_transfers`
   - `settings`

### Paso 2: Instalar Supabase CLI

```bash
npm install -g supabase
```

O con Homebrew:
```bash
brew install supabase/tap/supabase
```

### Paso 3: Inicializar Supabase (si no lo has hecho)

```bash
cd tu-proyecto
supabase login
supabase link --project-ref tu-project-ref
```

### Paso 4: Configurar Variables de Entorno en Supabase

Ve a **Settings** → **Edge Functions** → **Secrets** y agrega:

```
MAIN_DEPOSIT_ADDRESS=TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS
USDT_TRON_CONTRACT=TUxd6vSRYTQxdix94FHYRbCrN2gCocvwYp
TRON_EVENT_SERVER=https://api.nileex.io
TRONGRID_API_KEY=tu-trongrid-api-key
WITHDRAW_MIN_USDT=10
WITHDRAW_FEE_USDT=1.2
REQUIRED_CONFIRMATIONS=20
ADMIN_EMAIL=alcinjonas9@gmail.com
```

### Paso 5: Desplegar Edge Functions

```bash
# Desplegar todas las funciones
supabase functions deploy deposits
supabase functions deploy withdrawals
supabase functions deploy admin

# O desplegar todas a la vez
supabase functions deploy
```

### Paso 6: Verificar Despliegue

1. Ve a **Edge Functions** en Supabase Dashboard
2. Deberías ver las 3 funciones desplegadas:
   - `deposits`
   - `withdrawals`
   - `admin`

### Paso 7: Configurar Variables en Netlify

En Netlify Dashboard → **Environment variables**, asegúrate de tener:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=tu-anon-key
VITE_ADMIN_EMAIL=alcinjonas9@gmail.com
```

### Paso 8: Hacer Deploy del Frontend

El frontend ahora está configurado para usar Edge Functions en producción.

## 🔧 Funcionalidades Implementadas

### Deposits Function
- ✅ `POST /deposits/request` - Obtener dirección de depósito
- ✅ `GET /deposits/history` - Historial de depósitos
- ✅ `POST /deposits/report` - Reportar transacción de depósito

### Withdrawals Function
- ✅ `POST /withdrawals/request` - Solicitar retiro
- ✅ `GET /withdrawals/history` - Historial de retiros
- ✅ `GET /withdrawals/admin/pending` - Listar retiros pendientes (admin)
- ✅ `POST /withdrawals/admin/:id/approve` - Aprobar retiro (admin)
- ✅ `POST /withdrawals/admin/:id/process` - Procesar retiro (admin)

### Admin Function
- ✅ `GET /admin/stats` - Estadísticas generales
- ✅ `GET /admin/users` - Listar usuarios
- ✅ `GET /admin/deposits` - Listar depósitos
- ✅ `GET /admin/withdrawals` - Listar retiros

## ⚠️ Notas Importantes

1. **Envío de USDT**: La función `sendUSDT` en `withdrawals/index.ts` está marcada como placeholder. Necesitas implementarla de forma segura usando un servicio que maneje la wallet privada.

2. **Cron Jobs**: Los cron jobs de escaneo de depósitos deben configurarse usando Supabase Database Webhooks o un servicio externo.

3. **RLS Policies**: Las políticas de Row Level Security están configuradas para que los usuarios solo vean sus propios datos.

## 🐛 Troubleshooting

### Error: "Function not found"
- Verifica que las funciones estén desplegadas en Supabase Dashboard
- Asegúrate de que las rutas sean correctas (`/deposits/request`, no `/api/deposits/request`)

### Error: "No autorizado"
- Verifica que el header `x-user-id` se esté enviando correctamente
- En producción, verifica que las variables de entorno estén configuradas

### Error: "Acceso solo para administrador"
- Verifica que `ADMIN_EMAIL` esté configurado en Supabase Secrets
- Verifica que el usuario tenga el email correcto

## 📚 Recursos

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime](https://deno.land/)
- [TronGrid API](https://www.trongrid.io/)

