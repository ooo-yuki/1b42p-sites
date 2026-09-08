-- 1Б42П ТРЕКЕР — кто где сидит (Postgres, база tracker42)
CREATE TABLE IF NOT EXISTS track_sessions (
  sid CHAR(32) PRIMARY KEY,
  site VARCHAR(64) NOT NULL DEFAULT 'hub',
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_track_last ON track_sessions (last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_track_site ON track_sessions (site);
-- минутные срезы онлайна для графиков и рекорда
CREATE TABLE IF NOT EXISTS track_history (
  ts TIMESTAMPTZ PRIMARY KEY,
  per_site JSONB NOT NULL DEFAULT '{}',
  total INTEGER NOT NULL DEFAULT 0
);
-- рекорды sasi42io (таблица рекордов топ-10)
CREATE TABLE IF NOT EXISTS sasi_records (
  id SERIAL PRIMARY KEY,
  site VARCHAR(64) NOT NULL DEFAULT 'sasi42io',
  name VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 9999999),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sasi_records_site_score ON sasi_records (site, score DESC);
