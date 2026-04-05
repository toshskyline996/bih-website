-- BIH Inventory System — Initial Schema
-- Run: npx wrangler d1 execute bih-inventory --remote --file=migrations/0001_inventory_init.sql

CREATE TABLE IF NOT EXISTS inventory_skus (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  model      TEXT,
  category   TEXT,
  notes      TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS inventory_units (
  id           TEXT PRIMARY KEY,
  sku_id       TEXT NOT NULL REFERENCES inventory_skus(id),
  label_id     TEXT NOT NULL UNIQUE,
  status       TEXT NOT NULL DEFAULT 'in_stock'
                 CHECK (status IN ('in_stock','reserved','sold','damaged')),
  location     TEXT DEFAULT 'main',
  cost_cad     REAL,
  arrived_at   INTEGER DEFAULT (unixepoch()),
  sold_at      INTEGER,
  notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_units_sku    ON inventory_units(sku_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON inventory_units(status);
CREATE INDEX IF NOT EXISTS idx_units_label  ON inventory_units(label_id);
