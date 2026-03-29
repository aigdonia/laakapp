import { eventTypes } from "../db/schema";
import { crudRoutes } from "./_crud";

const app = crudRoutes(eventTypes);

export default app;
