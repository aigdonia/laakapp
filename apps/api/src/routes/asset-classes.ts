import { assetClasses } from "../db/schema";
import { crudRoutes } from "./_crud";
import { assetClassesInsert, assetClassesUpdate } from "../validation/schemas";

export default crudRoutes(assetClasses, {
  orderable: true,
  insertSchema: assetClassesInsert,
  updateSchema: assetClassesUpdate,
});
