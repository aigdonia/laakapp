"use client"

import { useMemo, useEffect, useState, useTransition } from "react"
import { PageLayout } from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocalStorage } from "./content-ops/use-local-storage"
import {
  fetchDashboardStats,
  type DashboardStats,
} from "./dashboard-stats-actions"
import {
  IconFlame,
  IconCalendarEvent,
  IconBuildingBank,
  IconShieldCheck,
  IconRefresh,
  IconArticle,
  IconSchool,
  IconCoin,
  IconSparkles,
  IconDeviceMobile,
  IconBrandApple,
  IconBrandAndroid,
  IconBell,
  IconActivity,
  IconUsers,
  IconAlertTriangle,
} from "@tabler/icons-react"

/* ── Local streak computation (unchanged) ──────────────── */

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function computeLocalStats(weeklyData: Record<string, Record<string, boolean>>) {
  const isActive = (date: string) => {
    const dayData = weeklyData[date]
    if (!dayData) return false
    return Object.values(dayData).some(Boolean)
  }

  let currentStreak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const iso = formatDate(d)
    if (isActive(iso)) {
      currentStreak++
    } else if (i === 0) {
      currentStreak = 0
    } else {
      break
    }
    d.setDate(d.getDate() - 1)
  }

  let longestStreak = 0
  let streak = 0
  let prevDate: Date | null = null
  for (const dateStr of Object.keys(weeklyData).sort()) {
    if (isActive(dateStr)) {
      const curr = new Date(dateStr)
      if (prevDate && curr.getTime() - prevDate.getTime() === 86400000) {
        streak++
      } else {
        streak = 1
      }
      longestStreak = Math.max(longestStreak, streak)
      prevDate = curr
    } else {
      streak = 0
      prevDate = null
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak)
  const activeDays = Object.keys(weeklyData).filter(isActive).length

  return { currentStreak, longestStreak, activeDays }
}

/* ── Helpers ───────────────────────────────────────────── */

