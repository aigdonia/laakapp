import { languages } from "../db/schema";
import { crudRoutes } from "./_crud";
import { languagesInsert, languagesUpdate } from "../validation/schemas";

export default crudRoutes(languages, {
  insertSchema: languagesInsert,
  updateSchema: languagesUpdate,
});
