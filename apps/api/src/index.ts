import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb } from "./db";
import countries from "./routes/countries";
import stocks from "./routes/stocks";
import screeningRules from "./routes/screening-rules";
import articleCategories from "./routes/article-categories";
import articles from "./routes/articles";
import microLessons from "./routes/micro-lessons";
import learningCards from "./routes/learning-cards";
import languages from "./routes/languages";
import creditPackages from "./routes/credit-packages";
import affiliates from "./routes/affiliates";
import prompts from "./routes/prompts";
import assetClasses from "./routes/asset-classes";
import lookups from "./routes/lookups";
import appSettings from "./routes/app-settings";
import uiTranslationsRoute from "./routes/ui-translations";
import credits from "./routes/credits";
import onboardingScreens from "./routes/onboarding-screens";
import portfolioPresets from "./routes/portfolio-presets";
import pushTokensRoute from "./routes/push-tokens";
import exchangeRatesRoute from "./routes/exchange-rates";
import notificationsRoute, {
  processScheduledNotifications,
} from "./routes/notifications";

export type Env = {
  Bindings: {
    DB: D1Database;
    RC_SECRET_KEY: string;
    RC_PROJECT_ID: string;
  };
};

const app = new Hono<Env>();

app.use("*", cors());

app.use("*", async (c, next) => {
  const db = createDb(c.env.DB);
  c.set("db" as never, db);
  await next();
});

app.get("/", (c) => c.json({ name: "fin-ai-api", status: "ok" }));

app.route("/countries", countries);
app.route("/stocks", stocks);
app.route("/screening-rules", screeningRules);
app.route("/article-categories", articleCategories);
app.route("/articles", articles);
app.route("/micro-lessons", microLessons);
app.route("/learning-cards", learningCards);
app.route("/languages", languages);
app.route("/credit-packages", creditPackages);
app.route("/affiliates", affiliates);
app.route("/prompts", prompts);
app.route("/asset-classes", assetClasses);
app.route("/lookups", lookups);
app.route("/app-settings", appSettings);
app.route("/ui-translations", uiTranslationsRoute);
app.route("/credits", credits);
app.route("/onboarding-screens", onboardingScreens);
app.route("/portfolio-presets", portfolioPresets);
app.route("/push-tokens", pushTokensRoute);
app.route("/notifications", notificationsRoute);
app.route("/exchange-rates", exchangeRatesRoute);

export default {
  fetch: app.fetch,
  async scheduled(
    _event: ScheduledEvent,
    env: { DB: D1Database },
    _ctx: ExecutionContext
  ) {
    const db = createDb(env.DB);
    await processScheduledNotifications(db);
  },
};
