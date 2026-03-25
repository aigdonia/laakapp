import { assetClasses } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(assetClasses, { orderable: true });
