-- ============================================================
-- SCRIPT SQL PARA CONFIGURAR BASE DE DATOS EN SUPABASE
-- Reto-Rico PWA - Tablas y Configuración
-- ============================================================
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Abre "SQL Editor" en el menú lateral
-- 3. Click "New Query"
-- 4. Copia y pega TODO este contenido
-- 5. Click "Run" para ejecutar
-- ============================================================

-- ============================================================
-- 1. TABLA DE PERFILES DE USUARIO
-- ============================================================
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

-- ============================================================
-- 2. TABLA DE INVERSIONES
-- ============================================================
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

-- ============================================================
-- 3. TABLA DE ACTIVIDADES
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 4. TABLA DE COMISIONES
-- ============================================================
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

-- ============================================================
-- 5. HABILITAR ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. POLÍTICAS DE SEGURIDAD - PROFILES
-- ============================================================
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 7. POLÍTICAS DE SEGURIDAD - INVESTMENTS
-- ============================================================
CREATE POLICY "Users can view own investments" ON investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 8. POLÍTICAS DE SEGURIDAD - ACTIVITIES
-- ============================================================
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 9. POLÍTICAS DE SEGURIDAD - COMMISSIONS
-- ============================================================
CREATE POLICY "Users can view own commissions" ON commissions
  FOR SELECT USING (auth.uid() = referrer_id);

-- ============================================================
-- 10. FUNCIÓN PARA ACTUALIZAR UPDATED_AT AUTOMÁTICAMENTE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- 11. TRIGGERS PARA UPDATED_AT
-- ============================================================
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 12. FUNCIÓN PARA INCREMENTAR REFERRALS
-- ============================================================
CREATE OR REPLACE FUNCTION increment_referrals(referral_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET referrals = referrals + 1 
  WHERE profiles.referral_code = increment_referrals.referral_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ¡COMPLETADO! BASES DE DATOS CONFIGURADA
-- ============================================================
-- Verifica en la tabla que las tablas se crearon correctamente:
-- - profiles
-- - investments  
-- - activities
-- - commissions
-- ============================================================

