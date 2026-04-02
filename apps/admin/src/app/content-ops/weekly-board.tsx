"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  IconChevronLeft,
  IconChevronRight,
  IconBrandReddit,
  IconBrandX,
  IconCalendarEvent,
} from "@tabler/icons-react"
import { DEFAULT_SCHEDULE, type ScheduleItem } from "./content-ops-data"

type WeeklyData = Record<string, Record<string, boolean>>

/** Get Monday of the week containing `date` */
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  // getDay: 0=Sun, 1=Mon ... shift so Mon=0
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function WeeklyBoard({
  weeklyData,
  setWeeklyData,
  weekStart,
  setWeekStart,
}: {
  weeklyData: WeeklyData
  setWeeklyData: (v: WeeklyData | ((prev: WeeklyData) => WeeklyData)) => void
  weekStart: Date
  setWeekStart: (d: Date) => void
}) {
  const today = formatDate(new Date())
  const todayMonday = getMonday(new Date())

  const prevWeek = () => setWeekStart(addDays(weekStart, -7))
  const nextWeek = () => setWeekStart(addDays(weekStart, 7))
  const goToday = () => setWeekStart(todayMonday)

  const isCurrentWeek = formatDate(weekStart) === formatDate(todayMonday)

  const toggleItem = (dateStr: string, itemId: string) => {
    setWeeklyData((prev: WeeklyData) => {
      const dayData = prev[dateStr] || {}
      return {
        ...prev,
        [dateStr]: {
          ...dayData,
          [itemId]: !dayData[itemId],
        },
      }
    })
  }

  // Compute completion for the displayed week
  const weekDays = DEFAULT_SCHEDULE.map((schedule, i) => {
    const date = addDays(weekStart, i)
    const dateStr = formatDate(date)
    const isToday = dateStr === today
    const dayData = weeklyData[dateStr] || {}
    const total = schedule.items.length
    const done = schedule.items.filter((item) => dayData[item.id]).length
    return { schedule, date, dateStr, isToday, dayData, total, done }
  })

  const weekTotal = weekDays.reduce((a, d) => a + d.total, 0)
  const weekDone = weekDays.reduce((a, d) => a + d.done, 0)

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Weekly Board
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {weekDone}/{weekTotal} done
          </Badge>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7" onClick={prevWeek}>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant={isCurrentWeek ? "secondary" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={goToday}
            >
              <IconCalendarEvent className="size-3.5 mr-1" />
              Today
            </Button>
            <Button variant="ghost" size="icon" className="size-7" onClick={nextWeek}>
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week label */}
      <p className="text-xs text-muted-foreground mb-3">
        {formatShort(weekStart)} — {formatShort(addDays(weekStart, 6))}
      </p>

      {/* 7-column grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(({ schedule, dateStr, isToday, dayData }) => (
          <div
            key={dateStr}
            className={`rounded-lg border p-2 min-h-[120px] ${
              isToday
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            {/* Day header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold ${
                  isToday ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {schedule.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatShort(addDays(weekStart, schedule.day))}
              </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-1.5">
              {schedule.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  checked={!!dayData[item.id]}
                  onToggle={() => toggleItem(dateStr, item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ItemRow({
  item,
  checked,
  onToggle,
}: {
  item: ScheduleItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label
      className="flex items-start gap-1.5 cursor-pointer group"
      title={item.description}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5 size-3.5"
      />
      <div className="flex items-center gap-1 min-w-0">
        {item.platform === "reddit" ? (
          <IconBrandReddit className="size-3 text-orange-500 shrink-0" />
        ) : (
          <IconBrandX className="size-3 text-blue-400 shrink-0" />
        )}
        <span
          className={`text-[11px] leading-tight ${
            checked
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {item.label}
        </span>
      </div>
    </label>
  )
}
