import { aiFeatures } from "../db/schema";
import { crudRoutes } from "./_crud";
import { aiFeaturesInsert, aiFeaturesUpdate } from "../validation/schemas";

export default crudRoutes(aiFeatures, {
  insertSchema: aiFeaturesInsert,
  updateSchema: aiFeaturesUpdate,
});
