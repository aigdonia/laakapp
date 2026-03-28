-- Seed: Stocks — Major stocks across EGX, TADAWUL, BURSA, NYSE, NASDAQ
-- Prices are approximate snapshots for dev/testing purposes

-- ─── EGX (Egypt) ────────────────────────────────────────────
INSERT OR IGNORE INTO stocks (id, symbol, name, country_code, exchange, sector, enabled, last_price, last_price_updated_at)
VALUES
  ('stock-comi', 'COMI', 'Commercial International Bank', 'EG', 'EGX', 'Financial Services', 1, 91.50, '2026-03-28T00:00:00.000Z'),
  ('stock-hrho', 'HRHO', 'EFG Hermes Holding', 'EG', 'EGX', 'Financial Services', 1, 33.00, '2026-03-28T00:00:00.000Z'),
  ('stock-tmgh', 'TMGH', 'Talaat Moustafa Group Holding', 'EG', 'EGX', 'Real Estate', 1, 65.00, '2026-03-28T00:00:00.000Z'),
  ('stock-swdy', 'SWDY', 'Elsewedy Electric', 'EG', 'EGX', 'Industrial', 1, 42.00, '2026-03-28T00:00:00.000Z'),
  ('stock-fwry', 'FWRY', 'Fawry for Banking Technology', 'EG', 'EGX', 'Technology', 1, 7.80, '2026-03-28T00:00:00.000Z'),
  ('stock-etel', 'ETEL', 'Telecom Egypt', 'EG', 'EGX', 'Telecom', 1, 32.50, '2026-03-28T00:00:00.000Z'),
  ('stock-east', 'EAST', 'Eastern Company', 'EG', 'EGX', 'Consumer Staples', 1, 28.00, '2026-03-28T00:00:00.000Z'),
  ('stock-orwe', 'ORWE', 'Oriental Weavers Carpet', 'EG', 'EGX', 'Consumer Discretionary', 1, 15.50, '2026-03-28T00:00:00.000Z'),
  ('stock-efid', 'EFID', 'E-Finance for Digital and Financial Investments', 'EG', 'EGX', 'Technology', 1, 28.00, '2026-03-28T00:00:00.000Z'),
  ('stock-edita', 'EDITA', 'Edita Food Industries', 'EG', 'EGX', 'Food & Beverage', 1, 22.50, '2026-03-28T00:00:00.000Z'),
  ('stock-jufo', 'JUFO', 'Juhayna Food Industries', 'EG', 'EGX', 'Food & Beverage', 1, 12.80, '2026-03-28T00:00:00.000Z'),
  ('stock-phdc', 'PHDC', 'Palm Hills Development Company', 'EG', 'EGX', 'Real Estate', 1, 8.50, '2026-03-28T00:00:00.000Z'),
  ('stock-clho', 'CLHO', 'Cleopatra Hospital Group', 'EG', 'EGX', 'Healthcare', 1, 7.20, '2026-03-28T00:00:00.000Z'),
  ('stock-isph', 'ISPH', 'Ibnsina Pharma', 'EG', 'EGX', 'Healthcare', 1, 14.50, '2026-03-28T00:00:00.000Z'),
  ('stock-oras', 'ORAS', 'Orascom Construction', 'EG', 'EGX', 'Construction & Engineering', 1, 58.00, '2026-03-28T00:00:00.000Z'),
  ('stock-esrs', 'ESRS', 'Ezz Steel', 'EG', 'EGX', 'Basic Materials', 1, 38.00, '2026-03-28T00:00:00.000Z'),
  ('stock-auto', 'AUTO', 'GB Auto', 'EG', 'EGX', 'Consumer Discretionary', 1, 6.50, '2026-03-28T00:00:00.000Z'),
  ('stock-abuk', 'ABUK', 'Abu Qir Fertilizers', 'EG', 'EGX', 'Chemicals', 1, 32.00, '2026-03-28T00:00:00.000Z'),
  ('stock-skpc', 'SKPC', 'Sidi Kerir Petrochemicals', 'EG', 'EGX', 'Chemicals', 1, 16.00, '2026-03-28T00:00:00.000Z'),
  ('stock-amoc', 'AMOC', 'Alexandria Mineral Oils Company', 'EG', 'EGX', 'Energy', 1, 8.50, '2026-03-28T00:00:00.000Z'),
  ('stock-mnhd', 'MNHD', 'Madinet Nasr Housing', 'EG', 'EGX', 'Real Estate', 1, 5.80, '2026-03-28T00:00:00.000Z'),
  ('stock-heli', 'HELI', 'Heliopolis Housing', 'EG', 'EGX', 'Real Estate', 1, 14.00, '2026-03-28T00:00:00.000Z'),
  ('stock-cich', 'CICH', 'CI Capital Holding', 'EG', 'EGX', 'Financial Services', 1, 7.50, '2026-03-28T00:00:00.000Z'),
  ('stock-ccap', 'CCAP', 'Carbon Holdings', 'EG', 'EGX', 'Chemicals', 1, 7.80, '2026-03-28T00:00:00.000Z'),
  ('stock-ekho', 'EKHO', 'Ekho for Real Estate Development', 'EG', 'EGX', 'Real Estate', 1, 3.20, '2026-03-28T00:00:00.000Z');

