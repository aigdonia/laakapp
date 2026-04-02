import { screeningRules } from "../db/schema";
import { crudRoutes } from "./_crud";
import { screeningRulesInsert, screeningRulesUpdate } from "../validation/schemas";

export default crudRoutes(screeningRules, {
  insertSchema: screeningRulesInsert,
  updateSchema: screeningRulesUpdate,
});
