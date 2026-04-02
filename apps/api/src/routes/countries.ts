import { countries } from "../db/schema";
import { crudRoutes } from "./_crud";
import { countriesInsert, countriesUpdate } from "../validation/schemas";

export default crudRoutes(countries, {
  insertSchema: countriesInsert,
  updateSchema: countriesUpdate,
});
