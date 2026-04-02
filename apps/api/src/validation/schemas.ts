import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import * as tables from "../db/schema";

// ─── Generic CRUD table schemas ─────────────────────────────
// Used by _crud.ts to validate POST (insert) and PUT (update) bodies.
// Fields with defaults (id, createdAt, updatedAt) are auto-optional in insert schemas.

export const countriesInsert = createInsertSchema(tables.countries);
export const countriesUpdate = createUpdateSchema(tables.countries);

export const stocksInsert = createInsertSchema(tables.stocks);
export const stocksUpdate = createUpdateSchema(tables.stocks);

export const screeningRulesInsert = createInsertSchema(tables.screeningRules);
export const screeningRulesUpdate = createUpdateSchema(tables.screeningRules);

export const articleCategoriesInsert = createInsertSchema(tables.articleCategories);
export const articleCategoriesUpdate = createUpdateSchema(tables.articleCategories);

export const articlesInsert = createInsertSchema(tables.articles);
export const articlesUpdate = createUpdateSchema(tables.articles);

export const microLessonsInsert = createInsertSchema(tables.microLessons);
export const microLessonsUpdate = createUpdateSchema(tables.microLessons);

export const learningCardsInsert = createInsertSchema(tables.learningCards);
export const learningCardsUpdate = createUpdateSchema(tables.learningCards);

export const languagesInsert = createInsertSchema(tables.languages);
export const languagesUpdate = createUpdateSchema(tables.languages);

export const creditPackagesInsert = createInsertSchema(tables.creditPackages);
export const creditPackagesUpdate = createUpdateSchema(tables.creditPackages);

export const affiliatesInsert = createInsertSchema(tables.affiliates);
export const affiliatesUpdate = createUpdateSchema(tables.affiliates);

export const promptsInsert = createInsertSchema(tables.prompts);
export const promptsUpdate = createUpdateSchema(tables.prompts);

export const assetClassesInsert = createInsertSchema(tables.assetClasses);
export const assetClassesUpdate = createUpdateSchema(tables.assetClasses);

export const lookupsInsert = createInsertSchema(tables.lookups);
export const lookupsUpdate = createUpdateSchema(tables.lookups);

export const portfolioPresetsInsert = createInsertSchema(tables.portfolioPresets);
export const portfolioPresetsUpdate = createUpdateSchema(tables.portfolioPresets);

export const uiTranslationsInsert = createInsertSchema(tables.uiTranslations);
export const uiTranslationsUpdate = createUpdateSchema(tables.uiTranslations);

export const onboardingScreensInsert = createInsertSchema(tables.onboardingScreens);
export const onboardingScreensUpdate = createUpdateSchema(tables.onboardingScreens);

export const exchangeRatesInsert = createInsertSchema(tables.exchangeRates);
export const exchangeRatesUpdate = createUpdateSchema(tables.exchangeRates);

export const stockComplianceInsert = createInsertSchema(tables.stockCompliance);
export const stockComplianceUpdate = createUpdateSchema(tables.stockCompliance);

export const stockFinancialsInsert = createInsertSchema(tables.stockFinancials);
export const stockFinancialsUpdate = createUpdateSchema(tables.stockFinancials);

export const dataSourcesInsert = createInsertSchema(tables.dataSources);
export const dataSourcesUpdate = createUpdateSchema(tables.dataSources);

export const scrapeJobsInsert = createInsertSchema(tables.scrapeJobs);
export const scrapeJobsUpdate = createUpdateSchema(tables.scrapeJobs);

export const eventTypesInsert = createInsertSchema(tables.eventTypes);
export const eventTypesUpdate = createUpdateSchema(tables.eventTypes);

export const activityRulesInsert = createInsertSchema(tables.activityRules);
export const activityRulesUpdate = createUpdateSchema(tables.activityRules);

export const aiFeaturesInsert = createInsertSchema(tables.aiFeatures);
export const aiFeaturesUpdate = createUpdateSchema(tables.aiFeatures);

export const appSettingsInsert = createInsertSchema(tables.appSettings);
export const appSettingsUpdate = createUpdateSchema(tables.appSettings);

export const stockAnalysesInsert = createInsertSchema(tables.stockAnalyses);
export const stockAnalysesUpdate = createUpdateSchema(tables.stockAnalyses);
