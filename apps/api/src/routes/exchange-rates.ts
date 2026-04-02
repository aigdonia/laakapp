import { exchangeRates } from "../db/schema";
import { crudRoutes } from "./_crud";
import { exchangeRatesInsert, exchangeRatesUpdate } from "../validation/schemas";

export default crudRoutes(exchangeRates, {
  insertSchema: exchangeRatesInsert,
  updateSchema: exchangeRatesUpdate,
});
