import { microLessons } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(microLessons, { orderable: true });
