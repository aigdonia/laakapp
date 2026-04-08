import { Hono } from "hono";
import { sql, eq } from "drizzle-orm";
import type { Env } from "../index";
import type { Database } from "../db";
import {
  stocks,
  stockCompliance,
  scrapeExecutions,
  articles,
  microLessons,
  creditTransactions,
  stockAnalyses,
  pushTokens,
  notifications,
  activityEvents,
  appSettings,
} from "../db/schema";

function db(c: { get: (key: string) => unknown }): Database {
  return c.get("db") as Database;
}

const app = new Hono<Env>();

app.get("/", async (c) => {
  const d = db(c);

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // Week start (Monday)
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const weekStart = monday.toISOString().split("T")[0];

  // Run all queries concurrently
  const [
    stockTotal,
    complianceBreakdown,
    lastScrapeRow,
    recentScrapes,
    articlesByStatus,
    microLessonCount,
    creditsTotal,
    creditsMonth,
    creditsByFeature,
    analysesTotal,
    analysesMonth,
    devicesByPlatform,
    notifsByStatus,
    eventsWeek,
    eventsMonth,
    uniqueUsersMonth,
    settings,
  ] = await Promise.all([
    // 1. Stock total
    d.select({ count: sql<number>`count(*)` }).from(stocks).get(),

    // 2. Compliance breakdown
    d.select({
      status: stockCompliance.status,
      count: sql<number>`count(distinct ${stockCompliance.stockId})`,
    })
      .from(stockCompliance)
      .groupBy(stockCompliance.status)
      .all(),

    // 3. Last scrape execution
    d.select({
      completedAt: scrapeExecutions.completedAt,
      status: scrapeExecutions.status,
    })
      .from(scrapeExecutions)
      .orderBy(sql`${scrapeExecutions.createdAt} desc`)
      .limit(1)
      .get(),

    // 4. Recent scrape success rate (last 10)
    d.select({
      status: scrapeExecutions.status,
      count: sql<number>`count(*)`,
    })
      .from(scrapeExecutions)
      .where(
        sql`${scrapeExecutions.id} in (select id from scrape_executions order by created_at desc limit 10)`
      )
      .groupBy(scrapeExecutions.status)
      .all(),

    // 5. Articles by status
    d.select({
      status: articles.status,
      count: sql<number>`count(*)`,
    })
      .from(articles)
      .groupBy(articles.status)
      .all(),

    // 6. Micro lessons count
    d.select({ count: sql<number>`count(*)` }).from(microLessons).get(),

    // 7. Total credits spent (negative amounts = spends)
    d.select({
      total: sql<number>`coalesce(sum(abs(${creditTransactions.amount})), 0)`,
    })
      .from(creditTransactions)
      .where(sql`${creditTransactions.amount} < 0 and ${creditTransactions.status} = 'completed'`)
      .get(),

    // 8. Credits spent this month
    d.select({
      total: sql<number>`coalesce(sum(abs(${creditTransactions.amount})), 0)`,
    })
      .from(creditTransactions)
      .where(
        sql`${creditTransactions.amount} < 0 and ${creditTransactions.status} = 'completed' and ${creditTransactions.createdAt} >= ${monthStart}`
      )
      .get(),

    // 9. Credits by feature
    d.select({
      feature: creditTransactions.feature,
      total: sql<number>`coalesce(sum(abs(${creditTransactions.amount})), 0)`,
    })
      .from(creditTransactions)
      .where(sql`${creditTransactions.amount} < 0 and ${creditTransactions.status} = 'completed'`)
      .groupBy(creditTransactions.feature)
      .all(),

    // 10. Total analyses
    d.select({ count: sql<number>`count(*)` }).from(stockAnalyses).get(),

    // 11. Analyses this month
    d.select({ count: sql<number>`count(*)` })
      .from(stockAnalyses)
      .where(sql`${stockAnalyses.createdAt} >= ${monthStart}`)
      .get(),

    // 12. Devices by platform
    d.select({
      platform: pushTokens.platform,
      count: sql<number>`count(*)`,
    })
      .from(pushTokens)
      .groupBy(pushTokens.platform)
      .all(),

    // 13. Notifications by status
    d.select({
      status: notifications.status,
      count: sql<number>`count(*)`,
    })
      .from(notifications)
      .groupBy(notifications.status)
      .all(),

    // 14. Activity events this week
    d.select({ count: sql<number>`count(*)` })
      .from(activityEvents)
      .where(sql`${activityEvents.createdAt} >= ${weekStart}`)
      .get(),

    // 15. Activity events this month
    d.select({ count: sql<number>`count(*)` })
      .from(activityEvents)
      .where(sql`${activityEvents.createdAt} >= ${monthStart}`)
      .get(),

    // 16. Unique users this month
    d.select({
      count: sql<number>`count(distinct ${activityEvents.customerId})`,
    })
      .from(activityEvents)
      .where(sql`${activityEvents.createdAt} >= ${monthStart}`)
      .get(),

    // 17. App settings
    d.select().from(appSettings).get(),
  ]);

  // Parse compliance breakdown
  const complianceMap: Record<string, number> = {};
  for (const row of complianceBreakdown) {
    complianceMap[row.status] = row.count;
  }

  // Parse recent scrapes
  let recentTotal = 0;
  let recentSuccess = 0;
  for (const row of recentScrapes) {
    recentTotal += row.count;
    if (row.status === "completed") recentSuccess = row.count;
  }

  // Parse articles
  const articleMap: Record<string, number> = {};
  for (const row of articlesByStatus) {
    articleMap[row.status] = row.count;
  }

  // Parse devices
  let totalDevices = 0;
  let ios = 0;
  let android = 0;
  for (const row of devicesByPlatform) {
    totalDevices += row.count;
    if (row.platform === "ios") ios = row.count;
    if (row.platform === "android") android = row.count;
  }

  // Parse notifications
  const notifMap: Record<string, number> = {};
  for (const row of notifsByStatus) {
    notifMap[row.status] = row.count;
  }

  // Screened = compliant + non_compliant + doubtful
  const screened =
    (complianceMap["compliant"] ?? 0) +
    (complianceMap["non_compliant"] ?? 0) +
    (complianceMap["doubtful"] ?? 0);
  const totalStocks = stockTotal?.count ?? 0;

  return c.json({
    stocks: {
      total: totalStocks,
      screened,
      compliant: complianceMap["compliant"] ?? 0,
      nonCompliant: complianceMap["non_compliant"] ?? 0,
      doubtful: complianceMap["doubtful"] ?? 0,
      notScreened: totalStocks - screened,
    },
    lastScrape: {
      completedAt: lastScrapeRow?.completedAt ?? null,
      status: lastScrapeRow?.status ?? null,
    },
    scrapeJobs: {
      recentTotal,
      recentSuccess,
    },
    content: {
      articlesPublished: articleMap["published"] ?? 0,
      articlesDraft: articleMap["draft"] ?? 0,
      microLessons: microLessonCount?.count ?? 0,
    },
    credits: {
      totalSpent: creditsTotal?.total ?? 0,
      spentThisMonth: creditsMonth?.total ?? 0,
      byFeature: creditsByFeature.map((r) => ({
        feature: r.feature,
        total: r.total,
      })),
    },
    ai: {
      analysesGenerated: analysesTotal?.count ?? 0,
      analysesThisMonth: analysesMonth?.count ?? 0,
    },
    users: {
      totalDevices,
      ios,
      android,
    },
    notifications: {
      sent: notifMap["sent"] ?? 0,
      draft: notifMap["draft"] ?? 0,
      scheduled: notifMap["scheduled"] ?? 0,
    },
    activity: {
      eventsThisWeek: eventsWeek?.count ?? 0,
      eventsThisMonth: eventsMonth?.count ?? 0,
      uniqueUsersThisMonth: uniqueUsersMonth?.count ?? 0,
    },
    appSettings: {
      maintenanceMode: settings?.maintenanceMode ?? false,
    },
  });
});

export default app;
