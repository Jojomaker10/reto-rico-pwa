# 🔧 Crear Archivo .env - Instrucciones Rápidas

## ⚠️ Problema: Página en Blanco

Si ves una página en blanco, probablemente es porque falta el archivo `.env` con las credenciales de Supabase.

## ✅ Solución Rápida

### Paso 1: Crear el archivo `.env`

En la raíz del proyecto (donde está `package.json`), crea un archivo llamado `.env` (sin extensión)

### Paso 2: Agregar las credenciales

Abre el archivo `.env` y pega esto (las credenciales ya están en `CONFIGURAR_SUPABASE_AQUI.md`):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=tu_supabase_key_aqui
```

### Paso 3: Reiniciar el servidor

1. Detén el servidor (Ctrl+C en la terminal)
2. Ejecuta de nuevo: `npm run dev`
3. Recarga la página en el navegador

## 🔍 Verificar

Abre la consola del navegador (F12) y busca:
- ✅ Si ves "🚀 Aplicación iniciando..." → La app se está cargando
- ✅ Si ves "✅ App component renderizando..." → React está funcionando
- ⚠️ Si ves errores en rojo → Compártelos para ayudarte

## 📝 Nota

La app ahora funciona aunque Supabase no esté configurado (mostrará advertencias pero no se romperá). Sin embargo, para usar autenticación y base de datos, necesitas el archivo `.env`.

