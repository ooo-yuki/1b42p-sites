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
