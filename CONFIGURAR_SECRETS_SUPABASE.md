# 🔐 Configurar Secrets en Supabase Edge Functions

## 📍 Ubicación
1. Ve a: https://app.supabase.com
2. Selecciona tu proyecto: `sopvzvcfswxvpytsvner`
3. Ve a: **Settings** (⚙️) → **Edge Functions** → **Secrets**

## 🔑 Secrets a Agregar

Haz clic en **"Add a new secret"** para cada una de estas variables:

### 1. MAIN_DEPOSIT_ADDRESS
```
Key: MAIN_DEPOSIT_ADDRESS
Value: TCfSTwyseWeq3SdXMjptN2TvBHREhkJNTS
```

### 2. USDT_TRON_CONTRACT
```
Key: USDT_TRON_CONTRACT
Value: TUxd6vSRYTQxdix94FHYRbCrN2gCocvwYp
```
*(Nota: Este es el contrato USDT en Nile testnet. Si usas mainnet, cambia el valor)*

### 3. TRON_EVENT_SERVER
```
Key: TRON_EVENT_SERVER
Value: https://api.nileex.io
```
*(Para mainnet usaría: https://api.trongrid.io)*

### 4. TRONGRID_API_KEY
```
Key: TRONGRID_API_KEY
Value: d775fec1-e692-4566-a2ee-ca1079a3889b
```

### 5. WITHDRAW_MIN_USDT
```
Key: WITHDRAW_MIN_USDT
Value: 10
```

### 6. WITHDRAW_FEE_USDT
```
Key: WITHDRAW_FEE_USDT
Value: 1.2
```

### 7. REQUIRED_CONFIRMATIONS
```
Key: REQUIRED_CONFIRMATIONS
Value: 20
```

### 8. ADMIN_EMAIL
```
Key: ADMIN_EMAIL
Value: alcinjonas9@gmail.com
```

## ✅ Verificación

Después de agregar todos los secrets, deberías ver 8 secrets en la lista.

## 📝 Nota Importante

Los secrets están encriptados y solo están disponibles dentro de las Edge Functions. No se exponen al frontend.

