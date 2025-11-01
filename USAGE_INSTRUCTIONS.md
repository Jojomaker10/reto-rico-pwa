# 📖 Instrucciones de Uso - Reto-Rico PWA

## 🚀 Inicio Rápido

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Ejecutar en Desarrollo
```bash
npm run dev
```
Abre tu navegador en: `http://localhost:5173`

### Paso 3: Ver Resultado
Navega por la aplicación y verifica todas las secciones funcionando correctamente.

## 📱 Prueba la PWA

### En Navegador Desktop
1. Abre Chrome o Edge
2. Ve a `http://localhost:5173`
3. Abre DevTools (F12)
4. Ve a la pestaña "Application" → "Service Workers"
5. Verifica que el service worker está registrado

### En Mobile
1. Abre la URL en tu dispositivo móvil (misma red)
2. Chrome Android: Menu → "Add to Home Screen"
3. iOS Safari: Botón Compartir → "Add to Home Screen"

## 🎨 Características a Explorar

### 1. Hero Section
- Logo animado con efecto hover
- Eslogan con gradiente de texto
- Botones CTA con efectos
- Elementos flotantes decorativos
- Indicador de scroll

### 2. Packs de Inversión
- **Pack Inicio** (Azul): Gratis, invita amigos
- **Pack Trading** (Verde): Recomendado, 10% semanal
- **Pack Crypto** (Morado): Mínimo 100K, x3 en 2 meses

**Efectos a probar:**
- Hover sobre las tarjetas
- Animación de iconos
- Badge "Recomendado" en Pack Trading

### 3. Beneficios
- 6 tarjetas con iconos
- Estadísticas en tiempo real
- Indicadores de confianza
- Efectos hover en cada elemento

### 4. Footer
- Enlaces funcionales (actualmente #)
- Iconos de redes sociales
- Información de contacto

## 🛠️ Comandos Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build optimizado para producción
npm run build

# Preview del build de producción
npm run preview

# Ver archivos generados
ls dist/
```

## 📊 Estructura de Rutas (Futuro)

Actualmente es una Single Page Application (SPA), pero puedes agregar:

```
/                    # Landing page actual
/dashboard           # Dashboard del usuario
/register            # Registro de usuarios
/login               # Inicio de sesión
/packs/:id           # Detalle de cada pack
/profile             # Perfil del usuario
/transactions        # Historial de transacciones
```

## 🎯 Personalización

### Colores
Edita `tailwind.config.js`:
```js
colors: {
  'gold': '#fbbf24',          // Tu color dorado
  'green-money': '#16a34a',   // Tu color verde
}
```

### Contenido
Edita `src/App.jsx` para cambiar:
- Nombres de packs
- Precios y cantidades
- Descripciones

### Iconos
Edita `src/components/`:
- Usa diferentes iconos de Lucide React
- Importa desde: `lucide-react`

## 🔍 Debugging

### Problemas Comunes

**Error: Module not found**
```bash
npm install
```

**Estilos no cargan**
```bash
# Verifica tailwind.config.js
# Limpia cache: rm -rf node_modules/.vite
```

**PWA no funciona**
```bash
# Verifica vite.config.js
# Revisa manifest.json
# Genera iconos faltantes
```

### Logs
```bash
# Ver logs de Vite
npm run dev -- --debug

# Ver build info
npm run build -- --debug
```

## 📦 Agregar Nuevas Funcionalidades

### Agregar un Nuevo Componente
```bash
# Crear archivo en src/components/
touch src/components/NewComponent.jsx

# Importar en App.jsx
import NewComponent from './components/NewComponent'
```

### Agregar una Nueva Ruta (con React Router)
```bash
npm install react-router-dom

# Configura en main.jsx
import { BrowserRouter } from 'react-router-dom'
```

## 🎨 Customización Avanzada

### Agregar Nuevas Animaciones
En `tailwind.config.js`:
```js
keyframes: {
  tuAnimacion: {
    '0%': { /* ... */ },
    '100%': { /* ... */ },
  }
}
```

### Agregar Nuevos Iconos
```jsx
import { TuIcono } from 'lucide-react'
```

## 📱 Testing PWA

### Lighthouse Audit
1. Abre Chrome DevTools
2. Ve a Lighthouse
3. Selecciona "Progressive Web App"
4. Click en "Generate report"

**Métricas a verificar:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- PWA: > 90

## 🚢 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Arrastra la carpeta dist a netlify.com
```

### GitHub Pages
```bash
# Agrega en package.json
"homepage": "https://tu-usuario.github.io/reto-rico-pwa"

# Deploy
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## 📚 Recursos Adicionales

- [Documentación React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite](https://vitejs.dev)
- [PWA Guide](https://web.dev/progressive-web-apps)

---

**¡Disfruta construyendo con Reto-Rico!** 💰🚀