function timeAgo(isoDate: string | null): string {
  if (!isoDate) return "Never"
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function isStale(isoDate: string | null, hoursThreshold = 24): boolean {
  if (!isoDate) return true
  return Date.now() - new Date(isoDate).getTime() > hoursThreshold * 3600000
}

/* ── Components ────────────────────────────────────────── */

function MetricCard({
  icon,
  label,
  value,
  suffix,
  detail,
  alert,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  suffix?: string
  detail?: string
  alert?: boolean
}) {
  return (
    <div
      className={`rounded-xl border bg-card p-5 text-card-foreground shadow-sm ${
        alert ? "border-destructive/50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
    </div>
  )
}

function MetricSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-7 w-16 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </h3>
  )
}

/* ── Page ──────────────────────────────────────────────── */

export default function DashboardPage() {
  const [weeklyData] = useLocalStorage<Record<string, Record<string, boolean>>>(
    "laak-content-ops-weekly",
    {}
  )
  const local = useMemo(() => computeLocalStats(weeklyData), [weeklyData])

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await fetchDashboardStats()
        setStats(data)
      } catch {
        // API not reachable — show skeletons
      }
    })
  }, [])

  return (
    <PageLayout title="Dashboard" description="Overview of your workspace.">
      {/* ── Row 1: Top-level glance ─────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<IconFlame className="size-5 text-orange-500" />}
          label="Content Streak"
          value={local.currentStreak}
          suffix="days"
          detail={`Best: ${local.longestStreak} days`}
        />
        <MetricCard
          icon={<IconCalendarEvent className="size-5 text-blue-400" />}
          label="Active Days"
          value={local.activeDays}
          detail="since tracking started"
        />
        {stats ? (
          <>
            <MetricCard
              icon={<IconDeviceMobile className="size-5 text-emerald-500" />}
              label="Devices"
              value={stats.users.totalDevices}
              detail={`${stats.users.ios} iOS · ${stats.users.android} Android`}
            />
            <MetricCard
              icon={
                stats.appSettings.maintenanceMode ? (
                  <IconAlertTriangle className="size-5 text-destructive" />
                ) : (
                  <IconShieldCheck className="size-5 text-emerald-500" />
                )
              }
              label="System"
              value={stats.appSettings.maintenanceMode ? "Maintenance" : "Live"}
              alert={stats.appSettings.maintenanceMode}
              detail={
                stats.appSettings.maintenanceMode
                  ? "App is in maintenance mode!"
                  : "All systems operational"
              }
            />
          </>
        ) : (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        )}
      </div>

      {/* ── Row 2: Stock Coverage + Data Freshness ──────── */}
      <SectionTitle>Data & Screening</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {stats ? (
          <>
            {/* Stock Coverage */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconBuildingBank className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Stock Coverage
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {stats.stocks.screened}/{stats.stocks.total} screened
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden mb-3">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{
                    width: `${stats.stocks.total > 0 ? (stats.stocks.screened / stats.stocks.total) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <span className="size-2 rounded-full bg-emerald-500 mr-1.5" />
                  {stats.stocks.compliant} compliant
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <span className="size-2 rounded-full bg-destructive mr-1.5" />
                  {stats.stocks.nonCompliant} non-compliant
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <span className="size-2 rounded-full bg-orange-500 mr-1.5" />
                  {stats.stocks.doubtful} doubtful
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <span className="size-2 rounded-full bg-muted-foreground mr-1.5" />
                  {stats.stocks.notScreened} not screened
                </Badge>
              </div>
            </div>

            {/* Data Freshness */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconRefresh className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Data Freshness
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last scrape</span>
                    <span
                      className={`text-sm font-semibold ${
                        isStale(stats.lastScrape.completedAt) ? "text-destructive" : "text-emerald-500"
                      }`}
                    >
                      {timeAgo(stats.lastScrape.completedAt)}
                    </span>
                  </div>
                  {stats.lastScrape.status && (
                    <Badge
                      variant={stats.lastScrape.status === "completed" ? "secondary" : "destructive"}
                      className="text-[10px] mt-1"
                    >
                      {stats.lastScrape.status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Success rate (last 10)
                  </span>
                  <span className="text-sm font-semibold">
                    {stats.scrapeJobs.recentSuccess}/{stats.scrapeJobs.recentTotal}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        )}
      </div>

      {/* ── Row 3: Content + Credits ────────────────────── */}
      <SectionTitle>Content & Monetization</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {stats ? (
          <>
            {/* Content */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconArticle className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Content</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-2xl font-bold tabular-nums">
                    {stats.content.articlesPublished}
                  </span>
                  <p className="text-xs text-muted-foreground">published</p>
                </div>
                <div>
                  <span className="text-2xl font-bold tabular-nums">
                    {stats.content.articlesDraft}
                  </span>
                  <p className="text-xs text-muted-foreground">drafts</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums">
                      {stats.content.microLessons}
                    </span>
                    <IconSchool className="size-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">micro-lessons</p>
                </div>
              </div>
            </div>

            {/* Credits */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconCoin className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Credits</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.credits.totalSpent}
                </span>
                <span className="text-xs text-muted-foreground">spent all-time</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {stats.credits.spentThisMonth} this month
              </p>
              {stats.credits.byFeature.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {stats.credits.byFeature.map((f) => (
                    <Badge key={f.feature} variant="secondary" className="text-[10px]">
                      {f.feature}: {f.total}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        )}
      </div>

      {/* ── Row 4: AI + Activity + Notifications ────────── */}
      <SectionTitle>Engagement</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {stats ? (
          <>
            {/* AI */}
            <MetricCard
              icon={<IconSparkles className="size-5 text-violet-500" />}
              label="AI Analyses"
              value={stats.ai.analysesGenerated}
              suffix="total"
              detail={`${stats.ai.analysesThisMonth} this month`}
            />

            {/* Activity */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">User Activity</span>
                <IconActivity className="size-5 text-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xl font-bold tabular-nums">
                    {stats.activity.eventsThisWeek}
                  </span>
                  <p className="text-xs text-muted-foreground">events this week</p>
                </div>
                <div>
                  <span className="text-xl font-bold tabular-nums">
                    {stats.activity.eventsThisMonth}
                  </span>
                  <p className="text-xs text-muted-foreground">this month</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                <IconUsers className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {stats.activity.uniqueUsersThisMonth} unique users this month
                </span>
              </div>
            </div>

            {/* Notifications */}
            <MetricCard
              icon={<IconBell className="size-5 text-amber-500" />}
              label="Notifications"
              value={stats.notifications.sent}
              suffix="sent"
              detail={`${stats.notifications.draft} draft · ${stats.notifications.scheduled} scheduled`}
            />
          </>
        ) : (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        )}
      </div>
    </PageLayout>
  )
}
