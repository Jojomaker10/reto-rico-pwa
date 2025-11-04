-- Crear tabla de depósitos
CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_usdt DECIMAL(18, 6) NOT NULL,
  amount_usd DECIMAL(18, 2) NOT NULL,
  tx_hash TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmations INTEGER DEFAULT 0,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de retiros
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address_destination TEXT NOT NULL,
  amount_usdt DECIMAL(18, 6) NOT NULL,
  amount_usd DECIMAL(18, 2) NOT NULL,
  fee DECIMAL(18, 6) NOT NULL DEFAULT 1.2,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'processing', 'completed', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de transferencias entrantes (para escaneo de depósitos)
CREATE TABLE IF NOT EXISTS incoming_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount_usdt DECIMAL(18, 6) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed')),
  processed_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de settings (configuración del sistema)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar columna wallet_address_deposit a profiles si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'wallet_address_deposit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wallet_address_deposit TEXT;
  END IF;
END $$;

-- Agregar columna balance_usd a profiles si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'balance_usd'
  ) THEN
    ALTER TABLE profiles ADD COLUMN balance_usd DECIMAL(18, 2) DEFAULT 0;
  END IF;
END $$;

-- Agregar columna locked_usd a profiles si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'locked_usd'
  ) THEN
    ALTER TABLE profiles ADD COLUMN locked_usd DECIMAL(18, 2) DEFAULT 0;
  END IF;
END $$;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_tx_hash ON deposits(tx_hash);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_incoming_transfers_status ON incoming_transfers(status);
CREATE INDEX IF NOT EXISTS idx_incoming_transfers_tx_hash ON incoming_transfers(tx_hash);

-- RLS Policies para deposits
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own deposits"
  ON deposits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all deposits"
  ON deposits FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies para withdrawals
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own withdrawals"
  ON withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawals"
  ON withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all withdrawals"
  ON withdrawals FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies para incoming_transfers
ALTER TABLE incoming_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all incoming transfers"
  ON incoming_transfers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies para settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage settings"
  ON settings FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_deposits_updated_at BEFORE UPDATE ON deposits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incoming_transfers_updated_at BEFORE UPDATE ON incoming_transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

