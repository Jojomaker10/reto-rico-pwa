# ⚡ Inicio Rápido: Conectar con Supabase

## 🎯 3 Pasos para Empezar

### 1️⃣ Crear Proyecto en Supabase (5 minutos)

```
1. Ir a: https://supabase.com
2. Crear cuenta / Iniciar sesión
3. Click "New Project"
4. Nombre: reto-rico-pwa
5. Password de DB: (guarda esta contraseña)
6. Región: South America (São Paulo) o la más cercana
7. Click "Create new project"
```

Espera 2 minutos mientras se crea tu base de datos.

---

### 2️⃣ Copiar Credenciales (1 minuto)

```
1. En tu proyecto, ve a: Settings (⚙️) → API
2. Copia "Project URL"
3. Copia "anon public" key
```

---

### 3️⃣ Configurar Localmente (2 minutos)

**A. Crear archivo `.env`** en la raíz del proyecto:

```bash
# Copiar .env.example a .env
cp .env.example .env
```

**B. Editar `.env`** y pegar tus credenciales:

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**C. Ejecutar SQL**:
```
1. En Supabase, ve a "SQL Editor"
2. Click "New Query"
3. Abre el archivo SUPABASE_SQL.sql
4. Copia TODO el contenido
5. Pégalo en el editor
6. Click "Run"
```

**D. Reiniciar servidor**:
```bash
npm run dev
```

---

## ✅ ¡Listo! Testear

1. Ve a tu app: `http://localhost:5173`
2. Click "Registrarse"
3. Completa el formulario
4. Verifica en Supabase Dashboard:
   - Authentication → Users (debe aparecer tu usuario)
   - Table Editor → profiles (debe tener tus datos)

---

## 📚 Documentación Completa

- `SUPABASE_SETUP.md` - Guía detallada paso a paso
- `MIGRAR_A_SUPABASE.md` - Migración y ventajas
- `SUPABASE_SQL.sql` - Script SQL completo

---

## 🆘 Problemas Comunes

**No veo datos en Supabase**
- ¿Ejecutaste el SQL? ✓
- ¿Reiniciaste el servidor? ✓
- Revisa logs en: Supabase → Logs → API Logs

**Error de autenticación**
- Verifica que `.env` tiene las credenciales correctas
- Reinicia el servidor dev

**RLS Policy Error**
- Verifica que estás logueado
- Revisa las políticas en SQL

---

**¡En menos de 10 minutos tendrás Supabase funcionando!** 🚀

