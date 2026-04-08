-- BIH Shipments Database Schema
-- Table: shipments - Records all outgoing container notifications

CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL,
    container_number TEXT NOT NULL,
    carrier TEXT,
    origin TEXT,
    destination TEXT,
    eta_date TEXT,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    tracking_url TEXT,
    notes TEXT,
    notified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments (order_number);
CREATE INDEX IF NOT EXISTS idx_shipments_container ON shipments (container_number);
CREATE INDEX IF NOT EXISTS idx_shipments_email ON shipments (customer_email);
