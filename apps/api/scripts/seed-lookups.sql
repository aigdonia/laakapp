-- Seed: Lookups (run once)
-- Extracts inline segment options from asset class fields into the lookups table,
-- then migrates asset class fields from type "segment" to "lookup:<category>".

-- ─── 1. Insert lookup values ────────────────────────────────────

-- Currencies (used by all asset classes)
INSERT OR IGNORE INTO lookups (id, category, label, value, metadata, "order", enabled, translations)
VALUES
  ('lk-cur-egp', 'currencies', 'EGP', 'EGP', '{"symbol":"E£","flag":"🇪🇬"}', 0, 1, '{"ar":{"label":"جنيه مصري"},"ms":{"label":"Pound Mesir"}}'),
  ('lk-cur-usd', 'currencies', 'USD', 'USD', '{"symbol":"$","flag":"🇺🇸"}',  1, 1, '{"ar":{"label":"دولار أمريكي"},"ms":{"label":"Dolar AS"}}'),
  ('lk-cur-sar', 'currencies', 'SAR', 'SAR', '{"symbol":"﷼","flag":"🇸🇦"}',  2, 1, '{"ar":{"label":"ريال سعودي"},"ms":{"label":"Riyal Saudi"}}'),
  ('lk-cur-aed', 'currencies', 'AED', 'AED', '{"symbol":"د.إ","flag":"🇦🇪"}', 3, 1, '{"ar":{"label":"درهم إماراتي"},"ms":{"label":"Dirham UAE"}}'),
  ('lk-cur-eur', 'currencies', 'EUR', 'EUR', '{"symbol":"€","flag":"🇪🇺"}',   4, 1, '{"ar":{"label":"يورو"},"ms":{"label":"Euro"}}'),
  ('lk-cur-gbp', 'currencies', 'GBP', 'GBP', '{"symbol":"£","flag":"🇬🇧"}',   5, 1, '{"ar":{"label":"جنيه إسترليني"},"ms":{"label":"Paun Sterling"}}'),
  ('lk-cur-myr', 'currencies', 'MYR', 'MYR', '{"symbol":"RM","flag":"🇲🇾"}',  6, 1, '{"ar":{"label":"رينغيت ماليزي"},"ms":{"label":"Ringgit Malaysia"}}');

-- Gold Units
INSERT OR IGNORE INTO lookups (id, category, label, value, metadata, "order", enabled, translations)
VALUES
  ('lk-gu-g',    'gold-units', 'Gram',  'g',    '{}', 0, 1, '{"ar":{"label":"جرام"},"ms":{"label":"Gram"}}'),
  ('lk-gu-oz',   'gold-units', 'Ounce', 'oz',   '{}', 1, 1, '{"ar":{"label":"أونصة"},"ms":{"label":"Auns"}}'),
  ('lk-gu-tola', 'gold-units', 'Tola',  'tola', '{}', 2, 1, '{"ar":{"label":"تولة"},"ms":{"label":"Tola"}}');

-- Gold Purity
INSERT OR IGNORE INTO lookups (id, category, label, value, metadata, "order", enabled, translations)
VALUES
  ('lk-gp-24k', 'gold-purity', '24K', '24K', '{"fineness":"999"}', 0, 1, '{"ar":{"label":"عيار 24"},"ms":{"label":"24K"}}'),
  ('lk-gp-22k', 'gold-purity', '22K', '22K', '{"fineness":"916"}', 1, 1, '{"ar":{"label":"عيار 22"},"ms":{"label":"22K"}}'),
  ('lk-gp-21k', 'gold-purity', '21K', '21K', '{"fineness":"875"}', 2, 1, '{"ar":{"label":"عيار 21"},"ms":{"label":"21K"}}'),
  ('lk-gp-18k', 'gold-purity', '18K', '18K', '{"fineness":"750"}', 3, 1, '{"ar":{"label":"عيار 18"},"ms":{"label":"18K"}}');

-- ─── 2. Migrate asset class fields: segment → lookup:<category> ─

-- Stocks: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[5].type', 'lookup:currencies',
  '$[5].options', json('null')
) WHERE id = 'ac-stocks' AND json_extract(fields, '$[5].type') = 'segment' AND json_extract(fields, '$[5].key') = 'currency';

-- ETFs: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[5].type', 'lookup:currencies',
  '$[5].options', json('null')
) WHERE id = 'ac-etfs' AND json_extract(fields, '$[5].type') = 'segment' AND json_extract(fields, '$[5].key') = 'currency';

-- Sukuk: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[3].type', 'lookup:currencies',
  '$[3].options', json('null')
) WHERE id = 'ac-sukuk' AND json_extract(fields, '$[3].type') = 'segment' AND json_extract(fields, '$[3].key') = 'currency';

-- Crypto: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[4].type', 'lookup:currencies',
  '$[4].options', json('null')
) WHERE id = 'ac-crypto' AND json_extract(fields, '$[4].type') = 'segment' AND json_extract(fields, '$[4].key') = 'currency';

-- Gold: unit[1] → lookup:gold-units, purity[2] → lookup:gold-purity, currency[4] → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[1].type', 'lookup:gold-units',
  '$[1].options', json('null'),
  '$[2].type', 'lookup:gold-purity',
  '$[2].options', json('null'),
  '$[4].type', 'lookup:currencies',
  '$[4].options', json('null')
) WHERE id = 'ac-gold'
  AND json_extract(fields, '$[1].key') = 'unit'
  AND json_extract(fields, '$[2].key') = 'purity'
  AND json_extract(fields, '$[4].key') = 'currency';

-- Cash: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[1].type', 'lookup:currencies',
  '$[1].options', json('null')
) WHERE id = 'ac-cash' AND json_extract(fields, '$[1].type') = 'segment' AND json_extract(fields, '$[1].key') = 'currency';

-- Real Estate: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[2].type', 'lookup:currencies',
  '$[2].options', json('null')
) WHERE id = 'ac-real-estate' AND json_extract(fields, '$[2].type') = 'segment' AND json_extract(fields, '$[2].key') = 'currency';

-- Other: currency segment → lookup:currencies
UPDATE asset_classes SET fields = json_replace(
  fields,
  '$[3].type', 'lookup:currencies',
  '$[3].options', json('null')
) WHERE id = 'ac-other' AND json_extract(fields, '$[3].type') = 'segment' AND json_extract(fields, '$[3].key') = 'currency';

-- ─── 3. Clean up: remove null options keys left by json_replace ─
-- json_replace sets the value to JSON null but keeps the key.
-- We use json_remove to strip the options key from lookup-type fields.
-- This is safe because lookup-type fields should never have options stored.

UPDATE asset_classes SET fields = (
  SELECT json_group_array(
    CASE
      WHEN json_extract(value, '$.type') LIKE 'lookup:%'
        THEN json_remove(value, '$.options')
      ELSE value
    END
  )
  FROM json_each(fields)
) WHERE fields LIKE '%lookup:%';
