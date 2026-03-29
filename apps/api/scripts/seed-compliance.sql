-- Seed haram sectors into lookups table
INSERT OR IGNORE INTO lookups (id, category, label, value, metadata, "order", enabled)
VALUES
  (lower(hex(randomblob(16))), 'haram_sectors', 'Conventional Banking', 'conventional_banking', '{}', 1, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Alcohol', 'alcohol', '{}', 2, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Gambling', 'gambling', '{}', 3, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Pork', 'pork', '{}', 4, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Tobacco', 'tobacco', '{}', 5, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Weapons', 'weapons', '{}', 6, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Adult Entertainment', 'adult_entertainment', '{}', 7, 1),
  (lower(hex(randomblob(16))), 'haram_sectors', 'Conventional Insurance', 'conventional_insurance', '{}', 8, 1);

-- Seed initial data sources
INSERT OR IGNORE INTO data_sources (id, name, slug, type, url_template, country_codes, config, rate_limit_ms, max_retries, enabled)
VALUES
  (lower(hex(randomblob(16))), 'StockAnalysis.com', 'stockanalysis', 'scraper',
   'https://stockanalysis.com/quote/{exchange}/{symbol}/financials/balance-sheet/',
   '["EG","SA","MY"]', '{"parser":"stockanalysis"}', 3000, 3, 1),
  (lower(hex(randomblob(16))), 'Mubasher Info', 'mubasher', 'scraper',
   'https://www.mubasher.info/api/1/listed-entity/financial-statement/{symbol}',
   '["EG","SA"]', '{"parser":"mubasher"}', 3000, 3, 1),
  (lower(hex(randomblob(16))), 'EGX33 Shariah Index', 'egx33-shariah', 'index_list',
   'https://www.egx.com.eg/en/indexconstituents.aspx?IndexID=12',
   '["EG"]', '{"parser":"egx-index"}', 5000, 3, 1),
  (lower(hex(randomblob(16))), 'SC Malaysia Shariah List', 'sc-malaysia', 'index_list',
   '', '["MY"]', '{"parser":"sc-malaysia-pdf"}', 5000, 3, 1),
  (lower(hex(randomblob(16))), 'ICAP Saudi Shariah List', 'icap-saudi', 'index_list',
   '', '["SA"]', '{"parser":"icap-saudi-pdf"}', 5000, 3, 1);
