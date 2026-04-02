import { dataSources } from "../db/schema";
import { crudRoutes } from "./_crud";
import { dataSourcesInsert, dataSourcesUpdate } from "../validation/schemas";

export default crudRoutes(dataSources, {
  insertSchema: dataSourcesInsert,
  updateSchema: dataSourcesUpdate,
});
