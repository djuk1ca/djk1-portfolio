-- Inquiries sent through the contact form. `types` is a JSON array of project types.
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  types TEXT NOT NULL,
  timeline TEXT,
  message TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  -- 0 = sent without a Turnstile token (no JavaScript): kept, not emailed; review with wrangler d1 execute.
  verified INTEGER NOT NULL DEFAULT 1,
  emailed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inquiries_ip_created ON inquiries(ip_hash, created_at);
