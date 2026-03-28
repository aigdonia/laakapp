-- Seed: Exchange lookups (run once)
-- Converts the deleted markets table into lookup entries and
-- migrates asset class exchange fields from "text" to "lookup:exchanges".

-- ─── 1. Insert exchange lookup values ─────────────────────────

INSERT OR IGNORE INTO lookups (id, category, label, value, metadata, "order", enabled, translations)
VALUES
  ('lk-ex-egx',     'exchanges', 'Egyptian Exchange', 'EGX',     '{"country":"EG","flag":"🇪🇬"}', 0, 1, '{"ar":{"label":"البورصة المصرية"},"ms":{"label":"Bursa Mesir"}}'),
  ('lk-ex-tadawul', 'exchanges', 'Saudi Exchange',    'TADAWUL', '{"country":"SA","flag":"🇸🇦"}', 1, 1, '{"ar":{"label":"تداول"},"ms":{"label":"Bursa Saudi"}}'),
  ('lk-ex-bursa',   'exchanges', 'Bursa Malaysia',    'BURSA',   '{"country":"MY","flag":"🇲🇾"}', 2, 1, '{"ar":{"label":"بورصة ماليزيا"},"ms":{"label":"Bursa Malaysia"}}'),
  ('lk-ex-nyse',    'exchanges', 'New York Stock Exchange', 'NYSE',  '{"country":"US","flag":"🇺🇸"}', 3, 1, '{"ar":{"label":"بورصة نيويورك"},"ms":{"label":"Bursa Saham New York"}}'),
  ('lk-ex-nasdaq',  'exchanges', 'NASDAQ',            'NASDAQ',  '{"country":"US","flag":"🇺🇸"}', 4, 1, '{"ar":{"label":"ناسداك"},"ms":{"label":"NASDAQ"}}');

-- ─── 2. Migrate asset class fields: exchange text → lookup:exchanges ─

-- Stocks: exchange[2] text → lookup:exchanges
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[2].type', 'lookup:exchanges'
) WHERE id = 'ac-stocks'
  AND json_extract(fields, '$[2].key') = 'exchange'
  AND json_extract(fields, '$[2].type') = 'text';

-- ETFs: exchange[2] text → lookup:exchanges
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[2].type', 'lookup:exchanges'
) WHERE id = 'ac-etfs'
  AND json_extract(fields, '$[2].key') = 'exchange'
  AND json_extract(fields, '$[2].type') = 'text';
