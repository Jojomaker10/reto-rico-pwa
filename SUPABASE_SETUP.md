# 🔗 Configuración de Supabase para Reto-Rico PWA

## 📋 Pasos para Conectar con Supabase

### Paso 1: Crear Proyecto en Supabase

1. **Ir a Supabase**:
   - Abre tu navegador y ve a [supabase.com](https://supabase.com)
   - Inicia sesión o crea una cuenta

2. **Crear nuevo proyecto**:
   - Click en "New Project"
   - Nombre del proyecto: `reto-rico-pwa`
   - Base de datos password: (guarda esta contraseña)
   - Región: La más cercana a Chile
   - Click "Create new project"

### Paso 2: Obtener Credenciales

1. **Ir a Project Settings**:
   - En tu proyecto, ve a Settings (⚙️ icono)
   - Selecciona "API" en el menú lateral

2. **Copiar credenciales**:
   - **Project URL**: Cópiala
   - **anon public key**: Cópiala

### Paso 3: Configurar Variables de Entorno

1. **Crear archivo .env**:
   ```bash
   # En la raíz del proyecto, crea un archivo llamado: .env
   ```

2. **Agregar credenciales**:
   ```env
   VITE_SUPABASE_URL=tu-project-url-here.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-here
   ```

   **Ejemplo real**:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
   ```

### Paso 4: Crear Tablas en Supabase

1. **Ir a SQL Editor**:
   - En tu proyecto Supabase, ve a "SQL Editor"
   - Click "New Query"

2. **Ejecutar este SQL**:
   ```sql
   -- Tabla de usuarios
   CREATE TABLE IF NOT EXISTS profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     phone TEXT,
     referral_code TEXT UNIQUE NOT NULL,
     referred_by TEXT REFERENCES profiles(referral_code),
     balance DECIMAL(10,2) DEFAULT 0,
     invested DECIMAL(10,2) DEFAULT 0,
     earnings DECIMAL(10,2) DEFAULT 0,
     referrals INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Tabla de inversiones
   CREATE TABLE IF NOT EXISTS investments (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     pack_type TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     status TEXT DEFAULT 'pendiente_verificacion',
     payment_method TEXT,
     proof_file TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Tabla de actividades
   CREATE TABLE IF NOT EXISTS activities (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     type TEXT NOT NULL,
     description TEXT NOT NULL,
     amount DECIMAL(10,2) DEFAULT 0,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Tabla de comisiones
   CREATE TABLE IF NOT EXISTS commissions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
     amount DECIMAL(10,2) NOT NULL,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW(),
     paid_at TIMESTAMP
   );

   -- Políticas RLS (Row Level Security)
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
   ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

   -- Políticas para profiles
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Políticas para investments
   CREATE POLICY "Users can view own investments" ON investments
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own investments" ON investments
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Políticas para activities
   CREATE POLICY "Users can view own activities" ON activities
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own activities" ON activities
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Políticas para commissions
   CREATE POLICY "Users can view own commissions" ON commissions
     FOR SELECT USING (auth.uid() = referrer_id);

   -- Función para actualizar updated_at automáticamente
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   -- Triggers para updated_at
   CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

   CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   ```

3. **Click "Run"** para ejecutar el SQL

### Paso 5: Configurar Autenticación en Supabase

1. **Ir a Authentication**:
   - En tu proyecto, ve a "Authentication"
   - Configura providers si lo deseas (por ahora email/password está habilitado por defecto)

2. **Configurar Email Templates** (opcional):
   - Customize los emails de confirmación
   - Configura reset password emails

### Paso 6: Verificar Configuración

1. **Reiniciar dev server**:
   ```bash
   npm run dev
   ```

2. **Probar registro**:
   - Ve a la página de registro
   - Prueba crear una cuenta
   - Debería aparecer en Supabase Auth

## 📊 Estructura de Base de Datos

### Tablas Creadas:

1. **profiles**
   - Información de usuarios
   - Referral codes
   - Balance y estadísticas

2. **investments**
   - Paquetes de inversión
   - Montos y estados
   - Comprobantes

3. **activities**
   - Historial de movimientos
   - Transacciones

4. **commissions**
   - Comisiones de referidos
   - Estados de pago

## 🔒 Seguridad (RLS)

- **Row Level Security** habilitado en todas las tablas
- Usuarios solo pueden ver/modificar sus propios datos
- Políticas configuradas automáticamente

## 🔄 Próximos Pasos

Después de configurar Supabase:

1. Actualizar `src/store/authStore.js` para usar Supabase
2. Migrar funciones de almacenamiento local a Supabase
3. Implementar real-time para actualizaciones automáticas
4. Configurar webhooks si es necesario

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## ⚠️ Importante

- **NO subas** el archivo `.env` a GitHub
- **NO compartas** tus credenciales de Supabase
- `.env.example` está en el repo como template
- Agrega `.env` a `.gitignore` (ya está incluido)

---

**¡Configura Supabase siguiendo estos pasos!** 🚀

