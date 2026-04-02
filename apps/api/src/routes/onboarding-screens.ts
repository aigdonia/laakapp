import { onboardingScreens } from "../db/schema";
import { crudRoutes } from "./_crud";
import { onboardingScreensInsert, onboardingScreensUpdate } from "../validation/schemas";

export default crudRoutes(onboardingScreens, {
  orderable: true,
  insertSchema: onboardingScreensInsert,
  updateSchema: onboardingScreensUpdate,
});
