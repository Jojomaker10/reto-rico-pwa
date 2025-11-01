# Reto-Rico PWA 🚀💰

Una Progressive Web App moderna y atractiva para generar ingresos a través de packs de inversión.

## Características ✨

- **Landing Page Moderna**: Diseño atractivo con gradientes verde/dorado
- **Tres Packs de Inversión**:
  - Pack Inicio: Invita amigos y gana 10,000 CLP
  - Pack Trading: Gana 10% semanal
  - Pack Crypto: Multiplica x3 en 2 meses
- **Sistema de Autenticación Completo**:
  - Registro con validación en tiempo real
  - Login con "Recordarme"
  - Recuperación de contraseña
  - Códigos de referido únicos
  - Dashboard personalizado
- **Flujo de Inversión**:
  - Selección de packs con calculadoras
  - Modal de confirmación de inversión
  - Datos bancarios integrados
  - Subida de comprobante de pago
  - Almacenamiento en IndexedDB
- **Sistema de Referidos**:
  - Dashboard de referidos completo
  - Comisiones automáticas del 10%
  - Sistema de niveles y badges (Bronce, Plata, Oro, Platino)
  - Gráficos de rendimiento mensual
  - Compartir en redes sociales
  - Almacenamiento compartido
- **Animaciones Suaves**: Efectos de scroll y transiciones fluidas
- **Diseño Responsivo**: Funciona en todos los dispositivos
- **PWA Ready**: Instálala en cualquier dispositivo
- **Almacenamiento Seguro**: IndexedDB (NO localStorage)

## Tecnologías 🛠️

- **React 18** - Framework frontend
- **Vite** - Build tool ultra rápido
- **Tailwind CSS** - Estilos modernos
- **Lucide React** - Iconos elegantes
- **Vite PWA Plugin** - Funcionalidad PWA
- **React Router** - Navegación y rutas
- **Zustand** - Gestión de estado
- **IndexedDB** - Almacenamiento persistente
- **Recharts** - Visualización de datos y gráficos

## Instalación 📦

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## Uso 🚀

### Rutas Disponibles

- `/` - Landing page principal
- `/login` - Iniciar sesión
- `/register` - Crear cuenta nueva
- `/forgot-password` - Recuperar contraseña
- `/select-pack` - Seleccionar pack de inversión
- `/dashboard` - Panel protegido del usuario
- `/referrals` - Sistema de referidos y comisiones

### Características de Autenticación

1. **Registro**: Completa el formulario para crear tu cuenta
   - Se genera automáticamente un código de referido único
   - Valida códigos de referido en tiempo real
   - Requiere aceptar términos y condiciones

2. **Login**: Accede con email y contraseña
   - Opción "Recordarme" para mantener sesión
   - Enlace para recuperar contraseña

3. **Dashboard**: Panel personalizado completo
   - Header con navegación y menú
   - 4 Cards de resumen (Balance, Pack, Ganancias, Referidos)
   - Sección "Mi Pack Activo" con progreso visual por tipo
   - Código de referido con compartir social (WhatsApp, Telegram, Facebook)
   - Gráfico de rendimiento con Recharts
   - Tabla de historial de actividad
   - Estadísticas rápidas (bonus)

### Almacenamiento

- ✅ Usa **IndexedDB** (NO localStorage)
- ✅ Compatible con PWA
- ✅ Persistencia offline
- ✅ Datos seguros y persistentes

## Estructura del Proyecto 📁

```
reto-rico-starter-1/
├── public/
│   ├── manifest.json      # Configuración PWA
│   └── icons/             # Iconos PWA
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Página de login
│   │   ├── Register.jsx          # Página de registro
│   │   ├── ForgotPassword.jsx    # Recuperación
│   │   ├── SelectPack.jsx        # Selección de packs
│   │   └── Dashboard.jsx         # Dashboard protegido
│   ├── components/
│   │   ├── Hero.jsx                  # Sección hero principal
│   │   ├── PackCard.jsx             # Tarjetas de packs
│   │   ├── Benefits.jsx             # Beneficios
│   │   ├── Footer.jsx               # Pie de página
│   │   ├── NavBar.jsx               # Barra de navegación
│   │   ├── ProtectedRoute.jsx       # Rutas protegidas
│   │   └── ConfirmInvestmentModal.jsx # Modal confirmación
│   ├── store/
│   │   └── authStore.js      # Estado de autenticación
│   ├── utils/
│   │   └── storage.js        # Almacenamiento seguro
│   ├── App.jsx               # Routing principal
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globales
├── index.html             # HTML principal
├── package.json           # Dependencias
├── vite.config.js         # Configuración Vite
└── tailwind.config.js     # Configuración Tailwind
```

## Diseño 🎨

- **Colores Principales**: Verde (#16a34a) y Dorado (#fbbf24)
- **Gradientes**: Desde fondos oscuros hasta verdes brillantes
- **Animaciones**: Fade-in, slide-up, float
- **Tipografía**: Moderna y legible

## Características PWA 🔔

- Instalable en cualquier dispositivo
- Funciona offline (con service worker)
- Iconos optimizados para todas las plataformas
- Splash screen personalizado

### Nota sobre Iconos PWA 📌

Para completar la configuración de PWA, necesitas agregar iconos en la carpeta `public/`:
- `icon-192.png` (192x192 píxeles)
- `icon-512.png` (512x512 píxeles)

Puedes generar estos iconos usando herramientas online como:
- [Favicon Generator](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)

Sugerencia de diseño: Logo "R" o símbolo de dólar ($) con fondo verde (#16a34a) y dorado (#fbbf24)

## Licencia 📄

MIT License

## Contacto 📧

Para más información, visita nuestro sitio web o contacta al equipo.

---

**Reto-Rico** - Tu camino hacia ingresos extra 💰

