ALTER TABLE tabla_reserva ADD COLUMN IF NOT EXISTS cantidad_personas INTEGER;

UPDATE tabla_reserva
SET cantidad_personas = 2
WHERE cantidad_personas IS NULL;

ALTER TABLE tabla_reserva
    ALTER COLUMN cantidad_personas SET DEFAULT 2,
    ALTER COLUMN cantidad_personas SET NOT NULL;
