import { affiliates } from "../db/schema";
import { crudRoutes } from "./_crud";
import { affiliatesInsert, affiliatesUpdate } from "../validation/schemas";

export default crudRoutes(affiliates, {
  insertSchema: affiliatesInsert,
  updateSchema: affiliatesUpdate,
});