-- ─── TADAWUL (Saudi Arabia) ─────────────────────────────────
INSERT OR IGNORE INTO stocks (id, symbol, name, country_code, exchange, sector, enabled, last_price, last_price_updated_at)
VALUES
  ('stock-2222', '2222', 'Saudi Aramco', 'SA', 'TADAWUL', 'Energy', 1, 27.50, '2026-03-28T00:00:00.000Z'),
  ('stock-1120', '1120', 'Al Rajhi Bank', 'SA', 'TADAWUL', 'Financial Services', 1, 96.00, '2026-03-28T00:00:00.000Z'),
  ('stock-1180', '1180', 'Saudi National Bank', 'SA', 'TADAWUL', 'Financial Services', 1, 38.00, '2026-03-28T00:00:00.000Z'),
  ('stock-7010', '7010', 'Saudi Telecom Company', 'SA', 'TADAWUL', 'Telecom', 1, 12.20, '2026-03-28T00:00:00.000Z'),
  ('stock-1010', '1010', 'Riyad Bank', 'SA', 'TADAWUL', 'Financial Services', 1, 30.00, '2026-03-28T00:00:00.000Z'),
  ('stock-1150', '1150', 'Alinma Bank', 'SA', 'TADAWUL', 'Financial Services', 1, 30.50, '2026-03-28T00:00:00.000Z'),
  ('stock-2010', '2010', 'SABIC', 'SA', 'TADAWUL', 'Materials', 1, 71.00, '2026-03-28T00:00:00.000Z'),
  ('stock-1211', '1211', 'Saudi Arabian Mining (Maaden)', 'SA', 'TADAWUL', 'Materials', 1, 48.00, '2026-03-28T00:00:00.000Z'),
  ('stock-2082', '2082', 'ACWA Power', 'SA', 'TADAWUL', 'Utilities', 1, 340.00, '2026-03-28T00:00:00.000Z'),
  ('stock-5110', '5110', 'Saudi Electricity Company', 'SA', 'TADAWUL', 'Utilities', 1, 17.50, '2026-03-28T00:00:00.000Z'),
  ('stock-2280', '2280', 'Almarai', 'SA', 'TADAWUL', 'Consumer Staples', 1, 52.00, '2026-03-28T00:00:00.000Z'),
  ('stock-2050', '2050', 'Savola Group', 'SA', 'TADAWUL', 'Consumer Staples', 1, 32.00, '2026-03-28T00:00:00.000Z'),
  ('stock-4190', '4190', 'Jarir Marketing', 'SA', 'TADAWUL', 'Consumer Discretionary', 1, 145.00, '2026-03-28T00:00:00.000Z'),
  ('stock-4300', '4300', 'Dar Al Arkan Real Estate', 'SA', 'TADAWUL', 'Real Estate', 1, 11.50, '2026-03-28T00:00:00.000Z'),
  ('stock-1020', '1020', 'Bank AlJazira', 'SA', 'TADAWUL', 'Financial Services', 1, 18.50, '2026-03-28T00:00:00.000Z'),
  ('stock-1060', '1060', 'Saudi Investment Bank', 'SA', 'TADAWUL', 'Financial Services', 1, 16.80, '2026-03-28T00:00:00.000Z'),
  ('stock-1140', '1140', 'Bank Albilad', 'SA', 'TADAWUL', 'Financial Services', 1, 42.00, '2026-03-28T00:00:00.000Z'),
  ('stock-2350', '2350', 'Saudi Kayan Petrochemical', 'SA', 'TADAWUL', 'Materials', 1, 12.50, '2026-03-28T00:00:00.000Z'),
  ('stock-2310', '2310', 'SIIG', 'SA', 'TADAWUL', 'Materials', 1, 17.00, '2026-03-28T00:00:00.000Z'),
  ('stock-7020', '7020', 'Etihad Etisalat (Mobily)', 'SA', 'TADAWUL', 'Telecom', 1, 46.00, '2026-03-28T00:00:00.000Z'),
  ('stock-4001', '4001', 'Abdullah Al Othaim Markets', 'SA', 'TADAWUL', 'Consumer Staples', 1, 78.00, '2026-03-28T00:00:00.000Z'),
  ('stock-2250', '2250', 'SAFCO', 'SA', 'TADAWUL', 'Materials', 1, 72.00, '2026-03-28T00:00:00.000Z'),
  ('stock-3010', '3010', 'Arabian Cement', 'SA', 'TADAWUL', 'Materials', 1, 19.50, '2026-03-28T00:00:00.000Z'),
  ('stock-1182', '1182', 'Amlak International', 'SA', 'TADAWUL', 'Financial Services', 1, 24.00, '2026-03-28T00:00:00.000Z'),
  ('stock-4030', '4030', 'Abdul Mohsen Al Hokair Group', 'SA', 'TADAWUL', 'Consumer Discretionary', 1, 14.00, '2026-03-28T00:00:00.000Z');

