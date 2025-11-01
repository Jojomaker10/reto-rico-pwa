-- ============================================================
-- TABLA DE RETIROS (WITHDRAWALS)
-- Ejecuta este SQL en Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. CREAR TABLA DE RETIROS
-- ============================================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  admin_notes TEXT
);

-- ============================================================
-- 2. HABILITAR ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. POLÍTICAS DE SEGURIDAD
-- ============================================================

-- Users can view own withdrawals
CREATE POLICY "Users can view own withdrawals" ON withdrawals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own withdrawals
CREATE POLICY "Users can insert own withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own withdrawals (limited)
CREATE POLICY "Users can update own withdrawals" ON withdrawals
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (status = 'pendiente'); -- Only allow updates when pending

-- ============================================================
-- 4. TRIGGER PARA UPDATED_AT
-- ============================================================
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);

-- ============================================================
-- ¡COMPLETADO!
-- ============================================================
-- Verifica con:
-- SELECT * FROM withdrawals;
-- ============================================================

