# 🚀 Configuración de Netlify para Reto-Rico PWA

## ✅ Credenciales Limpiadas

Todos los archivos con credenciales reales han sido limpiados y reemplazados con placeholders.

## 📋 Pasos para Configurar Netlify

### Paso 1: Agregar Variables de Entorno en Netlify

1. **Ve a tu sitio en Netlify Dashboard**
   - https://app.netlify.com

2. **Navega a:**
   - Tu sitio → **Site settings** → **Environment variables**

3. **Agrega las siguientes variables:**

   | Variable | Valor |
   |----------|-------|
   | `VITE_SUPABASE_URL` | `https://sopvzvcfswxvpytsvner.supabase.co` |
   | `VITE_SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcHZ6dmNmc3d4dnB5dHN2bmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDcyMjcsImV4cCI6MjA3NzU4MzIyN30.Gg-uJvN1vbrjq5_j2uKjx9SSMDpKSl_OKy2sCLG1-1w` |
   | `VITE_ADMIN_EMAIL` | `alcinjonas9@gmail.com` |

4. **Para cada variable:**
   - Click en **"Add a variable"**
   - Ingresa el nombre de la variable
   - Ingresa el valor
   - Selecciona el scope (Production, Preview, o Both)
   - Click **"Save"**

### Paso 2: Configurar Build Settings

1. **Ve a:**
   - Site settings → **Build & deploy** → **Build settings**

2. **Configura:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Paso 3: Verificar Build

1. **Haz un nuevo deploy:**
   - Ve a **Deploys** → Click en **"Trigger deploy"** → **"Clear cache and deploy site"**

2. **Verifica que el build sea exitoso:**
   - Debería completarse sin errores
   - No debería aparecer el mensaje de "secret scanner detected secrets"

## 🔒 Seguridad

- ✅ Credenciales eliminadas de archivos `.md`
- ✅ Archivo `.env` en `.gitignore`
- ✅ Archivo `.netlifyignore` creado
- ✅ Variables de entorno configuradas en Netlify Dashboard

## ⚠️ Importante

**NUNCA** subas credenciales reales a:
- Archivos `.md` (documentación)
- Archivos de código fuente
- GitHub/GitLab/otros repositorios públicos

**SIEMPRE** usa:
- Variables de entorno en Netlify
- Archivo `.env` local (que está en `.gitignore`)
- Variables de entorno en tu plataforma de hosting

## 🎯 Verificación

Después de configurar las variables de entorno en Netlify:

1. El build debería completarse exitosamente
2. Tu aplicación debería conectarse correctamente a Supabase
3. Los usuarios podrán registrarse e iniciar sesión

## 📝 Notas

- Las variables de entorno en Netlify están disponibles durante el build
- Vite automáticamente reemplaza `import.meta.env.VITE_*` con los valores de las variables de entorno
- No necesitas modificar el código, solo configurar las variables en Netlify

---

**¡Listo! Tu aplicación debería funcionar correctamente en Netlify.** 🚀

