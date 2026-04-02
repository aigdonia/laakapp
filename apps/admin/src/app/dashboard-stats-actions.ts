"use server";

import { api } from "@/lib/api";

export type DashboardStats = {
  stocks: {
    total: number;
    screened: number;
    compliant: number;
    nonCompliant: number;
    doubtful: number;
    notScreened: number;
  };
  lastScrape: {
    completedAt: string | null;
    status: string | null;
  };
  scrapeJobs: {
    recentTotal: number;
    recentSuccess: number;
  };
  content: {
    articlesPublished: number;
    articlesDraft: number;
    microLessons: number;
  };
  credits: {
    totalSpent: number;
    spentThisMonth: number;
    byFeature: { feature: string; total: number }[];
  };
  ai: {
    analysesGenerated: number;
    analysesThisMonth: number;
  };
  users: {
    totalDevices: number;
    ios: number;
    android: number;
  };
  notifications: {
    sent: number;
    draft: number;
    scheduled: number;
  };
  activity: {
    eventsThisWeek: number;
    eventsThisMonth: number;
    uniqueUsersThisMonth: number;
  };
  appSettings: {
    maintenanceMode: boolean;
  };
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return api<DashboardStats>("/dashboard-stats");
}
