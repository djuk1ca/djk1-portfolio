-- Inquiries sent through the contact form. `types` is a JSON array of project types.
CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  types TEXT NOT NULL,
  timeline TEXT,
  message TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  emailed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_inquiries_ip_created ON inquiries(ip_hash, created_at);
