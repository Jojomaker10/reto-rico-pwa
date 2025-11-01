# 🔄 Guía de Migración a Supabase

## 📋 Resumen

Tu PWA Reto-Rico puede funcionar de dos maneras:
1. **Local**: Con IndexedDB (ya implementado)
2. **Cloud**: Con Supabase (nueva opción)

## 🎯 Ventajas de Usar Supabase

### ✅ Datos en la Nube
- Sincronización entre dispositivos
- Backup automático
- Acceso desde cualquier lugar

### ✅ Funcionalidades Avanzadas
- Autenticación robusta
- Real-time updates
- Edge functions
- Storage para archivos
- Email notifications

### ✅ Escalabilidad
- Soporta millones de usuarios
- SSL automático
- CDN global
- Firewall integrado

## 📂 Archivos Creados

### Ya Implementados:
- ✅ `src/config/supabase.js` - Cliente de Supabase
- ✅ `src/store/authStoreSupabase.js` - Store con Supabase
- ✅ `SUPABASE_SETUP.md` - Guía de configuración
- ✅ `SUPABASE_SQL.sql` - Script SQL completo
- ✅ `.env.example` - Template de variables
- ✅ `.gitignore` actualizado

## 🔄 Pasos para Migrar

### Paso 1: Configurar Supabase

Sigue la guía en `SUPABASE_SETUP.md`:

1. Crear proyecto en Supabase
2. Copiar credenciales
3. Crear archivo `.env`
4. Ejecutar SQL script

### Paso 2: Cambiar Store en App

**Opción A: Usar Supabase (Recomendado)**

En `src/App.jsx` o donde uses el store:
```jsx
// Cambiar de:
import useAuthStore from './store/authStore'

// A:
import useAuthStore from './store/authStoreSupabase'
```

**Opción B: Mantener Local**

Si prefieres seguir con IndexedDB, no cambies nada.

### Paso 3: Probar Funcionalidades

1. **Registro**: Debería crear usuario en Supabase Auth
2. **Login**: Debería autenticar contra Supabase
3. **Datos**: Deberían guardarse en tablas Supabase
4. **Referidos**: Sistema de referidos funcional

## 🧪 Testing

### Verificar en Supabase Dashboard:

1. **Authentication**:
   - Ve a "Authentication" → "Users"
   - Debe aparecer tu usuario registrado

2. **Table Editor**:
   - Ve a "Table Editor"
   - Verifica que las tablas existen
   - Debe ver los datos insertados

3. **Logs**:
   - Ve a "Logs" → "API Logs"
   - Verifica que las queries funcionan

## 📊 Comparación

| Característica | IndexedDB (Local) | Supabase (Cloud) |
|----------------|-------------------|------------------|
| Datos persistentes | ✅ | ✅ |
| Sincronización | ❌ | ✅ |
| Autenticación | Básica | Robusta |
| Real-time | ❌ | ✅ |
| Offline | ✅ | ⚠️ Limitado |
| Backup | Manual | Automático |
| Multi-device | ❌ | ✅ |
| Escalabilidad | Limitada | Alta |
| Costo | Gratis | Gratis (starter) |

## ⚙️ Configuración Adicional

### Real-time Subscriptions

Para actualizaciones en tiempo real:

```javascript
// Ejemplo: Suscripción a inversiones
useEffect(() => {
  const subscription = supabase
    .channel('investments')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'investments',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      console.log('Investment updated:', payload)
      // Actualizar UI
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [user.id])
```

### Storage para Comprobantes

Configura Storage para archivos:

1. Ve a Storage en Supabase
2. Crea un bucket llamado "payment-proofs"
3. Configura políticas de acceso

## 🔒 Seguridad

### Row Level Security (RLS)

Ya configurado en el SQL:
- Usuarios solo ven sus datos
- Políticas aplicadas automáticamente
- Seguridad a nivel de base de datos

### Variables de Entorno

**Importante**: No subas `.env` a GitHub

```env
VITE_SUPABASE_URL=tu-url
VITE_SUPABASE_ANON_KEY=tu-key
```

## 🐛 Troubleshooting

### Error: "Missing Supabase URL or Anon Key"
- Verifica que `.env` existe
- Reinicia el servidor dev
- Revisa que las variables empiecen con `VITE_`

### Error: "RLS policy violation"
- Verifica que el usuario esté autenticado
- Revisa las políticas en Supabase
- Usa el SQL Editor para ajustar

### Datos no aparecen
- Verifica que SQL se ejecutó
- Revisa Table Editor
- Verifica logs en Supabase

## 📝 Archivos de Ejemplo

### .env (crear manualmente)

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## ✅ Checklist de Migración

- [ ] Proyecto creado en Supabase
- [ ] Credenciales copiadas
- [ ] `.env` configurado
- [ ] SQL ejecutado
- [ ] Tablas verificadas
- [ ] Store cambiado (opcional)
- [ ] Registro probado
- [ ] Login probado
- [ ] Datos en Supabase

## 🎉 Listo

Una vez configurado Supabase, tendrás:
- ✅ Base de datos en la nube
- ✅ Autenticación robusta
- ✅ Sincronización automática
- ✅ Backup automático
- ✅ Escalabilidad asegurada

---

**¡Configura Supabase y disfruta de las ventajas!** 🚀

