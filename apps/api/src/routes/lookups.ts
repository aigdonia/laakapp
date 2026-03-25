import { lookups } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(lookups, { orderable: true });
