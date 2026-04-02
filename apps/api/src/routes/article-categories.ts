import { articleCategories } from "../db/schema";
import { crudRoutes } from "./_crud";
import { articleCategoriesInsert, articleCategoriesUpdate } from "../validation/schemas";

export default crudRoutes(articleCategories, {
  orderable: true,
  insertSchema: articleCategoriesInsert,
  updateSchema: articleCategoriesUpdate,
});
