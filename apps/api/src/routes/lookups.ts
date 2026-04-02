import { lookups } from "../db/schema";
import { crudRoutes } from "./_crud";
import { lookupsInsert, lookupsUpdate } from "../validation/schemas";

export default crudRoutes(lookups, {
  orderable: true,
  insertSchema: lookupsInsert,
  updateSchema: lookupsUpdate,
});
