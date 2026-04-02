"use client"

import { useMemo } from "react"
import { IconBrandReddit, IconBrandX, IconFlame } from "@tabler/icons-react"
import { DEFAULT_SCHEDULE } from "./content-ops-data"

type WeeklyData = Record<string, Record<string, boolean>>

/** March 1, 2026 — grid start */
const CAMPAIGN_START = "2026-03-01"
/** 6 months of grid (~26 weeks) */
const GRID_WEEKS = 26

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getAllItemIds() {
  const all = new Set<string>()
  const redditIds = new Set<string>()
  const xIds = new Set<string>()
  for (const day of DEFAULT_SCHEDULE) {
    for (const item of day.items) {
      all.add(item.id)
      if (item.platform === "reddit") redditIds.add(item.id)
      else xIds.add(item.id)
    }
  }
  return { all, redditIds, xIds }
}

function anyActiveOnDate(data: WeeklyData, date: string): boolean {
  const dayData = data[date]
  if (!dayData) return false
  return Object.values(dayData).some(Boolean)
}

type DayActivity = "none" | "reddit" | "x" | "both"

function getDayActivity(
  data: WeeklyData,
  date: string,
  redditIds: Set<string>,
  xIds: Set<string>
): DayActivity {
  const dayData = data[date]
  if (!dayData) return "none"

  let hasReddit = false
  let hasX = false
  for (const [id, done] of Object.entries(dayData)) {
    if (!done) continue
    if (redditIds.has(id)) hasReddit = true
    if (xIds.has(id)) hasX = true
    if (hasReddit && hasX) return "both"
  }
  if (hasReddit) return "reddit"
  if (hasX) return "x"
  return "none"
}

function computeOverallStreak(data: WeeklyData) {
  let current = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const iso = formatDate(d)
    if (anyActiveOnDate(data, iso)) {
      current++
    } else if (i === 0) {
      current = 0
    } else {
      break
    }
    d.setDate(d.getDate() - 1)
  }

  let longest = 0
  let streak = 0
  let prevDate: Date | null = null
  for (const dateStr of Object.keys(data).sort()) {
    if (anyActiveOnDate(data, dateStr)) {
      const curr = new Date(dateStr)
      if (prevDate && curr.getTime() - prevDate.getTime() === 86400000) {
        streak++
      } else {
        streak = 1
      }
      longest = Math.max(longest, streak)
      prevDate = curr
    } else {
      streak = 0
      prevDate = null
    }
  }

  return { current, longest: Math.max(longest, current) }
}

type CellData = {
  date: string
  activity: DayActivity
  isToday: boolean
  isFuture: boolean
  isBeforeStart: boolean
}

function buildGrid(
  data: WeeklyData,
  redditIds: Set<string>,
  xIds: Set<string>
) {
  const today = new Date()
  const todayStr = formatDate(today)
  const campaignDate = new Date(CAMPAIGN_START)
  const startMonday = getMonday(campaignDate)

  const grid: CellData[][] = []

  for (let w = 0; w < GRID_WEEKS; w++) {
    const weekStart = addDays(startMonday, w * 7)
    const col: CellData[] = []
    for (let d = 0; d < 7; d++) {
      const date = addDays(weekStart, d)
      const dateStr = formatDate(date)
      const isFuture = date > today
      const isBeforeStart = dateStr < CAMPAIGN_START
      const activity =
        isFuture || isBeforeStart
          ? "none"
          : getDayActivity(data, dateStr, redditIds, xIds)
      col.push({ date: dateStr, activity, isToday: dateStr === todayStr, isFuture, isBeforeStart })
    }
    grid.push(col)
  }

  return grid
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""]

export function StreakTracker({ weeklyData }: { weeklyData: WeeklyData }) {
  const { redditIds, xIds } = useMemo(() => getAllItemIds(), [])

  const streak = useMemo(() => computeOverallStreak(weeklyData), [weeklyData])

  const grid = useMemo(
    () => buildGrid(weeklyData, redditIds, xIds),
    [weeklyData, redditIds, xIds]
  )

  // Count active days per platform
  const counts = useMemo(() => {
    let reddit = 0
    let x = 0
    let total = 0
    for (const week of grid) {
      for (const day of week) {
        if (day.activity === "reddit") { reddit++; total++ }
        else if (day.activity === "x") { x++; total++ }
        else if (day.activity === "both") { reddit++; x++; total++ }
      }
    }
    return { reddit, x, total }
  }, [grid])

  // Month markers
  const monthMarkers: { label: string; col: number }[] = []
  let lastMonth = -1
  for (let w = 0; w < grid.length; w++) {
    const firstDay = new Date(grid[w][0].date)
    const month = firstDay.getMonth()
    if (month !== lastMonth) {
      monthMarkers.push({ label: MONTH_LABELS[month], col: w })
      lastMonth = month
    }
  }

  return (
    <div className="rounded-lg border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Activity
          </h3>
          <span className="text-xs text-muted-foreground">
            Mar — Aug 2026
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {streak.current > 0 && <IconFlame className="size-4 text-orange-500" />}
            <span className="text-lg font-bold tabular-nums">{streak.current}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Best: {streak.longest}
          </span>
          <div className="h-4 w-px bg-border" />
          <span className="text-[11px] text-muted-foreground">
            {counts.total} active days
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex gap-[3px]">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pr-1">
          {DAY_LABELS.map((d, i) => (
            <div
              key={i}
              className="h-[12px] flex items-center text-[9px] text-muted-foreground leading-none"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex-1 overflow-hidden">
          {/* Month labels */}
          <div className="relative h-3 mb-[3px]">
            {monthMarkers.map((m) => (
              <span
                key={`${m.label}-${m.col}`}
                className="absolute text-[9px] text-muted-foreground leading-none"
                style={{ left: `${(m.col / grid.length) * 100}%` }}
              >
                {m.label}
              </span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={
                      day.isFuture || day.isBeforeStart
                        ? day.date
                        : `${day.date} — ${day.activity === "none" ? "no activity" : day.activity}`
                    }
                    className={`h-[12px] rounded-[2px] ${getCellClass(day)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <IconBrandReddit className="size-3 text-orange-500" />
            {counts.reddit} days
          </span>
          <span className="flex items-center gap-1">
            <IconBrandX className="size-3 text-blue-400" />
            {counts.x} days
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground">None</span>
          <div className="size-[10px] rounded-[2px] bg-muted/40" />
          <div className="size-[10px] rounded-[2px] bg-orange-500" />
          <span className="text-[9px] text-muted-foreground">Reddit</span>
          <div className="size-[10px] rounded-[2px] bg-blue-500" />
          <span className="text-[9px] text-muted-foreground">X</span>
          <div className="size-[10px] rounded-[2px] bg-emerald-500" />
          <span className="text-[9px] text-muted-foreground">Both</span>
        </div>
      </div>
    </div>
  )
}

function getCellClass(day: CellData): string {
  const todayRing = day.isToday ? "ring-1 ring-primary" : ""

  if (day.isFuture || day.isBeforeStart) return `bg-muted/20 ${todayRing}`

  switch (day.activity) {
    case "reddit":
      return `bg-orange-500 ${todayRing}`
    case "x":
      return `bg-blue-500 ${todayRing}`
    case "both":
      return `bg-emerald-500 ${todayRing}`
    default:
      return `bg-muted/40 ${todayRing}`
  }
}
