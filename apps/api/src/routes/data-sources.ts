import { dataSources } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(dataSources);
