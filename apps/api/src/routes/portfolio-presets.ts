import { portfolioPresets } from "../db/schema";
import { crudRoutes } from "./_crud";
import { portfolioPresetsInsert, portfolioPresetsUpdate } from "../validation/schemas";

export default crudRoutes(portfolioPresets, {
  orderable: true,
  insertSchema: portfolioPresetsInsert,
  updateSchema: portfolioPresetsUpdate,
});
