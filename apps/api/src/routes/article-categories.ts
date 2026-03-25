import { articleCategories } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(articleCategories, { orderable: true });
