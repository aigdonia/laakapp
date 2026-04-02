import { eventTypes } from "../db/schema";
import { crudRoutes } from "./_crud";
import { eventTypesInsert, eventTypesUpdate } from "../validation/schemas";

const app = crudRoutes(eventTypes, {
  insertSchema: eventTypesInsert,
  updateSchema: eventTypesUpdate,
});

export default app;
