import { articles } from "../db/schema";
import { crudRoutes } from "./_crud";
import { articlesInsert, articlesUpdate } from "../validation/schemas";

export default crudRoutes(articles, {
  insertSchema: articlesInsert,
  updateSchema: articlesUpdate,
});