-- ─── BURSA (Malaysia) ───────────────────────────────────────
INSERT OR IGNORE INTO stocks (id, symbol, name, country_code, exchange, sector, enabled, last_price, last_price_updated_at)
VALUES
  ('stock-1155', '1155', 'Malayan Banking Berhad', 'MY', 'BURSA', 'Financial Services', 1, 10.50, '2026-03-28T00:00:00.000Z'),
  ('stock-1295', '1295', 'Public Bank Berhad', 'MY', 'BURSA', 'Financial Services', 1, 4.80, '2026-03-28T00:00:00.000Z'),
  ('stock-1023', '1023', 'CIMB Group Holdings', 'MY', 'BURSA', 'Financial Services', 1, 8.20, '2026-03-28T00:00:00.000Z'),
  ('stock-5347', '5347', 'Tenaga Nasional Berhad', 'MY', 'BURSA', 'Utilities', 1, 14.80, '2026-03-28T00:00:00.000Z'),
  ('stock-5183', '5183', 'Petronas Chemicals Group', 'MY', 'BURSA', 'Energy', 1, 6.50, '2026-03-28T00:00:00.000Z'),
  ('stock-5225', '5225', 'IHH Healthcare Berhad', 'MY', 'BURSA', 'Healthcare', 1, 7.20, '2026-03-28T00:00:00.000Z'),
  ('stock-6012', '6012', 'Maxis Berhad', 'MY', 'BURSA', 'Telecom', 1, 3.80, '2026-03-28T00:00:00.000Z'),
  ('stock-3816', '3816', 'MISC Berhad', 'MY', 'BURSA', 'Transportation & Logistics', 1, 7.60, '2026-03-28T00:00:00.000Z'),
  ('stock-4707', '4707', 'Nestle Malaysia Berhad', 'MY', 'BURSA', 'Consumer Products', 1, 128.00, '2026-03-28T00:00:00.000Z'),
  ('stock-7113', '7113', 'Top Glove Corporation', 'MY', 'BURSA', 'Healthcare', 1, 1.05, '2026-03-28T00:00:00.000Z'),
  ('stock-5168', '5168', 'Hartalega Holdings', 'MY', 'BURSA', 'Healthcare', 1, 1.80, '2026-03-28T00:00:00.000Z'),
  ('stock-7084', '7084', 'QL Resources Berhad', 'MY', 'BURSA', 'Consumer Products', 1, 5.20, '2026-03-28T00:00:00.000Z'),
  ('stock-8869', '8869', 'Press Metal Aluminium Holdings', 'MY', 'BURSA', 'Industrial Products', 1, 5.80, '2026-03-28T00:00:00.000Z'),
  ('stock-4677', '4677', 'YTL Corporation Berhad', 'MY', 'BURSA', 'Utilities', 1, 3.20, '2026-03-28T00:00:00.000Z'),
  ('stock-3182', '3182', 'Genting Berhad', 'MY', 'BURSA', 'Consumer Services', 1, 5.50, '2026-03-28T00:00:00.000Z'),
  ('stock-6888', '6888', 'RHB Bank Berhad', 'MY', 'BURSA', 'Financial Services', 1, 6.40, '2026-03-28T00:00:00.000Z'),
  ('stock-4863', '4863', 'Telekom Malaysia Berhad', 'MY', 'BURSA', 'Telecom', 1, 6.80, '2026-03-28T00:00:00.000Z'),
  ('stock-5285', '5285', 'Sime Darby Plantation', 'MY', 'BURSA', 'Plantation', 1, 4.60, '2026-03-28T00:00:00.000Z'),
  ('stock-4197', '4197', 'Sime Darby Berhad', 'MY', 'BURSA', 'Industrial Products', 1, 2.50, '2026-03-28T00:00:00.000Z'),
  ('stock-2445', '2445', 'Kuala Lumpur Kepong Berhad', 'MY', 'BURSA', 'Plantation', 1, 22.50, '2026-03-28T00:00:00.000Z');

