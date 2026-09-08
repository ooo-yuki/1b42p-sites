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
-- кошелёк sasi42io (коины за игры: floor(score/3))
CREATE TABLE IF NOT EXISTS sasi_wallet (
  site VARCHAR(64) NOT NULL DEFAULT 'sasi42io',
  name VARCHAR(20) NOT NULL,
  coins BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (site, name)
);
-- инвентарь магазина sasi42io
CREATE TABLE IF NOT EXISTS sasi_items (
  site VARCHAR(64) NOT NULL DEFAULT 'sasi42io',
  name VARCHAR(20) NOT NULL,
  item VARCHAR(32) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1 CHECK (qty >= 0),
  PRIMARY KEY (site, name, item)
);
-- миграция: склейка дублей (оставить MAX(score), при равенстве — старший id),
-- затем UNIQUE(site,name) и засев кошельков floor(best/3) без перезаписи
DELETE FROM sasi_records a USING sasi_records b
  WHERE a.site = b.site AND a.name = b.name
    AND (a.score < b.score OR (a.score = b.score AND a.id < b.id));
DO $$ BEGIN
  ALTER TABLE sasi_records ADD CONSTRAINT uq_sasi_records_site_name UNIQUE (site, name);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
INSERT INTO sasi_wallet (site, name, coins)
  SELECT site, name, (FLOOR(MAX(score) / 3))::BIGINT FROM sasi_records GROUP BY site, name
  ON CONFLICT (site, name) DO NOTHING;
