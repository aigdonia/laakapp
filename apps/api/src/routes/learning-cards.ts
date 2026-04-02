import { learningCards } from "../db/schema";
import { crudRoutes } from "./_crud";
import { learningCardsInsert, learningCardsUpdate } from "../validation/schemas";

export default crudRoutes(learningCards, {
  orderable: true,
  insertSchema: learningCardsInsert,
  updateSchema: learningCardsUpdate,
});
