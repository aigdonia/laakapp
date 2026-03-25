import { learningCards } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(learningCards, { orderable: true });
