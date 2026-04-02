import { creditPackages } from "../db/schema";
import { crudRoutes } from "./_crud";
import { creditPackagesInsert, creditPackagesUpdate } from "../validation/schemas";

export default crudRoutes(creditPackages, {
  insertSchema: creditPackagesInsert,
  updateSchema: creditPackagesUpdate,
});
