import { portfolioPresets } from "../db/schema";
import { crudRoutes } from "./_crud";

export default crudRoutes(portfolioPresets, { orderable: true });
