import { prompts } from "../db/schema";
import { crudRoutes } from "./_crud";
import { promptsInsert, promptsUpdate } from "../validation/schemas";

export default crudRoutes(prompts, {
  insertSchema: promptsInsert,
  updateSchema: promptsUpdate,
});