-- ─── NYSE (United States) ───────────────────────────────────
INSERT OR IGNORE INTO stocks (id, symbol, name, country_code, exchange, sector, enabled, last_price, last_price_updated_at)
VALUES
  ('stock-brk-b', 'BRK.B', 'Berkshire Hathaway Inc.', 'US', 'NYSE', 'Financial Services', 1, 540.00, '2026-03-28T00:00:00.000Z'),
  ('stock-jpm', 'JPM', 'JPMorgan Chase & Co.', 'US', 'NYSE', 'Financial Services', 1, 254.00, '2026-03-28T00:00:00.000Z'),
  ('stock-v', 'V', 'Visa Inc.', 'US', 'NYSE', 'Financial Services', 1, 345.00, '2026-03-28T00:00:00.000Z'),
  ('stock-jnj', 'JNJ', 'Johnson & Johnson', 'US', 'NYSE', 'Healthcare', 1, 155.00, '2026-03-28T00:00:00.000Z'),
  ('stock-unh', 'UNH', 'UnitedHealth Group Inc.', 'US', 'NYSE', 'Healthcare', 1, 500.00, '2026-03-28T00:00:00.000Z'),
  ('stock-pg', 'PG', 'Procter & Gamble Co.', 'US', 'NYSE', 'Consumer Staples', 1, 168.00, '2026-03-28T00:00:00.000Z'),
  ('stock-lly', 'LLY', 'Eli Lilly and Company', 'US', 'NYSE', 'Healthcare', 1, 830.00, '2026-03-28T00:00:00.000Z');

-- ─── NASDAQ (United States) ─────────────────────────────────
INSERT OR IGNORE INTO stocks (id, symbol, name, country_code, exchange, sector, enabled, last_price, last_price_updated_at)
VALUES
  ('stock-aapl', 'AAPL', 'Apple Inc.', 'US', 'NASDAQ', 'Technology', 1, 230.50, '2026-03-28T00:00:00.000Z'),
  ('stock-msft', 'MSFT', 'Microsoft Corporation', 'US', 'NASDAQ', 'Technology', 1, 435.00, '2026-03-28T00:00:00.000Z'),
  ('stock-nvda', 'NVDA', 'NVIDIA Corporation', 'US', 'NASDAQ', 'Technology', 1, 138.00, '2026-03-28T00:00:00.000Z'),
  ('stock-googl', 'GOOGL', 'Alphabet Inc.', 'US', 'NASDAQ', 'Technology', 1, 196.00, '2026-03-28T00:00:00.000Z'),
  ('stock-amzn', 'AMZN', 'Amazon.com Inc.', 'US', 'NASDAQ', 'Technology', 1, 228.00, '2026-03-28T00:00:00.000Z'),
  ('stock-meta', 'META', 'Meta Platforms Inc.', 'US', 'NASDAQ', 'Technology', 1, 585.00, '2026-03-28T00:00:00.000Z'),
  ('stock-tsla', 'TSLA', 'Tesla Inc.', 'US', 'NASDAQ', 'Consumer Discretionary', 1, 272.00, '2026-03-28T00:00:00.000Z'),
  ('stock-avgo', 'AVGO', 'Broadcom Inc.', 'US', 'NASDAQ', 'Technology', 1, 203.00, '2026-03-28T00:00:00.000Z');
