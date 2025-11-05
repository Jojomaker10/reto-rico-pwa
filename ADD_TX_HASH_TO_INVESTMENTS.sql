-- Agregar columna tx_hash a la tabla investments
-- Ejecutar en Supabase SQL Editor

-- Verificar si la columna ya existe antes de agregarla
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'investments' 
    AND column_name = 'tx_hash'
  ) THEN
    ALTER TABLE investments ADD COLUMN tx_hash TEXT;
    CREATE INDEX IF NOT EXISTS idx_investments_tx_hash ON investments(tx_hash);
    RAISE NOTICE 'Columna tx_hash agregada exitosamente a investments';
  ELSE
    RAISE NOTICE 'La columna tx_hash ya existe en investments';
  END IF;
END $$;

