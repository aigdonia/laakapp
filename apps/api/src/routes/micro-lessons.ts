import { microLessons } from "../db/schema";
import { crudRoutes } from "./_crud";
import { microLessonsInsert, microLessonsUpdate } from "../validation/schemas";

export default crudRoutes(microLessons, {
  orderable: true,
  insertSchema: microLessonsInsert,
  updateSchema: microLessonsUpdate,
});
